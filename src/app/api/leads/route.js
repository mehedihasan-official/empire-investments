import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import { NextResponse } from "next/server";

// ─── Hash helper for Facebook Conversions API ────────────────────────────────
function sha256(value) {
  if (!value) return "";
  return crypto
    .createHash("sha256")
    .update(String(value).trim().toLowerCase())
    .digest("hex");
}

// ─── POST /api/leads ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      nombre,
      estado,
      edad,
      tieneIUL,
      dondeInvierte,
      paraQueIUL,
      cuantoInvertir,
      userAgent,
    } = body;

    // ── Validation ──────────────────────────────────────────────────────────
    if (!nombre || !estado || !edad || !tieneIUL || !dondeInvierte || !cuantoInvertir) {
      return NextResponse.json(
        { success: false, error: "Por favor completa todos los campos requeridos." },
        { status: 400 }
      );
    }

    const edadNum = parseInt(edad);
    if (isNaN(edadNum) || edadNum < 18 || edadNum > 100) {
      return NextResponse.json(
        { success: false, error: "Por favor ingresa una edad válida." },
        { status: 400 }
      );
    }

    // ── Save lead to MongoDB ─────────────────────────────────────────────────
    const client = await clientPromise();
    const db = client.db("empire_investments");
    const leadsCollection = db.collection("leads");

    const leadDoc = {
      nombre: nombre.trim(),
      estado,
      edad: edadNum,
      tieneIUL,
      dondeInvierte,
      paraQueIUL: paraQueIUL?.trim() || "",
      cuantoInvertir,
      source: "landing_page",
      createdAt: new Date(),
      metadata: {
        userAgent: userAgent || "",
      },
    };

    const result = await leadsCollection.insertOne(leadDoc);
    const leadId = result.insertedId.toString();

    // ── Facebook Conversions API (Server-Side Event) ─────────────────────────
    const pixelId = process.env.FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (pixelId && accessToken) {
      const nameParts = nombre.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const fbPayload = {
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            event_id: leadId, // used for deduplication with client-side pixel
            event_source_url: "https://your-domain.com", // ← update with your real domain
            action_source: "website",
            user_data: {
              fn: firstName ? [sha256(firstName)] : [],
              ln: lastName ? [sha256(lastName)] : [],
              st: [sha256(estado)],
              client_user_agent: userAgent || "",
            },
            custom_data: {
              lead_type: "IUL",
              investment_range: cuantoInvertir,
              has_iul: tieneIUL,
              current_investment_vehicle: dondeInvierte,
              language: "es",
              target_audience: "Hispanic",
            },
          },
        ],
        // Only include test_event_code if set in env (remove in production)
        ...(process.env.FB_TEST_EVENT_CODE && {
          test_event_code: process.env.FB_TEST_EVENT_CODE,
        }),
      };

      try {
        const fbResponse = await fetch(
          `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fbPayload),
          }
        );

        if (!fbResponse.ok) {
          const fbError = await fbResponse.json();
          console.error("Facebook CAPI error:", fbError);
        }
      } catch (fbError) {
        // Don't fail the request if FB API has issues — lead is already saved
        console.error("Facebook CAPI request failed:", fbError.message);
      }
    }

    return NextResponse.json(
      { success: true, id: leadId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead API error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}

// Block non-POST requests
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}