"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      // Add event listeners to handle PWA lifecycle
      wb.addEventListener("installed", (event: any) => {
        console.log(`PWA app installed: ${event.type}`);
      });
      wb.addEventListener("controlled", (event: any) => {
        console.log(`PWA app controlled: ${event.type}`);
      });
      wb.addEventListener("activated", (event: any) => {
        console.log(`PWA app activated: ${event.type}`);
      });

      // Register the service worker
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope,
            );
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });
      }
    }
  }, []);

  return null;
}
