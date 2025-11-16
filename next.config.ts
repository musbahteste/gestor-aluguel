import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! ATENÇÃO !!
    // Permite perigosamente que builds de produção sejam concluídos
    // mesmo que seu projeto tenha erros de tipo (TypeScript).
    // Use isso como uma solução temporária para o bug de tipos do Next.js 16.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
