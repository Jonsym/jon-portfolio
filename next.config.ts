import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The projects index lives at /proyectos and links to /proyectos/[slug];
  // the canonical detail pages remain at /proyecto/[slug]. Bridge the two so
  // those links resolve without duplicating the detail route.
  async redirects() {
    return [
      {
        source: "/proyectos/:slug",
        destination: "/proyecto/:slug",
        permanent: false,
      },
      // The canonical contact page is /contact; /contacto links resolve to it.
      {
        source: "/contacto",
        destination: "/contact",
        permanent: false,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
    localPatterns: [
      { pathname: "/projects/**" },
      { pathname: "/icons/**" },
      { pathname: "/about/**" },
      { pathname: "/labs/**" },
      { pathname: "/logos/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
