/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Garante que a carteirinha de demonstração (fora de /public) vá junto no deploy da Vercel.
  outputFileTracingIncludes: { "/api/**/*": ["./storage/seed/**/*"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default nextConfig;
