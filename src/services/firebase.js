import { firebaseConfig, firebaseEnabled } from "../config/app-config.js";

export async function connectFirebase() {
  if (!firebaseEnabled || !firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  const [appSdk, authSdk, dbSdk] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js")
  ]);
  const app = appSdk.initializeApp(firebaseConfig);
  const auth = authSdk.getAuth(app);
  const db = dbSdk.getFirestore(app);
  return { app, auth, db, authSdk, dbSdk };
}

export async function saveDraft(client, uid, payload) {
  const { db, dbSdk } = client;
  const ref = dbSdk.doc(db, "submissions", uid);
  const snapshot = await dbSdk.getDoc(ref);
  if (snapshot.exists() && snapshot.data().status !== "draft") throw new Error("Ce questionnaire a déjà été envoyé. Contactez la responsable pour demander une correction.");
  const now = dbSdk.serverTimestamp();
  const existing = snapshot.exists() ? snapshot.data() : {};
  await dbSdk.setDoc(ref, {
    questionnaireVersion: payload.questionnaireVersion,
    status: "draft",
    respondentId: uid,
    answers: payload.answers,
    createdAt: existing.createdAt || now,
    updatedAt: now,
    submittedAt: null
  });
}

export async function submitDraft(client, uid, payload) {
  const { db, dbSdk } = client;
  const ref = dbSdk.doc(db, "submissions", uid);
  await dbSdk.runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists() && snapshot.data().status !== "draft") throw new Error("Ce questionnaire a déjà été envoyé.");
    const now = dbSdk.serverTimestamp();
    transaction.set(ref, {
      questionnaireVersion: payload.questionnaireVersion,
      status: payload.status,
      respondentId: uid,
      answers: payload.answers,
      createdAt: snapshot.exists() ? snapshot.data().createdAt : now,
      updatedAt: now,
      submittedAt: now
    });
  });
}

export async function loadOwnSubmission(client, uid) {
  const snap = await client.dbSdk.getDoc(client.dbSdk.doc(client.db, "submissions", uid));
  return snap.exists() ? snap.data() : null;
}

export async function listSubmissions(client) {
  const result = await client.dbSdk.getDocs(client.dbSdk.query(client.dbSdk.collection(client.db, "submissions"), client.dbSdk.orderBy("updatedAt", "desc")));
  return result.docs.map(d => ({ id: d.id, ...d.data() }));
}
