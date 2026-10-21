// Firebase Web configuration is public by design. Protect data with Auth and Firestore rules.
export const firebaseConfig = {
  apiKey: "AIzaSyB-K9vSMOm98CrTnzlcwNO-lyrvXChx4do",
  authDomain: "pety-1f7c9.firebaseapp.com",
  projectId: "pety-1f7c9",
  storageBucket: "pety-1f7c9.firebasestorage.app",
  messagingSenderId: "998317747878",
  appId: "1:998317747878:web:8897d2b2a9931b5f17ce67",
  measurementId: "G-SPBSZ1CBC3"
};

// If Firebase is unavailable, the questionnaire stays open but cannot be saved or sent.
export const firebaseEnabled = true;
export const questionnaireVersion = "3.0.0";
export const businessName = ""; // Empty uses the neutral title above.
export const privacyContact = "À renseigner par la commanditaire";
export const retentionPeriod = "À définir avec la commanditaire";
