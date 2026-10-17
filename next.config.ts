import type { NextConfig } from "next";

/**
 * El sitio se publica como HTML estático en GitHub Pages.
 * En Pages vive bajo /malvinizados, así que el workflow define NEXT_PUBLIC_BASE_PATH.
 * En desarrollo local queda vacío y el sitio corre en la raíz.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
