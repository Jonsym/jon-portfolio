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

export interface ProjectLocale {
  subtitle?: string;
  category?: string;
  description?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** Default (Spanish) subtitle. */
  subtitle: string;
  /** Default (Spanish) category. */
  category: string;
  year: number;
  color: string;
  /** Home-grid thumbnail. Required only when `video` is absent. */
  image?: string;
  /** Optional video cover for the home-grid card. When present, the still `image` is not rendered to avoid a scale flash between poster and first frame. The detail gallery is unaffected. */
  video?: ProjectVideo;
  /** Default (Spanish) description. */
  description: string;
  blurb: [string, string, string];
  /** External live-site URL, e.g. "https://noirtide.com". Renders the "Visit Site" CTA when present. */
  url?: string;
  gallery?: GalleryItem[];
  /** Localized overrides. Anything missing falls back to the default Spanish field. */
  i18n?: {
    en?: ProjectLocale;
  };
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
    slug: "novax-constructora",
    title: "Novax Constructora",
    subtitle: "Constructora / 2026",
    category: "Sitio Web",
    year: 2026,
    color: "#0F0F0F",
    url: "https://novax-constructora.vercel.app/",
    image: "/projects/novax/novax1.png",
    description:
      "Novax es una constructora con base en Puebla, México, especializada en obra residencial, comercial e industrial, además de remodelaciones integrales. Junto al servicio de construcción, Novax ofrece la venta y renta de equipo, materiales y herramientas para obra, consolidándose como un aliado integral para arquitectos, contratistas y propietarios que buscan calidad, cumplimiento y un solo proveedor para todo el proceso.",
    blurb: [
      "JonZS Studio — Edition Nº 01",
      "Editorial web design",
      "© 2026 / Diseño Web — CDMX",
    ],
    gallery: [
      {
        type: "image",
        src: "/projects/novax/novax1.png",
        alt: "Novax — hero",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/novax/novax2.png",
        alt: "Novax — frame 02",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/novax/novax3.png",
        alt: "Novax — frame 03",
        aspect: "16/10",
      },
      {
        type: "image",
        src: "/projects/novax/novax4.png",
        alt: "Novax — frame 04",
        aspect: "16/10",
      },
    ],
    i18n: {
      en: {
        subtitle: "Construction / 2026",
        category: "Website",
        description:
          "Novax is a construction company based in Puebla, Mexico, specialized in residential, commercial, and industrial work, as well as full remodels. Alongside construction services, Novax offers the sale and rental of equipment, materials, and tools for the trade — establishing itself as a comprehensive partner for architects, contractors, and owners who want quality, accountability, and a single supplier for the entire process.",
      },
    },
  },
  {
    id: "02",
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
    i18n: {
      en: {
        subtitle: "Dental Clinic / 2026",
        category: "Website",
        description:
          "Lumina Dental is a dental clinic focused on contemporary aesthetics and oral health. Its philosophy — «small gestures, great details» — guides every clinical decision: discreet and precise treatments, certified European materials and suppliers, and personalized follow-up throughout the year. The site translates that promise into a sober, editorial language, conveying trust and professionalism to those seeking a dental experience cared for in every detail.",
      },
    },
  },
  {
    id: "03",
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
    i18n: {
      en: {
        subtitle: "Real Estate Representation / 2026",
        category: "Website",
        description:
          "Luxora is a real estate representation studio born from the meeting of architects, conservators, and private investors. We do not publish. We do not rent. We do not appraise for third parties. Each property we accept passes through an internal architecture committee that evaluates its authorship, its state of conservation, and its place in time. We work with a maximum of fifty active residences at any given moment.",
      },
    },
  },
  {
    id: "04",
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
    i18n: {
      en: {
        subtitle: "Web Design / 2026",
        category: "Website",
        description:
          "At The Woods, simplicity, comfort, and connection with the natural define every detail. Inspired by artisanal mastery, we create timeless pieces that elevate the everyday. Design is a way of living where purpose and sensitivity come together to shape calm, meaningful spaces. Our mission is to turn the ordinary into the extraordinary.",
      },
    },
  },
  {
    id: "05",
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
    i18n: {
      en: {
        subtitle: "Latin American Academy of Healthy Aging / 2026",
        category: "Web Application",
        description:
          "The Latin American Academy of Healthy Aging (ALES) was born from the conviction that the medicine of healthy aging and aesthetic medicine require rigorous academic training, grounded in scientific evidence and unwavering professional ethics. Founded by Dr. Grace, our institution has become a Latin American reference in specialized medical education.",
      },
    },
  },
  {
    id: "06",
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
    i18n: {
      en: {
        subtitle: "Web Design / 2025",
        category: "Product Design",
        description:
          "HowtoSpanish is a promotional and service site built for a brand dedicated to teaching Spanish and English — with courses, ebooks, and digital content. The goal of this project was to build a clear, attractive, and professional web presence for the brand, letting visitors immediately discover the value proposition: courses, ebooks, and language-learning services.",
      },
    },
  },
  {
    id: "07",
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
    i18n: {
      en: {
        subtitle: "Web Design / 2025",
        category: "Product Design",
        description:
          "I built a patient management dashboard for the Community Hospital of Coatzacoalcos, located in the state of Veracruz. The goal was to create an internal tool that streamlined the organization and tracking of medical information in the maternity ward. The system integrates interactive visualizations via Chart.js and a chatbot built with Dialogflow to speed up quick queries within the dashboard.",
      },
    },
  },
  {
    id: "08",
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
    i18n: {
      en: {
        subtitle: "Web Design / 2025",
        category: "Product Design",
        description:
          "HelloMatcha is a café in the state of Puebla, known for its natural, relaxed, and visually fresh style. For this project I built a landing page that faithfully captured the brand's essence, highlighting its visual identity and creating a pleasant experience from the very first moment. The site integrates a digital menu that lets visitors browse the available drinks and food in a clear, orderly way.",
      },
    },
  },
  {
    id: "09",
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
    i18n: {
      en: {
        subtitle: "Web Directory / 2025",
        category: "Web Product",
        description:
          "Petzu is a web app designed to connect pet owners with the best businesses and specialized services in their city. From vets and grooming to shops, daycare, and dog walkers, Petzu centralizes everything in one place so searching and choosing is easier. Unlike other generic directories, Petzu focuses exclusively on the pet-friendly world, letting users discover trustworthy options, compare services, and make informed decisions for their pets' wellbeing. For businesses, Petzu is an opportunity to gain visibility and reach genuinely interested customers through an optimized profile that showcases their services, location, and value proposition.",
      },
    },
  },
];

export const projectBySlug = Object.fromEntries(
  projects.map((p) => [p.slug, p])
);

export function getProjectBySlug(slug: string): Project | undefined {
  return projectBySlug[slug];
}
