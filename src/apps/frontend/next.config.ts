import type { NextConfig } from "next";

// Cap Turbopack/worker threads during production builds so the deploy
// server (typically a 2 vCPU VPS) is not pushed to 400% CPU when Coolify
// builds backend + frontend in parallel. Dev is unaffected because
// NODE_ENV is not "production" outside the Docker build stage.
const isProductionBuild = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  ...(isProductionBuild && {
    experimental: {
      cpus: 1,
    },
  }),
};

export default nextConfig;
