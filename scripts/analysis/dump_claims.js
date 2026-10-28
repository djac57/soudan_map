/*
 * scripts/analysis/dump_claims.js
 * Read-only helper for the ANALYSE / "poussees probables" layer.
 * Loads data/layer_maps.js in a minimal window shim and writes its
 * `claims` object (SAF/RSF dated claims + `contested` flag) as plain JSON,
 * so the Python builder can consume it without parsing JS.
 *
 * Usage:  node scripts/analysis/dump_claims.js <layer_maps.js> <out_claims.json>
 * Does NOT modify any project file. Owns nothing but this script.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const src = process.argv[2];
const out = process.argv[3];
if (!src || !out) {
  console.error("usage: node dump_claims.js <layer_maps.js> <out_claims.json>");
  process.exit(2);
}

// minimal shim: layer_maps.js only touches window.SUDAN
global.window = global.window || {};
require(path.resolve(src));

const claims = (global.window.SUDAN && global.window.SUDAN.claims) || null;
if (!claims) {
  console.error("no window.SUDAN.claims found in " + src);
  process.exit(1);
}
fs.writeFileSync(out, JSON.stringify(claims, null, 0));
console.error(
  "wrote " + out + " (saf=" + (claims.saf || []).length +
  ", rsf=" + (claims.rsf || []).length + ")"
);
