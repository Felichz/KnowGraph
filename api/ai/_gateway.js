import { gatewayHandler } from "../../server/index.js";

export function createGatewayHandler() {
  return (req, res) => gatewayHandler(req, res);
}
