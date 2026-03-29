import "./globals.css";
import { FacebookPixelProvider } from "@/components/FacebookPixel";

export const metadata = {
  title: "Empire Investments | Seguro de Vida IUL – Protege Tu Familia",
  description:
    "Planes de Vida Indexada Universal (IUL) y Protección Hipotecaria para la comunidad hispana en los EE.UU. Consulta gratuita, sin compromiso.",
  keywords:
    "IUL, seguro de vida indexada, protección hipotecaria, seguro hispano, Empire Investments",
  openGraph: {
    title: "Empire Investments | Seguro de Vida IUL",
    description:
      "Protege el futuro de tu familia con un plan IUL diseñado para la comunidad hispana.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Facebook Pixel noscript fallback */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
      </head>
      <body className="text-white antialiased" style={{ backgroundColor: 'var(--color-navy-900)', fontFamily: 'var(--font-body)' }}>
        {/* Tracks PageView on every route change */}
        <FacebookPixelProvider />
        {children}
      </body>
    </html>
  );
}
