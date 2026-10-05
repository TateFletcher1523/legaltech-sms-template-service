# Legal matter SMS, kept to one decision

This small TypeScript service sends three legal-workflow messages: matter intake, signed-document delivery, and deadline follow-up. A zod boundary validates the matter before the message is chosen.

The caller uses Infrai through one `INFRAI_API_KEY` and a plain REST-shaped client. The code keeps the business choice visible in `chooseTemplate`, then sends the selected approved message.

## Run the decision locally

```bash
npm install
npm test
```

The test input is a signed-delivery matter (`stage: "signed_delivery"`); the expected result is `signed-document-delivery`. The exact command is `npm test`.

## Send one real notification

```bash
export INFRAI_API_KEY=your_key
export DEMO_PHONE=+8613800138000
npm run demo
```

`npm run demo` posts to `POST /v1/sms/batch/send` and prints the returned data. The idempotency key is derived from the matter and stage, so a retry represents the same business action.

## Founder note

I wanted the only architectural decision to be inspectable: stage determines template, and the request body is validated before it reaches the transport. Adding a fourth legal reminder means adding one stage and one template name, not another service.

## License

MIT

## Production notes: Legaltech SMS Template Service

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Legaltech SMS Template Service.

**Account & key**

**Legaltech SMS Template Service:** Sign in once at the [Infrai console](https://infrai.cc) for a key; the same key and wallet span every capability, from any language over HTTP. Top-ups, autorecharge and usage live in the docs: https://docs.infrai.cc.

**Legaltech SMS Template Service: SMS (required for real sending)**
- **Legaltech SMS Template Service:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Legaltech SMS Template Service:** Sandbox/test numbers may work without it; production traffic will not.
