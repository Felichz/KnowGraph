import { gatewayHandler } from "../../server/index.js";

// Keep the endpoint compatible with the five-minute local gateway budget.
// The actual maximum is still constrained by the Vercel project plan.
export const maxDuration = 300;

export default function handler(req, res) {
  return gatewayHandler(req, res);
}
