import { AuthProvider } from "@/components/AuthProvider";
import { FacebookPixelProvider } from "@/components/FacebookPixel";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import "./globals.css";

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
    <html lang="es" suppressHydrationWarning>
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
      <body 
        className="text-white antialiased" 
        style={{ backgroundColor: 'var(--color-navy-900)', fontFamily: 'var(--font-body)' }}
        suppressHydrationWarning
      >
        <AuthProvider>
          {/* Tracks PageView on every route change */}
          <FacebookPixelProvider />
          <Header/>
          {children}
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
