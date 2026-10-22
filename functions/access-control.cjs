const { timingSafeEqual } = require("node:crypto");

function codeMatches(submitted, expected) {
  if (typeof submitted !== "string" || typeof expected !== "string") return false;
  const actualBytes = Buffer.from(submitted, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

function createAttemptLimiter({ maxAttempts = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const attempts = new Map();
  return (key, now = Date.now()) => {
    const current = attempts.get(key);
    if (!current || now - current.startedAt >= windowMs) {
      attempts.set(key, { startedAt: now, count: 1 });
      return true;
    }
    if (current.count >= maxAttempts) return false;
    current.count += 1;
    return true;
  };
}

module.exports = { codeMatches, createAttemptLimiter };
