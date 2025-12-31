import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubActions ? '/grid9-english' : '',
  assetPrefix: isGithubActions ? '/grid9-english' : '',
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? '/grid9-english' : '',
  },
};

export default nextConfig;
