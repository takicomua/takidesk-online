import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "takiDesk Online",
    short_name: "takiDesk",
    description: "Акаунт і підключення до твого ПК через takiDesk Online.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0a0d12",
    theme_color: "#0a0d12",
    lang: "uk",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
