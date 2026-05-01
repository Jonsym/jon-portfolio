import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JonZS® — Trabajos Seleccionados",
  description: "Portafolio editorial de trabajos seleccionados, 2018—2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
    >
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
        <Navbar />
        <main className="flex-1 w-full pt-8 lg:pt-12">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
