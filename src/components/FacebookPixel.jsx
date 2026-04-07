"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

// ─── Initialize & track PageView ─────────────────────────────────────────────
export function FacebookPixelProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PIXEL_ID || typeof window === "undefined") return;

    // Initialize pixel if not already done
    if (!window.fbq) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js",
      );

      window.fbq("init", PIXEL_ID);
    }

    // Track page view on every route change
    window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}

// ─── Fire Lead event (call after successful form submit) ─────────────────────
export function trackLeadEvent(eventId) {
  if (typeof window !== "undefined" && window.fbq && PIXEL_ID) {
    // eventID must match the server-side event_id for deduplication
    window.fbq("track", "Lead", {}, { eventID: eventId });
  }
}

// ─── General event tracker with server-side sync ─────────────────────────────
export async function trackEvent(eventName, params = {}, userData = {}) {
  if (typeof window === "undefined") return;

  // Generate unique event_id for deduplication
  const eventId = crypto.randomUUID();

  // Fire browser Pixel event
  if (window.fbq && PIXEL_ID) {
    window.fbq("track", eventName, params, { eventID: eventId });
  }

  // Send to server-side CAPI for reliability (Safari, etc.)
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        params,
        userData, // Raw user data, hashed on server
      }),
    });
  } catch (error) {
    console.error("Failed to send event to server:", error);
  }
}

// ─── Fire ViewContent event (optional — call on page load) ───────────────────
export function trackViewContent() {
  if (typeof window !== "undefined" && window.fbq && PIXEL_ID) {
    window.fbq("track", "ViewContent", {
      content_name: "IUL Landing Page",
      content_category: "Life Insurance",
    });
  }
}
