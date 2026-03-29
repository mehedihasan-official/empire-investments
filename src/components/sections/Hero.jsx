import LeadForm from "@/components/LeadForm";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 geo-bg overflow-hidden">

      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-gold-500/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-gold-600/4 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left: Copy ──────────────────────────────────────── */}
          <div className="space-y-8 animate-fade-up">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-gold-500/8 border border-gold-500/30 rounded-full px-5 py-2">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse_gold" />
              <span className="text-gold-400 text-xs font-black tracking-[0.15em] uppercase">
                IUL · Protección Hipotecaria
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl md:text-5xl xl:text-[3.5rem] font-bold leading-[1.15]">
                <span className="text-white">Asegura el</span>{" "}
                <span className="gold-shimmer">Futuro</span>
                <br />
                <span className="text-white">de Tu Familia</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-white/65 text-lg leading-relaxed max-w-lg">
              Con un plan de{" "}
              <strong className="text-gold-400 font-bold">Vida Indexada Universal (IUL)</strong>,
              tu dinero crece ligado al mercado — sin riesgo de pérdida — mientras construyes
              un legado para los que más amas.
            </p>

            {/* Trust stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "100%", label: "Confidencial" },
                { value: "Gratis", label: "Consulta" },
                { value: "Sin", label: "Compromisos" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center bg-navy-800/50 border border-gold-500/15 rounded-xl py-4 px-2"
                >
                  <p className="font-display font-bold text-gold-400 text-xl leading-none">{s.value}</p>
                  <p className="text-white/45 text-xs mt-1.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTA button (mobile — form is below on mobile) */}
            <div className="lg:hidden">
              <a href="#formulario" className="btn-gold inline-block px-8 py-4 text-sm tracking-widest uppercase w-full text-center">
                Solicitar Información Gratis →
              </a>
            </div>

            {/* Fine print */}
            <p className="text-white/25 text-xs">
              ✓ Solo para residentes de EE.UU. (todas las ciudades excepto NY y Alaska) · Edades 25–64
            </p>
          </div>

          {/* ── Right: Lead form ────────────────────────────────── */}
          <div
            id="formulario"
            className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-7 sm:p-9 shadow-2xl"
          >
            <div className="text-center mb-7">
              <p className="text-gold-500 text-xs font-black tracking-[0.15em] uppercase mb-2">
                Consulta Gratuita
              </p>
              <h2 className="font-display text-2xl font-bold text-white">
                Recibe Tu Plan Personalizado
              </h2>
              <p className="text-white/45 text-sm mt-2 leading-relaxed">
                Un asesor te contactará pronto con una propuesta a tu medida
              </p>
              <div className="gold-divider mt-5" />
            </div>
            <LeadForm />
          </div>

        </div>
      </div>
    </section>
  );
}
