import crypto from "crypto";
import { NextResponse } from "next/server";

// ─── Hash helper for Facebook Conversions API ────────────────────────────────
const hash = (val) => crypto.createHash('sha256')
  .update(val.trim().toLowerCase()).digest('hex');

// ─── POST /api/events ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { eventName, eventId, params = {}, userData = {} } = body;

    // ── Validate ─────────────────────────────────────────────────────────────
    if (!eventName || !eventId) {
      return NextResponse.json(
        { success: false, error: "eventName and eventId are required." },
        { status: 400 }
      );
    }

    // ── Facebook Conversions API (Server-Side Event) ─────────────────────────
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (pixelId && accessToken) {
      console.log(`Sending CAPI event: ${eventName}`);

      const fbPayload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            action_source: "website",
            event_source_url: "https://www.vtrcacerescapital.com",
            user_data: {
              em: userData.email ? [hash(userData.email)] : [],
              ph: userData.phone ? [hash(userData.phone)] : [],
              fn: userData.firstName ? [hash(userData.firstName)] : [],
              ln: userData.lastName ? [hash(userData.lastName)] : [],
              client_ip_address: request.headers.get("x-forwarded-for") || "",
              client_user_agent: request.headers.get("user-agent") || "",
            },
            custom_data: params, // Include any custom parameters
          },
        ],
        // Include test_event_code if set in env for testing
        ...(process.env.FB_TEST_EVENT_CODE && {
          test_event_code: process.env.FB_TEST_EVENT_CODE,
        }),
      };

      const fbResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fbPayload),
        }
      );

      const fbData = await fbResponse.json();
      console.log("Meta response:", fbData);

      if (!fbResponse.ok) {
        console.error("Facebook CAPI error:", fbData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /events error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Block non-POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}