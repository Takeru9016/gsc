import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend {
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

// Lazily instantiated so importing this module never throws during
// Next.js's build-time page data collection, which only evaluates the
// module — it doesn't invoke the API route handlers where env vars
// are guaranteed to be present.
export const resend = new Proxy({} as Resend, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
