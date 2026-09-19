import { z } from "zod";
import { infrai } from "./infrai.js";

export const matterSchema = z.object({ matterId: z.string().min(1), phone: z.string().min(6), stage: z.enum(["intake", "signed_delivery", "deadline_follow_up"]), clientName: z.string().min(1) });
export type Matter = z.infer<typeof matterSchema>;
const templates = { intake: "matter-intake", signed_delivery: "signed-document-delivery", deadline_follow_up: "deadline-follow-up" } as const;

export function chooseTemplate(stage: Matter["stage"]) { return templates[stage]; }

export async function sendMatterSms(input: unknown) {
  const matter = matterSchema.parse(input);
  const templateId = chooseTemplate(matter.stage);
  const message = `${templateId}: ${matter.clientName} (${matter.matterId})`;
  return infrai.sms.batch.send({ messages: [{ to: matter.phone, message }] }, `matter:${matter.matterId}:${matter.stage}`);
}
