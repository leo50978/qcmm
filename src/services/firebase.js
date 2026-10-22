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
  const client = { app, auth, db, authSdk, dbSdk };
  return client;
}

export async function signInRespondent(client) {
  const existing = client.auth.currentUser;
  if (existing?.isAnonymous) return existing;
  const credential = await client.authSdk.signInAnonymously(client.auth);
  return credential.user;
}

export async function saveDraft(client, uid, payload, submissionId = null) {
  const { db, dbSdk } = client;
  const ref = submissionId
    ? dbSdk.doc(db, "submissions", submissionId)
    : dbSdk.doc(dbSdk.collection(db, "submissions"));
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
  return ref.id;
}

export async function submitDraft(client, uid, payload, submissionId = null) {
  const { db, dbSdk } = client;
  const ref = submissionId
    ? dbSdk.doc(db, "submissions", submissionId)
    : dbSdk.doc(dbSdk.collection(db, "submissions"));
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
  return ref.id;
}

export async function loadOwnSubmissions(client, uid) {
  const { db, dbSdk } = client;
  const result = await dbSdk.getDocs(dbSdk.query(
    dbSdk.collection(db, "submissions"),
    dbSdk.where("respondentId", "==", uid)
  ));
  return result.docs
    .map(document => ({ id: document.id, ...document.data() }))
    .sort((a, b) => submissionDate(b) - submissionDate(a));
}

function submissionDate(submission) {
  const value = submission.submittedAt || submission.updatedAt || submission.createdAt;
  return value?.toDate ? value.toDate().getTime() : new Date(value || 0).getTime();
}
