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

export interface ProjectVideo {
  src: string;
  /** Still image shown while the video loads. Use the actual first frame of the video so there's no scale flash. */
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
  /** Home-grid thumbnail. Required only when `video` is absent. */
  image?: string;
  /** Optional video cover for the home-grid card. When present, the still `image` is not rendered to avoid a scale flash between poster and first frame. The detail gallery is unaffected. */
  video?: ProjectVideo;
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
    slug: "lumina-dental",
    title: "Lumina Dental",
    subtitle: "Clínica Dental / 2026",
    category: "Sitio Web",
    year: 2026,
    color: "#0F0F0F",
    url: "https://lumina-dental-five.vercel.app/",
    video: {
      src: "/projects/lumina/lumina-cover.mp4",
      poster: "/projects/lumina/lu3.png",
    },
    description:
      "Lumina Dental es una clínica dental enfocada en la estética y la salud bucal contemporánea. Su filosofía —«pequeños gestos, grandes detalles»— guía cada decisión clínica: tratamientos discretos y precisos, materiales y proveedores europeos certificados, y un seguimiento personalizado durante todo el año. El sitio traduce esa promesa a un lenguaje editorial sobrio, transmitiendo confianza y profesionalismo a quienes buscan una experiencia dental cuidada en cada detalle.",
    blurb: [
      "JonZS Studio — Edition Nº 01",
      "Editorial web design",
      "© 2026 / Diseño Web — CDMX",
    ],
    gallery: [
      {
        type: "image",
        src: "/projects/lumina/lu3.png",
        alt: "Lumina Dental — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/lumina/lu2.png",
        alt: "Lumina Dental — frame 02",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/lumina/lu1.png",
        alt: "Lumina Dental — frame 03",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/lumina/lu4.png",
        alt: "Lumina Dental — frame 04",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/lumina/lu5.png",
        alt: "Lumina Dental — frame 05",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "02",
    slug: "luxora",
    title: "Luxora",
    subtitle: "Representación Inmobiliaria / 2026",
    category: "Sitio Web",
    year: 2026,
    color: "#0F0F0F",
    url: "https://luxora-estates.vercel.app/",
    video: {
      src: "/projects/luxora/luxora-cover.mp4",
      poster: "/projects/luxora/lux1.png",
    },
    description:
      "Luxora es un estudio de representación inmobiliaria nacido del encuentro entre arquitectos, conservadores e inversores privados. No publicamos. No alquilamos. No tasamos para terceros. Cada propiedad que aceptamos pasa por un comité interno de arquitectura que evalúa su autoría, su estado de conservación y su lugar en el tiempo. Trabajamos con un máximo de cincuenta residencias activas en cualquier momento.",
    blurb: [
      "JonZS Studio — Edition Nº 01",
      "Editorial web design",
      "© 2026 / Diseño Web — CDMX",
    ],
    gallery: [
      {
        type: "image",
        src: "/projects/luxora/lux1.png",
        alt: "Luxora — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/luxora/lux2.png",
        alt: "Luxora — frame 02",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/luxora/lux3.png",
        alt: "Luxora — frame 03",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/luxora/lux4.png",
        alt: "Luxora — frame 04",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/luxora/lux5.png",
        alt: "Luxora — frame 05",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "03",
    slug: "The-Woods",
    title: "The Woods",
    subtitle: "Web Design / 2026",
    category: "Sitio Web",
    year: 2026,
    color: "#B91C1C",
    url: "https://the-woods-landing.vercel.app/", // ← pega aquí la URL del sitio en vivo de The Woods
    video: {
      src: "/projects/thewoods/thewoods-cover.mp4",
      poster: "/projects/thewoods/woods1.png",
    },
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
    id: "04",
    slug: "academia",
    title: "ALES",
    subtitle: "Academia Latinoamericana de Envejecimiento Saludable / 2026",
    category: "Aplicación Web",
    year: 2026,
    color: "#B91C1C",
    url: "https://grace-academia-platform.vercel.app/", // ← pega aquí la URL del sitio en vivo de Academia
    video: {
      src: "/projects/academia/ales-cover.mp4",
      poster: "/projects/academia/heroaca.png",
    },
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
        src: "/projects/academia/aca1.png",
        alt: "Academia — frame 01",
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
    id: "05",
    slug: "HowtoSpanish",
    title: "HowtoSpanish",
    subtitle: "Web Design / 2025",
    category: "Diseño de Producto",
    year: 2025,
    color: "#1F2937",
    url: "https://howtospanish.framer.website/", // ← pega aquí la URL del sitio en vivo de Puren & Co.
    image: "/projects/howtospanish/htp1.png",
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
        src: "/projects/howtospanish/htp1.png",
        alt: "HowtoSpanish — hero",
        aspect: "16/9",
      },
      {
        type: "image",
        src: "/projects/howtospanish/htp3.png",
        alt: "HowtoSpanish — hero",
        aspect: "16/9",
      },
      {
        type: "image",
        src: "/projects/howtospanish/htp4.png",
        alt: "HowtoSpanish — hero",
        aspect: "16/9",
      },
      {
        type: "image",
        src: "/projects/howtospanish/htp2.png",
        alt: "HowtoSpanish — hero",
        aspect: "16/9",
      },

  
    ],
  },
  {
    id: "06",
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
    id: "07",
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
        alt: "Hellomatcha — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/gtVnLbEMWr1dn9GFa9Muj31HWI.png?scale-down-to=1024&width=1920&height=1280",
        alt: "Hellomatcha — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/u28ytq4BIR7mmfE7lSgi7kP1v0.png?scale-down-to=1024&width=1920&height=1280",
        alt: "Hellomatcha — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/UTZMujmsGkZLkZJk3CJ0HAF1qNk.png?scale-down-to=1024&width=1233&height=738",
        alt: "Hellomatcha — hero",
        aspect: "16/10",
      },
    ],
  },
  {
    id: "08",
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
        alt: "Petzu — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "https://framerusercontent.com/images/GO1pAlH3syX4gAiWKzfd71uK1T8.png?scale-down-to=1024&width=1920&height=1280",
        alt: "Petzu — hero",
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
