"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackLeadEvent } from "@/components/FacebookPixel";

// All US states except NY and Alaska (per client requirements)
const US_STATES = [
  "Alabama", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii",
  "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska",
  "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const INVESTMENT_OPTIONS = [
  { value: "$200", label: "$200" },
  { value: "$400", label: "$400" },
  { value: "$500 - $1,000", label: "$500 – $1,000" },
  { value: "$1,500 - $3,000", label: "$1,500 – $3,000" },
  { value: "$3,500 - $7,000", label: "$3,500 – $7,000" },
];

const INITIAL_FORM = {
  nombre: "",
  estado: "",
  edad: "",
  tieneIUL: "",
  dondeInvierte: "",
  paraQueIUL: "",
  cuantoInvertir: "",
};

export default function LeadForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  // ── Field change handler ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  // ── Client-side validation ───────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "Por favor ingresa tu nombre.";
    if (!form.estado) newErrors.estado = "Por favor selecciona tu estado.";

    const edadNum = parseInt(form.edad);
    if (!form.edad) {
      newErrors.edad = "Por favor ingresa tu edad.";
    } else if (isNaN(edadNum) || edadNum < 18 || edadNum > 99) {
      newErrors.edad = "Ingresa una edad válida (18–99).";
    }

    if (!form.tieneIUL) newErrors.tieneIUL = "Por favor selecciona una opción.";
    if (!form.dondeInvierte) newErrors.dondeInvierte = "Por favor selecciona una opción.";
    if (!form.cuantoInvertir) newErrors.cuantoInvertir = "Por favor selecciona un monto.";

    return newErrors;
  };

  // ── Submit handler ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector(".field-error");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          userAgent: navigator.userAgent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el formulario.");
      }

      // Fire client-side FB Lead event (deduplication with server-side CAPI)
      trackLeadEvent(data.id);

      // Redirect to thank you page
      router.push("/gracias");
    } catch (err) {
      setServerError(
        err.message || "Ocurrió un error inesperado. Por favor inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {/* ── 1. Nombre ─────────────────────────────────────────────────── */}
      <div>
        <label className="form-label">
          Nombre Completo <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          autoComplete="name"
          className="form-input"
        />
        {errors.nombre && <p className="field-error">{errors.nombre}</p>}
      </div>

      {/* ── 2. Estado ─────────────────────────────────────────────────── */}
      <div>
        <label className="form-label">
          Estado <span className="text-red-400">*</span>
        </label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Selecciona tu estado</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {errors.estado && <p className="field-error">{errors.estado}</p>}
      </div>

      {/* ── 3. Edad ───────────────────────────────────────────────────── */}
      <div>
        <label className="form-label">
          Edad <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          name="edad"
          value={form.edad}
          onChange={handleChange}
          placeholder="Tu edad"
          min="18"
          max="99"
          className="form-input"
        />
        {errors.edad && <p className="field-error">{errors.edad}</p>}
      </div>

      {/* ── 4. ¿Tienes IUL? ───────────────────────────────────────────── */}
      <div>
        <label className="form-label">
          ¿Tienes actualmente un IUL? <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-4 mt-1">
          {["Sí", "No"].map((opt) => {
            const selected = form.tieneIUL === opt;
            return (
              <label
                key={opt}
                className={`flex-1 flex items-center justify-center gap-2.5 cursor-pointer
                  px-4 py-3 rounded-lg border transition-all duration-200 select-none
                  ${selected
                    ? "border-gold-500 bg-gold-500/10 text-gold-400"
                    : "border-white/15 text-white/50 hover:border-gold-500/40 hover:text-white/70"
                  }`}
              >
                <input
                  type="radio"
                  name="tieneIUL"
                  value={opt}
                  checked={selected}
                  onChange={handleChange}
                  className="sr-only"
                />
                {/* Custom radio dot */}
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${selected ? "border-gold-500" : "border-white/30"}`}
                >
                  {selected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                  )}
                </span>
                <span className="font-bold text-sm">{opt}</span>
              </label>
            );
          })}
        </div>
        {errors.tieneIUL && <p className="field-error">{errors.tieneIUL}</p>}
      </div>

      {/* ── 5. ¿Dónde inviertes? ──────────────────────────────────────── */}
      <div>
        <label className="form-label">
          ¿Dónde estás invirtiendo actualmente? <span className="text-red-400">*</span>
        </label>
        <select
          name="dondeInvierte"
          value={form.dondeInvierte}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">Selecciona una opción</option>
          <option value="401k">401k</option>
          <option value="IRA">IRA</option>
          <option value="Banco">Banco</option>
          <option value="Otro">Otro</option>
        </select>
        {errors.dondeInvierte && <p className="field-error">{errors.dondeInvierte}</p>}
      </div>

      {/* ── 6. ¿Para qué el IUL? (optional) ──────────────────────────── */}
      <div>
        <label className="form-label">
          ¿Para qué estás considerando un IUL?{" "}
          <span className="text-white/30 text-xs font-normal">(Opcional)</span>
        </label>
        <textarea
          name="paraQueIUL"
          value={form.paraQueIUL}
          onChange={handleChange}
          placeholder="Ej: proteger a mi familia, jubilación, ahorro..."
          rows={3}
          className="form-input resize-none"
        />
      </div>

      {/* ── 7. ¿Cuánto invertir? ──────────────────────────────────────── */}
      <div>
        <label className="form-label">
          ¿Cuánto estás buscando invertir? <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {INVESTMENT_OPTIONS.map((opt) => {
            const selected = form.cuantoInvertir === opt.value;
            return (
              <label
                key={opt.value}
                className={`cursor-pointer text-center px-3 py-2.5 rounded-lg border
                  text-sm font-bold transition-all duration-200 select-none
                  ${selected
                    ? "border-gold-500 bg-gold-500/10 text-gold-400"
                    : "border-white/15 text-white/50 hover:border-gold-500/40 hover:text-white/70"
                  }`}
              >
                <input
                  type="radio"
                  name="cuantoInvertir"
                  value={opt.value}
                  checked={selected}
                  onChange={handleChange}
                  className="sr-only"
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {errors.cuantoInvertir && <p className="field-error">{errors.cuantoInvertir}</p>}
      </div>

      {/* ── Server error ──────────────────────────────────────────────── */}
      {serverError && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <span className="text-red-400 text-lg leading-none mt-0.5">⚠</span>
          <p className="text-red-300 text-sm leading-relaxed">{serverError}</p>
        </div>
      )}

      {/* ── Submit button ─────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full py-4 text-sm tracking-widest uppercase
          disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg
              className="animate-spin h-4 w-4 text-navy-950"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Enviando...
          </span>
        ) : (
          "Solicitar Información Gratuita →"
        )}
      </button>

      <p className="text-center text-white/25 text-xs leading-relaxed">
        🔒 Tu información es 100% confidencial. Sin compromisos. Sin costos.
      </p>
    </form>
  );
}
