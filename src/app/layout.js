import { AuthProvider } from "@/components/AuthProvider";
import { FacebookPixelProvider } from "@/components/FacebookPixel";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { Script } from "next/script";
import "./globals.css";

export const metadata = {
  title: "Empire Investments | Seguro de Vida IUL – Protege Tu Familia",
  description:
    "Planes de Vida Indexada Universal (IUL) y Protección Hipotecaria para la comunidad hispana en los EE.UU. Consulta gratuita, sin compromiso.",
  keywords:
    "IUL, seguro de vida indexada, protección hipotecaria, seguro hispano, Empire Investments",
  icon: "/favicon.ico",
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
        {/* Meta Pixel Code */}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
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
