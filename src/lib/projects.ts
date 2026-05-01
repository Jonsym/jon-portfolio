export interface GalleryItem {
  type: "image" | "video";
  src: string;
  alt: string;
  aspect?: string;
  poster?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  year: number;
  color: string;
  image: string;
  description: string;
  blurb: [string, string, string];
  gallery?: GalleryItem[];
}

const UNSPLASH = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projects: Project[] = [
  {
    id: "01",
    slug: "noir-tide",
    title: "Noir & Tide",
    subtitle: "Slow-Fashion Storefront / 2025",
    category: "Diseño Web",
    year: 2025,
    color: "#B91C1C",
    image: UNSPLASH("photo-1542291026-7eec264c27ff"),
    description:
      "Tienda digital editorial para una marca de slow-fashion arraigada en guardarropas monocromáticos. El brief consistía en construir una experiencia silenciosa y guiada por la tipografía que dejara a las prendas captar la atención. Cada página se ritma como una doble página impresa — formato largo, márgenes generosos y solo las interacciones esenciales. El sistema de catálogo se diseñó alrededor de retículas asimétricas, transiciones contenidas y un checkout sin distracciones, con cuidado especial al peso de las imágenes y al ritmo de carga progresiva.",
    blurb: [
      "JonZS Studio — Edition Nº 01",
      "Slow-fashion editorial commerce",
      "© 2025 / Diseño Web — CDMX",
    ],
    gallery: [
      { type: "image", src: UNSPLASH("photo-1542291026-7eec264c27ff"), alt: "Noir & Tide — hero", aspect: "16/10" },
      { type: "image", src: UNSPLASH("photo-1539109136881-3be0616acf4b"), alt: "Noir & Tide — colección", aspect: "4/5" },
      { type: "image", src: UNSPLASH("photo-1469334031218-e382a71b716b"), alt: "Noir & Tide — campaña", aspect: "16/10" },
    ],
  },
  {
    id: "02",
    slug: "puren-co",
    title: "Puren & Co.",
    subtitle: "SaaS Workflow Platform / 2025",
    category: "Diseño de Producto",
    year: 2025,
    color: "#1F2937",
    image: UNSPLASH("photo-1531297484001-80022131f5a1"),
    description:
      "SaaS de automatización de flujos diseñado para conectar herramientas entre equipos. El reto era visualizar la complejidad de un modo que se sintiera simple, así que construimos un sistema de dashboards en torno a una densidad predecible, movimiento suave y una sola acción principal por pantalla. El proyecto incluyó la definición del modelo de tokens, la curva tipográfica para datos densos, y patrones de canvas para flujos visuales editables sin perder claridad cuando el grafo crece.",
    blurb: [
      "JonZS Studio — Edition Nº 02",
      "Workflow automation platform",
      "© 2025 / Producto SaaS — Beta",
    ],
    gallery: [
      { type: "image", src: UNSPLASH("photo-1531297484001-80022131f5a1"), alt: "Puren & Co. — dashboard", aspect: "16/10" },
      { type: "image", src: UNSPLASH("photo-1551288049-bebda4e38f71"), alt: "Puren & Co. — flujo", aspect: "16/9" },
      { type: "image", src: UNSPLASH("photo-1542744173-8e7e53415bb0"), alt: "Puren & Co. — analítica", aspect: "16/10" },
    ],
  },
  {
    id: "03",
    slug: "lunare",
    title: "Lunare",
    subtitle: "Real Estate Portfolio / 2025",
    category: "Diseño Web",
    year: 2025,
    color: "#166534",
    image: UNSPLASH("photo-1486325212027-8081e485255e"),
    description:
      "Lunare es una agencia digital especializada en bienes raíces y desarrollo inmobiliario. El sitio se lee primero como portafolio y después como canal de ventas — tipografía display grande, movimiento contenido y un índice largo y scrolleable que premia el navegar sin empujar al usuario hacia un CTA. Se diseñó un sistema de fichas de propiedad reutilizable, con video hero opcional, plano interactivo en SVG y un visor de galería tipo lightbox sin sombras ni cromos para mantener la calma editorial.",
    blurb: [
      "JonZS Studio — Edition Nº 03",
      "Real estate editorial portfolio",
      "© 2025 / Diseño Web — Madrid",
    ],
    gallery: [
      { type: "image", src: UNSPLASH("photo-1486325212027-8081e485255e"), alt: "Lunare — landing", aspect: "16/10" },
      { type: "image", src: UNSPLASH("photo-1545324418-cc1a3fa10c00"), alt: "Lunare — propiedades", aspect: "4/5" },
      { type: "image", src: UNSPLASH("photo-1496307653780-42ee777d4833"), alt: "Lunare — interiores", aspect: "16/10" },
    ],
  },
  {
    id: "04",
    slug: "system-beta",
    title: "System Beta",
    subtitle: "Modular Design System / 2024",
    category: "Sistema Web",
    year: 2024,
    color: "#92400E",
    image: UNSPLASH("photo-1611224923853-80b023f02d71"),
    description:
      "Sistema de diseño modular entregado como sitio web vivo y librería de Figma. El sistema mantiene un único tono entre superficies — marketing, app y documentación — con una escala tipográfica afinada para datos densos y un modelo de tokens que sobrevive a rebrands white-label. El entregable incluyó documentación de uso, snippets de código por componente, y una ruta de adopción incremental para equipos que migran desde stacks heredados sin congelar el roadmap del producto.",
    blurb: [
      "JonZS Studio — Edition Nº 04",
      "Modular design system",
      "© 2024 / Sistema Web — Multi-brand",
    ],
    gallery: [
      { type: "image", src: UNSPLASH("photo-1611224923853-80b023f02d71"), alt: "System Beta — token map", aspect: "16/10" },
      { type: "image", src: UNSPLASH("photo-1517048676732-d65bc937f952"), alt: "System Beta — librería", aspect: "16/10" },
      { type: "image", src: UNSPLASH("photo-1487014679447-9f8336841d58"), alt: "System Beta — documentación", aspect: "4/5" },
    ],
  },
];

export const projectBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p])
);

export function getProjectBySlug(slug: string): Project | undefined {
  return projectBySlug[slug];
}
