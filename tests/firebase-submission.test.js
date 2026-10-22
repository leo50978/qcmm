import test from "node:test";
import assert from "node:assert/strict";
import { saveDraft, submitDraft } from "../src/services/firebase.js";

function makeClient(){
  const writes=[];
  let nextId=0;
  let reads=0;
  const db={};
  const dbSdk={
    collection:()=>({}),
    doc:(_db,_collection,id)=>({id:id||`form-${++nextId}`}),
    getDoc:async()=>{reads++;throw new Error("new documents must not be read before create");},
    serverTimestamp:()=>"server-time",
    setDoc:async(ref,data)=>writes.push({id:ref.id,data}),
    runTransaction:async()=>{throw new Error("new submissions must use a direct create");}
  };
  return {client:{db,dbSdk},writes,get reads(){return reads;}};
}

test("crée un nouveau brouillon sans tenter de lire un document inexistant",async()=>{
  const mock=makeClient();
  const id=await saveDraft(mock.client,"respondent-a",{questionnaireVersion:"3.0.0",answers:{}});
  assert.equal(id,"form-1");
  assert.equal(mock.reads,0);
  assert.equal(mock.writes[0].data.respondentId,"respondent-a");
  assert.equal(mock.writes[0].data.status,"draft");
});

test("crée un envoi sans transaction de lecture préalable",async()=>{
  const mock=makeClient();
  const id=await submitDraft(mock.client,"respondent-a",{questionnaireVersion:"3.0.0",answers:{},status:"submitted"});
  assert.equal(id,"form-1");
  assert.equal(mock.reads,0);
  assert.equal(mock.writes[0].data.status,"submitted");
  assert.equal(mock.writes[0].data.respondentId,"respondent-a");
});
