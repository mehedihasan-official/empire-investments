const testimonials = [
  {
    name: "Carlos R.",
    state: "Texas",
    initials: "CR",
    quote:
      "Gracias a Empire Investments, mi familia está protegida y mi dinero está creciendo. El proceso fue sencillo, todo en español, y el asesor fue muy paciente conmigo.",
    rating: 5,
  },
  {
    name: "María L.",
    state: "Florida",
    initials: "ML",
    quote:
      "Llevaba años pensando en un IUL pero no sabía por dónde empezar. El asesor me explicó todo con paciencia y sin presiones. ¡100% recomendado para la comunidad hispana!",
    rating: 5,
  },
  {
    name: "Roberto M.",
    state: "California",
    initials: "RM",
    quote:
      "Gracias a la protección hipotecaria, sé que aunque me pase algo, mi familia no perderá su hogar. Ese es el mejor regalo que le pude dar a mis hijos. Eso no tiene precio.",
    rating: 5,
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-gold-400 text-sm">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-black tracking-[0.15em] uppercase mb-3">
            Testimonios
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Lo que Dicen{" "}
            <span className="gold-shimmer">Nuestros Clientes</span>
          </h2>
          <div className="gold-divider mt-5" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card-hover bg-navy-800/35 rounded-2xl p-7 relative flex flex-col"
            >
              {/* Quote mark */}
              <span className="absolute top-5 right-7 font-display text-5xl text-gold-500/20 leading-none select-none">
                "
              </span>

              {/* Stars */}
              <Stars count={t.rating} />

              {/* Quote */}
              <p className="text-white/65 text-sm leading-relaxed mt-4 flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gold-500/10">
                <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/35 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-400 font-bold text-xs">{t.initials}</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-gold-400/60 text-xs">{t.state}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 py-6 border-y border-gold-500/10">
          {[
            { value: "500+", label: "Familias Protegidas" },
            { value: "48h", label: "Tiempo de Respuesta" },
            { value: "5★", label: "Calificación Promedio" },
            { value: "100%", label: "Atención en Español" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-gold-400 text-2xl">{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
