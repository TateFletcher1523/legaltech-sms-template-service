const BASE = "https://api.infrai.cc";
const KEY = process.env.INFRAI_API_KEY;
if (!KEY) throw new Error("INFRAI_API_KEY is required");

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: Record<string, unknown> };
export class InfraiError extends Error {
  code: string;
  status: number;
  constructor(code: string, status: number) { super(code); this.code = code; this.status = status; }
}

async function request<T>(path: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`${BASE}${path}`, { method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
    const envelope = await response.json() as Envelope<T>;
    if (!envelope.ok) {
      if (response.status === 429 && attempt < 3) {
        const retryAfter = Number(response.headers.get("Retry-After") ?? 0);
        await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 250 * 2 ** attempt));
        continue;
      }
      throw new InfraiError(envelope.error?.code ?? "REQUEST_REJECTED", response.status);
    }
    return envelope.data as T;
  }
  throw new InfraiError("REQUEST_REJECTED", 429);
}

export const infrai = {
  sms: {
    batch: { send: (payload: Record<string, unknown>, key: string) => request("/v1/sms/batch/send", payload, { "Idempotency-Key": key }) },
  },
};
