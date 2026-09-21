import type { NextConfig } from "next";

// build.mjs sets this for both the framework and the browser bundle.
// GitHub Actions obtains it from configure-pages; Netlify uses the root ("").
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
};
export default config;
