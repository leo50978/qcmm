import test from "node:test";
import assert from "node:assert/strict";
import { buildVisualSteps } from "../src/engine/visual-steps.js";

const screens=[
  {id:"one",panes:[{id:"a"},{id:"b"}]},
  {id:"two",panes:[{id:"c"}]}
];

test("wide view keeps related panes together",()=>{
  const steps=buildVisualSteps(screens,false);
  assert.deepEqual(steps.map(x=>x.panes.map(p=>p.id)),[["a","b"],["c"]]);
});

test("compact view splits dense screens without changing pane identities",()=>{
  const steps=buildVisualSteps(screens,true);
  assert.deepEqual(steps.map(x=>x.panes.map(p=>p.id)),[["a"],["b"],["c"]]);
  assert.equal(steps[0].screen.id,"one");
  assert.equal(steps[1].screen.id,"one");
});
