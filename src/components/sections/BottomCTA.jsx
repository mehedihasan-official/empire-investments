import LeadForm from "@/components/LeadForm";

export default function BottomCTA() {
  return (
    <section className="py-24 bg-navy-950 geo-bg" id="formulario-bottom">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gold-500 text-xs font-black tracking-[0.15em] uppercase mb-3">
            Da el Primer Paso
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            ¿Listo para Proteger{" "}
            <span className="gold-shimmer">Tu Futuro?</span>
          </h2>
          <p className="text-white/50 mt-4 leading-relaxed">
            Completa el formulario y recibe asesoría personalizada gratis.
            Sin compromiso, sin costos, 100% en español.
          </p>
          <div className="gold-divider mt-6" />
        </div>

        {/* Form card */}
        <div className="bg-navy-800/50 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-7 sm:p-10 shadow-2xl shadow-navy-950/50">
          <LeadForm />
        </div>

        {/* Trust icons */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-white/30 text-xs">
          {[
            "🔒 Información Segura",
            "✅ Sin Compromisos",
            "🇺🇸 Solo EE.UU.",
            "💬 En Español",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
