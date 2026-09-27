import { z } from "zod";
import { uploadImage } from "./infrai-image-client.js";

export const submissionSchema = z.object({
  image: z.string().min(1),
  filename: z.string().min(1),
  caption: z.string().min(1).max(500),
  donorReceipt: z.boolean().default(false),
  volunteerReminder: z.boolean().default(false),
  campaignCode: z.string().min(1)
});

export type Submission = z.infer<typeof submissionSchema>;
export type ScreeningResult = Omit<Submission, "image"> & { decision: "publish" | "hold"; image: Record<string, unknown> };

const privateData = [/\b\d{3}[- ]?\d{2}[- ]?\d{4}\b/, /\b\S+@\S+\.\S+\b/i, /\b(?:patient|diagnosis|medical record)\b/i];

export function decideCaption(caption: string): "publish" | "hold" {
  return privateData.some((pattern) => pattern.test(caption)) ? "hold" : "publish";
}

export async function screenSubmission(input: unknown): Promise<ScreeningResult> {
  const submission = submissionSchema.parse(input);
  const image = await uploadImage(submission.image, submission.filename);
  return { ...submission, image, decision: decideCaption(submission.caption) };
}

if (process.argv[1]?.endsWith("upload-screening.ts")) {
  const body = process.env.SUBMISSION_JSON;
  if (!body) throw new Error("Set SUBMISSION_JSON to a JSON request body");
  const result = await screenSubmission(JSON.parse(body));
  console.log(JSON.stringify(result, null, 2));
}
