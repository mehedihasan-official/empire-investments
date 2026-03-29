const services = [
  {
    icon: "📈",
    title: "Vida Indexada Universal (IUL)",
    tagline: "Crecimiento sin riesgo",
    description:
      "Un seguro de vida que también funciona como herramienta de inversión. Tu dinero crece según el índice S&P 500, pero con una red de seguridad: nunca puedes perder lo que has acumulado.",
    features: [
      "Crecimiento ligado al mercado, sin riesgo de pérdida",
      "Beneficio de muerte 100% libre de impuestos",
      "Acceso a fondos en vida para emergencias",
      "Ideal para complementar tu jubilación",
      "Flexible — ajusta aportes según tu presupuesto",
    ],
  },
  {
    icon: "🏡",
    title: "Protección Hipotecaria",
    tagline: "Tu familia siempre tiene un hogar",
    description:
      "Si algo te llegara a pasar, tu familia no perderá la casa. Este plan cubre el saldo pendiente de tu hipoteca para que tus seres queridos nunca tengan que preocuparse por el techo.",
    features: [
      "Cubre el saldo total de tu hipoteca",
      "Pagos mensuales accesibles desde $30/mes",
      "Sin exámenes médicos en muchos casos",
      "Protección inmediata al activar el plan",
      "Tu familia recibe el beneficio libre de impuestos",
    ],
  },
];

export default function Services() {
  return (
    <section className="py-24 bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-black tracking-[0.15em] uppercase mb-3">
            Nuestros Servicios
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Planes Diseñados{" "}
            <span className="gold-shimmer">Para Ti</span>
          </h2>
          <div className="gold-divider mt-5" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((s) => (
            <div
              key={s.title}
              className="card-hover bg-navy-800/30 rounded-2xl p-8 group"
            >
              <div className="text-4xl mb-5">{s.icon}</div>

              <p className="text-gold-500/70 text-xs font-bold tracking-widest uppercase mb-2">
                {s.tagline}
              </p>

              <h3 className="font-display text-2xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors duration-300">
                {s.title}
              </h3>

              <p className="text-white/55 text-sm leading-relaxed mb-6">
                {s.description}
              </p>

              <ul className="space-y-3">
                {s.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/65">
                    <span className="text-gold-400 flex-shrink-0 mt-0.5 font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#formulario"
                className="inline-block mt-7 btn-gold px-6 py-3 text-xs tracking-widest uppercase"
              >
                Quiero Saber Más →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
