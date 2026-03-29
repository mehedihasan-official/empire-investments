export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-gold-500/15 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-5 text-center">

          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/40 flex items-center justify-center">
              <span className="text-gold-400 font-display font-bold text-xs">EI</span>
            </div>
            <div className="leading-none">
              <p className="text-white font-display font-semibold text-sm">Empire Investments</p>
            </div>
          </div>

          <div className="gold-divider" />

          {/* Tagline */}
          <p className="text-white/40 text-sm max-w-md leading-relaxed">
            Servicios de seguros de vida para la comunidad hispana en los Estados Unidos.
            Protegemos el futuro de tu familia.
          </p>

          {/* Disclaimer */}
          <p className="text-white/20 text-xs max-w-2xl leading-relaxed">
            Este sitio web es solo para fines informativos. Al completar el formulario, 
            aceptas ser contactado por un asesor de Empire Investments. Tu información 
            es 100% confidencial y nunca será vendida a terceros.
          </p>

          <p className="text-white/20 text-xs">
            © {year} Empire Investments. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
