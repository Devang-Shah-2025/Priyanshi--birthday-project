/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Empty turbopack config to use Turbopack (Next.js 16 default)
  turbopack: {},
  
  // Transpile three.js related packages
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
}

module.exports = nextConfig
