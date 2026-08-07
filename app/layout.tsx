import type { Metadata } from "next";
import { Geist, Archivo_Black, Inter } from "next/font/google";
import "./globals.css";
import GlobalNavbar from "@/src/components/GlobalNavbar";
import GlobalFooter from "@/src/components/GlobalFooter";
import { I18nProvider } from "@/src/components/I18nProvider";

// Geist Sans is the workhorse — body, UI, nav. Weight, case, and color carry the
// hierarchy across the interface.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Archivo Black is a single-weight display face, used only for the giant
// rolling "JON @ JON" hero wordmark. Non-variable, so weight 400 is required.
const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Tight neo-grotesque used only inside the projects collage (see globals.css),
// a deliberate switch from the hero's wide-tracked treatment.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jon Zamudio — Diseño y Desarrollo Web con React & Next.js",
  description:
    "Diseño y desarrollo sitios web rápidos y de alto rendimiento con React & Next.js — claros, escalables y hechos para crecer. Jon Zamudio, portafolio 2018—2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${archivoBlack.variable} ${inter.variable} antialiased bg-background`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <I18nProvider>
          <GlobalNavbar />
          <main className="flex-1 w-full pt-8 lg:pt-12">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
              {children}
            </div>
          </main>
          <GlobalFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
