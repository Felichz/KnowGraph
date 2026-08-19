import { gatewayHandler } from "../../server/index.js";

export const maxDuration = 300;

export default function handler(req, res) {
  return gatewayHandler(req, res);
}
