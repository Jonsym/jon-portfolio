"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

/**
 * Renders the shared footer everywhere EXCEPT `/proyectos`, which is a single
 * locked viewport — the projects carousel owns the whole screen there, and
 * there is no scroll to reach a footer with.
 */
export default function GlobalFooter() {
  const pathname = usePathname();
  if (pathname === "/proyectos") return null;
  return <Footer />;
}
