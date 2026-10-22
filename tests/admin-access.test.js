import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { codeMatches, createAttemptLimiter } = require("../functions/access-control.cjs");

test("le code d’accès est comparé comme une chaîne exacte", () => {
  assert.equal(codeMatches("1199", "1199"), true);
  assert.equal(codeMatches("1198", "1199"), false);
  assert.equal(codeMatches("01199", "1199"), false);
  assert.equal(codeMatches(1199, "1199"), false);
});

test("limite les essais par navigateur réseau pendant quinze minutes", () => {
  const allow = createAttemptLimiter({ maxAttempts: 5, windowMs: 900_000 });
  for (let i = 0; i < 5; i++) assert.equal(allow("ip-a", i), true);
  assert.equal(allow("ip-a", 6), false);
  assert.equal(allow("ip-b", 6), true);
  assert.equal(allow("ip-a", 900_000), true);
});
