import test from "node:test";
import assert from "node:assert/strict";
import { clearLocal, readLocal, writeLocal } from "../src/services/persistence.js";

const values=new Map();
globalThis.localStorage={
  getItem:key=>values.has(key)?values.get(key):null,
  setItem:(key,value)=>values.set(key,String(value)),
  removeItem:key=>values.delete(key)
};

test("un brouillon local peut être restauré puis effacé",()=>{
  values.clear();
  const answers={"geo.enabled":{value:"to_discuss"}};
  assert.equal(writeLocal("respondent-a",answers),true);
  assert.deepEqual(readLocal("respondent-a").answers,answers);
  clearLocal("respondent-a");
  assert.equal(readLocal("respondent-a"),null);
});

test("un brouillon local expiré est supprimé à sa lecture",()=>{
  const key="pet-sitting-questionnaire:expired";
  values.set(key,JSON.stringify({updatedAt:new Date(Date.now()-8*24*60*60*1000).toISOString(),answers:{}}));
  assert.equal(readLocal("expired"),null);
  assert.equal(values.has(key),false);
});

test("un stockage local bloqué ne fait pas planter la sauvegarde",()=>{
  const previous=globalThis.localStorage;
  globalThis.localStorage={setItem(){throw new Error("Storage disabled");},removeItem(){throw new Error("Storage disabled");}};
  try{
    assert.equal(writeLocal("blocked",{}),false);
    assert.doesNotThrow(()=>clearLocal("blocked"));
  }finally{globalThis.localStorage=previous;}
});
