/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Make sure headers allow embedding in Microsoft Teams (iframe)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // Important: allow iframe embedding in Teams
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.teams.microsoft.com https://teams.microsoft.com;", // Embed policy
          },
        ],
      },
    ];
  },
};

export default nextConfig;
