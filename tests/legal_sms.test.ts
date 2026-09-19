import assert from "node:assert/strict";
import { chooseTemplate, matterSchema } from "../src/legal_sms.js";
assert.equal(chooseTemplate("signed_delivery"), "signed-document-delivery");
assert.equal(matterSchema.safeParse({ matterId: "M-1", phone: "+8613800138000", stage: "intake", clientName: "A" }).success, true);
assert.equal(matterSchema.safeParse({ matterId: "", phone: "x", stage: "intake", clientName: "A" }).success, false);
console.log("legal SMS decision test passed");
