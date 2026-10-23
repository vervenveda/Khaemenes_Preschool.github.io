import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

class MemoryStorage {
  constructor(){ this.data = new Map(); }
  getItem(key){ key=String(key); return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key,value){ this.data.set(String(key),String(value)); }
  removeItem(key){ this.data.delete(String(key)); }
  clear(){ this.data.clear(); }
}

const storage = new MemoryStorage();
const context = {
  window: { localStorage: storage },
  Storage: MemoryStorage,
  Date,
  JSON,
  String,
  Object,
  encodeURIComponent
};
const source = fs.readFileSync(path.join(process.cwd(),"assets/preschool-learner-storage.js"),"utf8");
vm.runInNewContext(source,context,{filename:"preschool-learner-storage.js"});
const profileKey = "khaemenes_preschool_profile_v1";
const progressKey = "boppi-prek-pe-garden-v2";
const profile = id => storage.setItem(profileKey,JSON.stringify({learnerId:id}));

// A legacy, unscoped record must migrate non-destructively to the first
// intentionally selected learner, with a persistent migration receipt.
storage.setItem(progressKey,JSON.stringify({completed:{1:{date:"2026-10-01"}},seconds:30,favorites:[1]}));
profile("learner-A");
const migrated = storage.getItem(progressKey);
assert.ok(migrated,"first learner receives legacy progress");
assert.equal(JSON.parse(migrated).seconds,30);
const api = context.window.KhaemenesPreschoolLearnerStorage;
assert.equal(api.activeLearnerId(),"learner-A");
const marker = api.migrationMarker(progressKey);
assert.ok(storage.getItem(marker),"migration receipt recorded");
assert.equal(JSON.parse(storage.getItem(marker)).learnerId,"learner-A");
assert.ok(storage.getItem(progressKey),"legacy source remains available");

// A second learner must not inherit the same legacy payload.
profile("learner-B");
assert.equal(storage.getItem(progressKey),null,"legacy data must not leak to another learner");
storage.setItem(progressKey,JSON.stringify({completed:{2:{date:"2026-10-02"}},seconds:90,favorites:[2]}));
assert.equal(JSON.parse(storage.getItem(progressKey)).seconds,90);

// Switching back preserves each learner's distinct scoped state.
profile("learner-A");
assert.equal(JSON.parse(storage.getItem(progressKey)).seconds,30);
storage.removeItem(progressKey);
assert.equal(storage.getItem(progressKey),null,"removed record stays removed for learner A");
profile("learner-B");
assert.equal(JSON.parse(storage.getItem(progressKey)).seconds,90,"reset/remove is learner-scoped");

// Guest mode remains backward-compatible and uses ordinary localStorage.
storage.setItem(profileKey,JSON.stringify({}));
storage.setItem("guest-demo-key","guest-value");
assert.equal(storage.getItem("guest-demo-key"),"guest-value");

console.log("PASS: Preschool learner storage migration, identity isolation, scoped reset, and guest compatibility.");
