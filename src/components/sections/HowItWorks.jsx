const steps = [
  {
    step: "01",
    title: "Llena el Formulario",
    description:
      "Completa tu información en menos de 2 minutos. Es rápido, fácil y completamente gratis. Sin tarjeta de crédito requerida.",
    icon: "📋",
  },
  {
    step: "02",
    title: "Habla con un Asesor",
    description:
      "Un experto certificado de Empire Investments te llamará para entender tus metas financieras y las necesidades de tu familia.",
    icon: "📞",
  },
  {
    step: "03",
    title: "Elige Tu Plan",
    description:
      "Recibe una propuesta 100% personalizada y empieza a proteger a tu familia hoy mismo. Sin presiones, sin compromisos.",
    icon: "✅",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-navy-900 geo-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-black tracking-[0.15em] uppercase mb-3">
            Proceso Simple
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            ¿Cómo <span className="gold-shimmer">Funciona?</span>
          </h2>
          <div className="gold-divider mt-5" />
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

          {steps.map((item, i) => (
            <div key={item.step} className="text-center relative">
              {/* Step circle */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-gold-500/40 bg-gold-500/8 flex items-center justify-center">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                {/* Step number badge */}
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold-500 text-navy-950 text-xs font-black flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <p className="text-gold-500/50 text-xs font-black tracking-widest mb-2">
                PASO {item.step}
              </p>
              <h3 className="font-display text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="#formulario"
            className="btn-gold inline-block px-10 py-4 text-sm tracking-widest uppercase shadow-xl shadow-gold-500/20"
          >
            Empezar Ahora — Es Gratis →
          </a>
        </div>
      </div>
    </section>
  );
}
