import test from "node:test";
import assert from "node:assert/strict";
import { signInRespondent } from "../src/services/firebase.js";

test("reuse la session anonyme Firebase existante sur cet appareil",async()=>{
  const existing={uid:"same-device",isAnonymous:true};
  const client={auth:{currentUser:existing},authSdk:{signInAnonymously(){throw new Error("ne devrait pas être appelé");}}};
  assert.equal(await signInRespondent(client),existing);
});

test("ouvre une session anonyme sans identifiant répondant",async()=>{
  const anonymous={uid:"anonymous-session",isAnonymous:true};
  let signInCalls=0;
  const client={auth:{currentUser:null},authSdk:{async signInAnonymously(){signInCalls++;return{user:anonymous};}}};
  assert.equal(await signInRespondent(client),anonymous);
  assert.equal(signInCalls,1);
});
