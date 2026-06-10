"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

/**
 * Renders the shared full-width navbar on every route EXCEPT the home page.
 * On `/`, the hero renders the same <Navbar /> inside its left 50% column,
 * so the vertical split line runs unbroken to the top of the viewport.
 */
export default function GlobalNavbar() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <Navbar />;
}
