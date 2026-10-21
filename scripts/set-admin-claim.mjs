import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const [uid, action="grant"] = process.argv.slice(2);
if (!uid || !["grant", "revoke"].includes(action)) {
  console.error("Usage: node scripts/set-admin-claim.mjs <firebase-auth-uid> [grant|revoke]");
  process.exit(2);
}
initializeApp({ credential: applicationDefault(), projectId: "pety-1f7c9" });
const auth=getAuth();
const user=await auth.getUser(uid);
const claims={...(user.customClaims||{})};
if(action==="grant")claims.admin=true;else delete claims.admin;
await auth.setCustomUserClaims(uid,claims);
console.log(`Admin claim ${action} applied to ${uid}. The user must sign in again.`);
