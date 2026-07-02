import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import GlobalNavbar from "@/src/components/GlobalNavbar";
import Footer from "@/src/components/Footer";
import { I18nProvider } from "@/src/components/I18nProvider";

// Single typeface for the entire site — Geist Sans. Keeps the design system to
// one voice; weight, case, and color carry the hierarchy instead of extra fonts.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jon Zamudio — Desarrollador & Diseñador Web",
  description:
    "Diseño y construyo experiencias digitales de alto rendimiento con React y Next.js — rápidas, claras y hechas para crecer. Portafolio de trabajos seleccionados, 2018—2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} antialiased bg-white`}
    >
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
        <I18nProvider>
          <GlobalNavbar />
          <main className="flex-1 w-full pt-8 lg:pt-12">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
              {children}
            </div>
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
