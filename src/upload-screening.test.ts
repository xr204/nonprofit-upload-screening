import assert from "node:assert/strict";
import { decideCaption, submissionSchema } from "./upload-screening.js";

const clean = submissionSchema.parse({ image: "data:image/jpeg;base64,AA==", filename: "pic.jpg", caption: "Volunteers packing meals", campaignCode: "MEALS-24" });
assert.equal(decideCaption(clean.caption), "publish");
assert.equal(decideCaption("Patient diagnosis recorded in this photo"), "hold");
assert.throws(() => submissionSchema.parse({ image: "", filename: "x.jpg", caption: "ok", campaignCode: "x" }));
console.log("caption screening decisions pass");
