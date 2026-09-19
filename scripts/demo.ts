import { sendMatterSms } from "../src/legal_sms.js";
const phone = process.env.DEMO_PHONE;
if (!phone) throw new Error("DEMO_PHONE is required");
const result = await sendMatterSms({ matterId: "MAT-104", phone, stage: "signed_delivery", clientName: "Lin Chen" });
console.log("signed document notification accepted:", result);
