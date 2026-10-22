import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

const emulator=process.env.FIRESTORE_EMULATOR_HOST||"";
const [host,portText]=emulator.split(":");
test("Firestore protège la propriété, la liste admin et les envois finalisés",{skip:!emulator&&"Démarrer Firebase Emulator Suite (FIRESTORE_EMULATOR_HOST)"},async()=>{
  const env=await initializeTestEnvironment({
    projectId:"demo-pet-questionnaire",
    firestore:{host,port:Number(portText),rules:readFileSync(fileURLToPath(new URL("../firestore.rules",import.meta.url)),"utf8")}
  });
  try{
    await env.clearFirestore();
    const a=env.authenticatedContext("respondent-a",{firebase:{sign_in_provider:"anonymous"}}).firestore();
    const b=env.authenticatedContext("respondent-b").firestore();
    const anonymous=env.unauthenticatedContext().firestore();
    const admin=env.authenticatedContext("admin-user",{admin:true}).firestore();
    const payload=uid=>({questionnaireVersion:"3.0.0",status:"draft",respondentId:uid,answers:{"geo.enabled":{value:"to_discuss"}},createdAt:serverTimestamp(),updatedAt:serverTimestamp(),submittedAt:null});
    await assertSucceeds(setDoc(doc(a,"submissions/draft-a"),payload("respondent-a")));
    await assertSucceeds(setDoc(doc(a,"submissions/draft-b"),payload("respondent-a")));
    await assertFails(getDoc(doc(a,"submissions/respondent-b")));
    await assertFails(getDoc(doc(anonymous,"submissions/respondent-a")));
    await assertFails(getDocs(collection(anonymous,"submissions")));
    await assertFails(getDocs(collection(b,"submissions")));
    await assertFails(getDocs(collection(a,"submissions")));
    const ownForms=await assertSucceeds(getDocs(query(collection(a,"submissions"),where("respondentId","==","respondent-a"))));
    assert.equal(ownForms.size,2,"un répondant peut enregistrer plusieurs formulaires");
    await assertFails(getDocs(query(collection(a,"submissions"),where("respondentId","==","respondent-b"))));
    await assertSucceeds(getDocs(collection(admin,"submissions")));
    await assertFails(setDoc(doc(b,"submissions/respondent-b"),payload("respondent-b")));
    await assertFails(updateDoc(doc(b,"submissions/draft-a"),{status:"submitted",submittedAt:serverTimestamp(),updatedAt:serverTimestamp()}));
    await assertSucceeds(updateDoc(doc(a,"submissions/draft-a"),{status:"submitted",submittedAt:serverTimestamp(),updatedAt:serverTimestamp()}));
    await assertFails(updateDoc(doc(a,"submissions/draft-a"),{answers:{changed:{value:"no"}},updatedAt:serverTimestamp()}));
  }finally{await env.cleanup();}
});
