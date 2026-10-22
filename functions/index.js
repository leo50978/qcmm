const { createHash } = require("node:crypto");
const { getApps, initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { codeMatches, createAttemptLimiter } = require("./access-control.cjs");

if (!getApps().length) initializeApp();

const adminAccessCode = defineSecret("ADMIN_ACCESS_CODE");
const allowAttempt = createAttemptLimiter();

exports.unlockAdmin = onCall(
  { region: "us-central1", maxInstances: 1, secrets: [adminAccessCode] },
  async request => {
    const ip = request.rawRequest.ip || "unknown";
    const key = createHash("sha256").update(ip).digest("hex");
    if (!allowAttempt(key)) {
      throw new HttpsError("resource-exhausted", "Too many attempts.");
    }

    if (!codeMatches(request.data?.code, adminAccessCode.value())) {
      throw new HttpsError("permission-denied", "Invalid access code.");
    }

    const snapshot = await getFirestore().collection("submissions")
      .orderBy("updatedAt", "desc")
      .limit(100)
      .get();
    const submissions = snapshot.docs.map(document => {
      const data = document.data();
      const toIso = value => value?.toDate?.().toISOString() || null;
      return {
        id: document.id,
        questionnaireVersion: data.questionnaireVersion,
        status: data.status,
        respondentId: data.respondentId,
        answers: data.answers,
        createdAt: toIso(data.createdAt),
        updatedAt: toIso(data.updatedAt),
        submittedAt: toIso(data.submittedAt)
      };
    });
    return { submissions };
  }
);
