import clientPromise from "@/lib/mongodb";
import crypto from "crypto";
import { NextResponse } from "next/server";

// ─── Hash helper for Facebook Conversions API ────────────────────────────────
const hash = (val) => crypto.createHash('sha256')
  .update(val.trim().toLowerCase()).digest('hex');

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
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (pixelId && accessToken) {
      console.log("Sending CAPI event...");

      const fbResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: [
              {
                event_name: "Lead",
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                event_source_url: "https://www.vtrcacerescapital.com",

                // ✅ IMPORTANT
                test_event_code: "TEST31392",

                user_data: {
                  client_ip_address: request.headers.get("x-forwarded-for") || "",
                  client_user_agent: request.headers.get("user-agent") || "",
                },
              },
            ],
          }),
        }
      );

      const fbData = await fbResponse.json();
      console.log("Meta response:", fbData);

      if (!fbResponse.ok) {
        console.error("Facebook CAPI error:", fbData);
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