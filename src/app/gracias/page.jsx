import Link from "next/link";

export default function GraciasPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a1628",
        backgroundImage:
          "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1rem",
      }}
    >
      <div style={{ position: "relative", maxWidth: "32rem", width: "100%", textAlign: "center" }}>

        {/* Checkmark */}
        <div
          style={{
            width: "6rem",
            height: "6rem",
            borderRadius: "50%",
            backgroundColor: "rgba(201,168,76,0.12)",
            border: "2px solid rgba(201,168,76,0.6)",
            boxShadow: "0 8px 32px rgba(201,168,76,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
          }}
        >
          <svg width="44" height="44" fill="none" stroke="#e8c97a" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "50%",
              backgroundColor: "rgba(201,168,76,0.15)",
              border: "1px solid rgba(201,168,76,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#e8c97a", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.75rem" }}>EI</span>
          </div>
          <span style={{ color: "#e8c97a", fontFamily: "Georgia, serif", fontSize: "0.875rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
            Empire Investments
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "rgba(13,31,60,0.55)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: "1rem",
            padding: "2.5rem",
            marginBottom: "2rem",
            boxShadow: "0 25px 50px rgba(4,9,15,0.5)",
          }}
        >
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
            ¡Gracias por Tu{" "}
            <span style={{
              background: "linear-gradient(90deg, #c9a84c 0%, #e8c97a 35%, #fff8dc 55%, #e8c97a 75%, #c9a84c 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Solicitud!
            </span>
          </h1>

          {/* Divider */}
          <div style={{ width: "72px", height: "2px", background: "linear-gradient(90deg, transparent, #c9a84c, transparent)", margin: "0 auto 1.5rem" }} />

          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Hemos recibido tu información con éxito. Un asesor de{" "}
            <strong style={{ color: "#e8c97a" }}>Empire Investments</strong> se
            pondrá en contacto contigo muy pronto para ofrecerte una consulta
            personalizada y sin compromiso.
          </p>

          {/* Steps */}
          <div
            style={{
              backgroundColor: "rgba(4,9,15,0.6)",
              border: "1px solid rgba(201,168,76,0.12)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              textAlign: "left",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ color: "#e8c97a", fontSize: "0.7rem", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
              ¿Qué Sigue?
            </p>
            {[
              "Revisamos tu información detalladamente",
              "Un asesor te contactará en las próximas horas",
              "Recibes una propuesta personalizada sin costo",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: i < 2 ? "0.75rem" : 0 }}>
                <span
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    borderRadius: "50%",
                    border: "1px solid rgba(201,168,76,0.4)",
                    backgroundColor: "rgba(201,168,76,0.08)",
                    color: "#e8c97a",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>{text}</p>
              </div>
            ))}
          </div>

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", lineHeight: 1.6 }}>
            📞 Por favor ten tu teléfono disponible. Nuestro asesor te llamará pronto para programar tu consulta gratuita.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", textDecoration: "none" }}
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}