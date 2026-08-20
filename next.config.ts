import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  experimental: {
    serverActions: {
      // O formulário de artigo anuncia limite de 10MB para o PDF anexado
      // (MAX_ATTACHMENT_SIZE em src/app/actions/articles.ts); o padrão do
      // Next.js pra Server Actions é 1MB, o que rejeitava qualquer anexo
      // real acima disso. Damos uma margem para o overhead do multipart.
      bodySizeLimit: "11mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
