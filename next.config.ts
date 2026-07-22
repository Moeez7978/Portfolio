import type { NextConfig } from "next";

const isPagesDeployment = process.env.NEXT_PUBLIC_BASE_PATH === "/Portfolio";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isPagesDeployment && {
    basePath: "/Portfolio",
    assetPrefix: "/Portfolio",
  }),
};

export default nextConfig;
