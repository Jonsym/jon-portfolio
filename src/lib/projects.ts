export interface GalleryItem {
  type: "image" | "video";
  /**
   * Image / video URL. Accepts any string:
   *  - Plain external URL: "https://my-site.com/img.jpg"
   *  - Unsplash helper:    UNSPLASH("photo-xxxx")
   *  - Local public path:  "/projects/foo.svg"
   * The renderer optimizes via next/image when the host is in `images.remotePatterns`
   * (currently `images.unsplash.com`), and falls back to `unoptimized` for everything else.
   */
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
  /** External live-site URL, e.g. "https://noirtide.com". Renders the "Visit Site" CTA when present. */
  url?: string;
  gallery?: GalleryItem[];
}

export const UNSPLASH = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const OPTIMIZABLE_HOSTS = new Set([
  "images.unsplash.com",
  "framerusercontent.com",
]);

/**
 * Returns true when the `src` can flow through next/image's optimizer
 * (i.e. host is in `next.config.ts` → `images.remotePatterns`, or it's a local path).
 * Used by the gallery and hero renderers to decide whether to set `unoptimized`.
 */
export function canOptimizeSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return OPTIMIZABLE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export const projects: Project[] = [
  {
    id: "01",
    slug: "The-Woods",
    title: "The Woods",
    subtitle: "Web Design / 2026",
    category: "Sitio Web",
    year: 2026,
    color: "#B91C1C",
    url: "https://the-woods-landing.vercel.app/", // ← pega aquí la URL del sitio en vivo de The Woods
    image: "/projects/thewoods/woods1.png",
    description:
      "En The Woods, la simplicidad, el confort y la conexión con lo natural definen cada detalle. Inspirados en la maestría artesanal, creamos piezas atemporales que elevan el día a día. El diseño es un estilo de vida donde el propósito y la sensibilidad se unen para dar forma a espacios calmos y significativos. Nuestra misión es transformar lo cotidiano en extraordinario.",
    blurb: [
      "JonZS Studio — Edition Nº 01",
      "Editorial web design",
      "© 2026 / Diseño Web — CDMX",
    ],
    gallery: [
      {
        type: "image",
        src: "/projects/thewoods/woods1.png",
        alt: "The Woods — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/thewoods/woods2.png",
        alt: "The Woods — frame 02",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/thewoods/woods3.png",
        alt: "The Woods — frame 03",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/thewoods/woods4.png",
        alt: "The Woods — frame 04",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/thewoods/woods5.png",
        alt: "The Woods — frame 05",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "02",
    slug: "academia",
    title: "ALES",
    subtitle: "Academia Latinoamericana de Envejecimiento Saludable / 2026",
    category: "Aplicación Web",
    year: 2026,
    color: "#B91C1C",
    url: "https://grace-academia-platform.vercel.app/", // ← pega aquí la URL del sitio en vivo de Academia
    image: "/projects/academia/heroaca.png",
    description:
      "La Academia Latinoamericana de Envejecimiento Saludable (ALES) nace de la convicción de que la medicina del envejecimiento saludable y la medicina estética requieren una formación académica rigurosa, basada en evidencia científica y ética profesional inquebrantable. Fundada por la Dra. Grace, nuestra institución se ha convertido en un referente latinoamericano en educación médica especializada.",
    blurb: [
      "JonZS Studio — Edition Nº 02",
      "Editorial web design",
      "© 2026 / Diseño Web — CDMX",
    ],
    gallery: [
      {
        type: "image",
        src: "/projects/academia/heroaca.png",
        alt: "Academia — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/academia/aca2.png",
        alt: "Academia — frame 02",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/academia/aca4.png",
        alt: "Academia — frame 04",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "04",
    slug: "HowtoSpanish",
    title: "HowtoSpanish",
    subtitle: "Web Design / 2025",
    category: "Diseño de Producto",
    year: 2025,
    color: "#1F2937",
    url: "https://howtospanish.framer.website/", // ← pega aquí la URL del sitio en vivo de Puren & Co.
    image:
      "https://framerusercontent.com/images/lKsN0nTdoz0ghuaWID6uHwNEPg.png?scale-down-to=1024&width=1920&height=1280",
    description:
      "HowtoSpanish es un sitio promocional y de servicio pensado para una marca dedicada a la enseñanza del español/inglés — con cursos, ebooks y contenido digital. El objetivo de este proyecto fue construir una presencia web clara, atractiva y profesional para la marca, que permitiera a sus visitantes descubrir de forma inmediata la propuesta de valor: cursos, ebook, y servicios de aprendizaje de idioma.",
    blurb: [
      "JonZS Studio — Edition Nº 02",
      "Workflow automation platform",
      "© 2025 / Producto SaaS — Beta",
    ],
    gallery: [
      {
        type: "image",
        src: "https://framerusercontent.com/images/lKsN0nTdoz0ghuaWID6uHwNEPg.png?scale-down-to=1024&width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/J2wtgERbxJpo5ZdeFLbQZnYMtkY.png?scale-down-to=1024&width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/stkPufGwqeWM0OPLpU4FCbdg6us.png?scale-down-to=1024&width=1093&height=731",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/r5RfYjg2YXCxr9NnHbmU8KPP6YQ.png?scale-down-to=1024&width=1248&height=832",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "05",
    slug: "MaterCare",
    title: "MaterCare",
    subtitle: "Web Design / 2025",
    category: "Diseño de Producto",
    year: 2025,
    color: "#1F2937",
    image:
      "https://framerusercontent.com/images/wwr6czJzrQQwqUUd7i4bL3LjI4c.png?width=1920&height=1280",
    description:
      "Desarrollé un panel de gestión de pacientes para el Hospital Comunitario de Coatzacoalcos, ubicado en el estado de Veracruz. El objetivo fue crear una herramienta interna que facilitara la organización y seguimiento de la información médica del área de maternidad. El sistema integra visualizaciones interactivas mediante Chart.js y un chatbot construido con Dialogflow para agilizar consultas rápidas dentro del panel.",
    blurb: [
      "JonZS Studio — Edition Nº 02",
      "Workflow automation platform",
      "© 2025 / Producto SaaS — Beta",
    ],
    gallery: [
      {
        type: "image",
        src: "https://framerusercontent.com/images/wwr6czJzrQQwqUUd7i4bL3LjI4c.png?scale-down-to=1024&width=1920&height=1280",
        alt: "MaterCare — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/bKRCn2hvICotmzxkAFKiDccQZgA.png?scale-down-to=1024&width=1920&height=1280",
        alt: "MaterCare — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/bKRCn2hvICotmzxkAFKiDccQZgA.png?scale-down-to=1024&width=1920&height=1280",
        alt: "MaterCare — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/KMAUlxr016zVC4Ud4zsMMLmgTo.png?scale-down-to=1024&width=1920&height=1280",
        alt: "MaterCare — hero",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "06",
    slug: "HelloMatcha",
    title: "HelloMatcha",
    subtitle: "Web Design / 2025",
    category: "Diseño de Producto",
    year: 2025,
    color: "#1F2937",
    url: "https://hellomatcha.framer.website/", // ← pega aquí la URL del sitio en vivo de Puren & Co.
    image:
      "https://framerusercontent.com/images/sZLHrEIP2EtW2LcwPO77F3Ixro.png?width=1920&height=1280",
    description:
      "HelloMatcha es una cafetería ubicada en el estado de Puebla, conocida por su estilo natural, relajado y visualmente fresco. Para este proyecto desarrollé una landing page que capturara fielmente la esencia de la marca, destacando su identidad visual y promoviendo una experiencia agradable desde el primer momento. El sitio integra un menú digital que permite a los visitantes conocer de manera clara y ordenada las bebidas y alimentos disponibles.",
    blurb: [
      "JonZS Studio — Edition Nº 02",
      "Workflow automation platform",
      "© 2025 / Producto SaaS — Beta",
    ],
    gallery: [
      {
        type: "image",
        src: "https://framerusercontent.com/images/sZLHrEIP2EtW2LcwPO77F3Ixro.png?width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/gtVnLbEMWr1dn9GFa9Muj31HWI.png?scale-down-to=1024&width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/u28ytq4BIR7mmfE7lSgi7kP1v0.png?scale-down-to=1024&width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/UTZMujmsGkZLkZJk3CJ0HAF1qNk.png?scale-down-to=1024&width=1233&height=738",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "07",
    slug: "Petzu",
    title: "Petzu",
    subtitle: "Directorio Web / 2025",
    category: "Producto Web",
    year: 2025,
    color: "#1F2937",
    image:
      "https://framerusercontent.com/images/14vOvgIwTkkUeS9OUd41OTVoYdk.png?width=1920&height=1280",
    description:
      "Petzu es una app web diseñada para conectar a dueños de mascotas con los mejores negocios y servicios especializados en su ciudad. Desde veterinarias y estéticas hasta tiendas, guarderías y paseadores, Petzu centraliza todo en un solo lugar para facilitar la búsqueda y elección. A diferencia de otros directorios genéricos, Petzu está enfocado exclusivamente en el mundo pet-friendly, permitiendo a los usuarios descubrir opciones confiables, comparar servicios y tomar decisiones informadas para el bienestar de sus mascotas. Para los negocios, Petzu representa una oportunidad de aumentar su visibilidad y llegar a clientes realmente interesados, a través de un perfil optimizado donde pueden mostrar sus servicios, ubicación y propuesta de valor.",
    blurb: [
      "JonZS Studio — Edition Nº 02",
      "Workflow automation platform",
      "© 2025 / Producto SaaS — Beta",
    ],
    gallery: [
      {
        type: "image",
        src: "https://framerusercontent.com/images/14vOvgIwTkkUeS9OUd41OTVoYdk.png?width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/GO1pAlH3syX4gAiWKzfd71uK1T8.png?scale-down-to=1024&width=1920&height=1280",
        alt: "HowtoSpanish — hero",
        aspect: "16/10",
      },
    ],
  },
];

export const projectBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p])
);

export function getProjectBySlug(slug: string): Project | undefined {
  return projectBySlug[slug];
}
