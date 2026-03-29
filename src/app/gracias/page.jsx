import Link from "next/link";

export default function GraciasPage() {
  return (
    <main className="min-h-screen geo-bg flex items-center justify-center px-4 py-20" style={{ backgroundColor: 'var(--color-navy-900)' }}>

      {/* Background orb */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: 'rgba(201,168,76,0.04)' }}
      />

      <div className="relative max-w-lg w-full text-center space-y-8">

        {/* Success checkmark */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-fade-in"
          style={{
            backgroundColor: 'rgba(201,168,76,0.12)',
            border: '2px solid rgba(201,168,76,0.6)',
            boxShadow: '0 8px 32px rgba(201,168,76,0.1)',
          }}
        >
          <svg
            className="w-11 h-11 text-gold-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)' }}
          >
            <span className="text-gold-400 font-display font-bold text-xs">EI</span>
          </div>
          <p className="text-gold-400 font-display text-sm uppercase font-semibold" style={{ letterSpacing: '0.15em' }}>
            Empire Investments
          </p>
        </div>

        {/* Main card */}
        <div
          className="rounded-2xl p-8 space-y-6"
          style={{
            backgroundColor: 'rgba(13,31,60,0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,168,76,0.2)',
            boxShadow: '0 25px 50px rgba(4,9,15,0.5)',
          }}
        >
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold text-white">
              ¡Gracias por Tu{" "}
              <span className="gold-shimmer">Solicitud!</span>
            </h1>
            <div className="gold-divider" />
          </div>

          <p className="text-white/60 leading-relaxed">
            Hemos recibido tu información con éxito. Un asesor de{" "}
            <strong className="text-gold-400">Empire Investments</strong> se
            pondrá en contacto contigo muy pronto para ofrecerte una consulta
            personalizada y sin compromiso.
          </p>

          {/* Next steps */}
          <div
            className="rounded-xl p-6 space-y-4 text-left"
            style={{ backgroundColor: 'rgba(4,9,15,0.6)', border: '1px solid rgba(201,168,76,0.12)' }}
          >
            <p className="text-gold-400 font-black text-xs uppercase" style={{ letterSpacing: '0.12em' }}>
              ¿Qué Sigue?
            </p>
            {[
              "Revisamos tu información detalladamente",
              "Un asesor te contactará en las próximas horas",
              "Recibes una propuesta personalizada sin costo",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <span
                  className="w-7 h-7 rounded-full text-gold-400 text-xs font-black flex items-center justify-center flex-shrink-0"
                  style={{ border: '1px solid rgba(201,168,76,0.4)', backgroundColor: 'rgba(201,168,76,0.08)' }}
                >
                  {i + 1}
                </span>
                <p className="text-white/60 text-sm">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-white/35 text-xs leading-relaxed">
            📞 Por favor ten tu teléfono disponible. Nuestro asesor te llamará
            pronto para programar tu consulta gratuita.
          </p>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="inline-block text-sm transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--color-gold-400)'}
          onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.3)'}
        >
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}