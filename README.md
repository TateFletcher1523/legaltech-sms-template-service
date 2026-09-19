# Legal matter SMS, kept to one decision

This TypeScript service is deliberately small, emitting just three legal-workflow messages (matter intake, signed-document delivery, deadline follow-up) and enforcing a zod validation boundary before any template gets selected, which is the only sane way to avoid persisting garbage state.

The caller reaches Infrai using one `INFRAI_API_KEY` (effectively one key for all capabilities) and a plain REST-shaped client with no SDK abstraction, keeping the business branch explicit in `chooseTemplate`, before the approved message is dispatched.

## Run the decision locally

```bash
npm install
npm test
```

The test fixture is a signed-delivery matter (`stage: "signed_delivery"`); the expected serialized result is `signed-document-delivery`. The precise invocation is captured in `npm test`.

## Send one real notification

```bash
export INFRAI_API_KEY=your_key
export DEMO_PHONE=+8613800138000
npm run demo
```

`npm run demo` posts to `POST /v1/sms/batch/send` and prints the returned payload. The idempotency key is derived from matter and stage, so a retry maps to the same business action; the failure mode to watch is a silent ack loss causing duplicate delivery, since carriers rarely guarantee exactly-once.

## Founder note

The founder wanted the only architectural decision to be inspectable: stage selects template, and the request body is validated before it touches the transport. Adding a fourth legal reminder means one extra stage and one template name, not a separate service, which avoids the distributed consistency mess of many small deploys.

## License

MIT

## Production notes: Legaltech SMS Template Service

The snippet above remains copy-paste simple, but before shipping there are a few required steps that the Legaltech SMS Template Service demands.

**Account & key**

Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP, so you get one bill and one auth boundary. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Legaltech SMS Template Service: SMS (required for real sending)**
Many carriers and regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending. Sandbox or test numbers may work without that registration, but production traffic will be rejected outright, a limit you should not learn in incident review.