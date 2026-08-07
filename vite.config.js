import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const tunnelHost = process.env.NGROK_HOST?.trim();
const gatewayTarget = process.env.GATEWAY_TARGET ?? "http://127.0.0.1:4317";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      ".ngrok-free.app",
      ".ngrok.app",
      ".ngrok.io",
      ...(tunnelHost ? [tunnelHost] : []),
    ],
    proxy: {
      "/api/ai": {
        target: gatewayTarget,
        changeOrigin: false,
      },
    },
  },
});
