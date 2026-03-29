const benefits = [
  {
    icon: "🇺🇸",
    title: "Comunidad Hispana",
    description:
      "Servimos exclusivamente a la comunidad hispana en todos los estados de EE.UU. Entendemos tu cultura y tus necesidades.",
  },
  {
    icon: "💬",
    title: "100% en Español",
    description:
      "Atención completa en español para que entiendas cada detalle de tu plan. Sin barreras de idioma.",
  },
  {
    icon: "🔒",
    title: "Confidencialidad Total",
    description:
      "Tu información personal está 100% protegida. Nunca la vendemos ni compartimos con terceros.",
  },
  {
    icon: "🎓",
    title: "Asesores Certificados",
    description:
      "Nuestro equipo cuenta con licencias estatales y años de experiencia en seguros de vida e inversiones.",
  },
  {
    icon: "⚡",
    title: "Respuesta Rápida",
    description:
      "Un asesor te contactará dentro de las próximas horas. Tu tiempo y tu familia no pueden esperar.",
  },
  {
    icon: "💰",
    title: "Sin Costos Ocultos",
    description:
      "La consulta inicial es 100% gratuita. Recibes información honesta y transparente sin presiones.",
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-navy-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-black tracking-[0.15em] uppercase mb-3">
            ¿Por Qué Nosotros?
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Empire Investments{" "}
            <span className="gold-shimmer">Te Respalda</span>
          </h2>
          <div className="gold-divider mt-5" />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="card-hover bg-navy-800/25 rounded-xl p-7 group"
            >
              <div className="text-3xl mb-4">{b.icon}</div>
              <h4 className="font-display font-bold text-white text-lg mb-2 group-hover:text-gold-400 transition-colors duration-300">
                {b.title}
              </h4>
              <p className="text-white/50 text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
