import assert from "node:assert/strict";
import { prorate } from "./prorate.js";

// 30-day month, 10 days used, $30.00/mo -> exactly $10.00. Exact either way;
// this one anchors that the function is basically working.
assert.equal(prorate(3000, 10, 30), 1000, "even split should be exact");

// Half of a 30-day month at $9.99/mo -> 499.5 cents exactly.
// Billing policy is round-half-up, so this must be 500. Truncation gives 499.
assert.equal(prorate(999, 15, 30), 500, "half period should round half up");

console.log("all tests passed");
