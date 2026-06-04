import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import { mergeConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite"

export const baseConfig = {
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/**/*.png"],
      manifest: {
        id: "/",
        name: "kemitel-bbp",
        short_name: "kemitel-bbp",
        description: "Community Finance Platform",
        theme_color: "#2061AC",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          // Android
          {
            src: "icons/android/launchericon-48x48.png",
            sizes: "48x48",
            type: "image/png"
          },
          {
            src: "icons/android/launchericon-72x72.png",
            sizes: "72x72",
            type: "image/png"
          },
          {
            src: "icons/android/launchericon-96x96.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "icons/android/launchericon-144x144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "icons/android/launchericon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/android/launchericon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "icons/android/launchericon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          },
          // Windows
          {
            src: "icons/windows/Square44x44Logo.scale-100.png",
            sizes: "44x44",
            type: "image/png"
          },
          {
            src: "icons/windows/Square150x150Logo.scale-100.png",
            sizes: "150x150",
            type: "image/png"
          },
          {
            src: "icons/windows/Wide310x150Logo.scale-100.png",
            sizes: "310x150",
            type: "image/png"
          },
          {
            src: "icons/windows/LargeTile.scale-100.png",
            sizes: "310x310",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallbackDenylist: [
          /^\/oauth2\//,
          /^\/login\/oauth2\//,
          /^\/rest\/login\/oauth2\//,
          /^\/rest\/oauth2\//,
          /^\/cookie\//,
          /^\/logout/,
          /^\/userinfo/
        ],
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) =>
              request.mode === "navigate" &&
              (url.pathname.startsWith("/oauth2/") ||
                url.pathname.startsWith("/login/oauth2/") ||
                url.pathname.startsWith("/rest/login/oauth2/") ||
                url.pathname.startsWith("/rest/oauth2/") ||
                url.pathname.startsWith("/cookie/") ||
                url.pathname.startsWith("/logout") ||
                url.pathname.startsWith("/userinfo")),
            handler: "NetworkOnly"
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/rest/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const additionalConfig = {
    build: {
      outDir: mode === "staging" ? "dist-staging" : "dist"
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      allowedHosts: ["kemitel-bbp-dev.cm", "localhost"]
    }
  };
  return mergeConfig(baseConfig, additionalConfig);
});
