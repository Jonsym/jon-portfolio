/**
 * Labs — products currently in development.
 *
 * This powers the "Labs" section, where each product is presented as a journey
 * from idea to public release rather than a finished case study.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * HOW TO ADD / UPDATE A PRODUCT (this is meant to stay dead simple):
 *
 *  1. To log progress, append one object to a product's `milestones` array.
 *     Newest can go at the bottom — the timeline renders in array order
 *     (idea → release), top to bottom.
 *  2. When a milestone is shipped, switch its `status` from "planned" →
 *     "in-progress" → "completed", and bump the product's `currentStage`
 *     so the stage tracker fills up.
 *  3. Every text field is bilingual: `{ es, en }`. Always fill both.
 *  4. (Optional) Attach a screenshot/clip to any milestone via `media`.
 *     Use a local path ("/labs/foo.png"), an Unsplash id via UNSPLASH(...),
 *     or any external URL (auto-served unoptimized when off-host).
 *
 * That's it — text alone is enough to publish an update; images are optional.
 * ──────────────────────────────────────────────────────────────────────────
 */

/** Bilingual string. Spanish is the default locale; English is the toggle. */
export interface Bilingual {
  es: string;
  en: string;
}

/** Optional visual attached to a milestone (screenshot, mockup, clip). */
export interface LabMedia {
  type: "image" | "video";
  /** Local path, UNSPLASH(...) helper, or any external URL. */
  src: string;
  /** Accessible description. */
  alt: string;
  /** CSS aspect-ratio, e.g. "16/10" (default) or "9/16" for phone shots. */
  aspect?: string;
  /** Poster still for videos. */
  poster?: string;
}

/** The five canonical lifecycle stages, in order. Drives the stage tracker. */
export type Stage = "idea" | "design" | "building" | "beta" | "release";

/** A milestone is either shipped, actively in progress, or still ahead. */
export type MilestoneStatus = "completed" | "in-progress" | "planned";

export interface LabMilestone {
  /** "YYYY-MM" (month precision) or "YYYY-MM-DD". Used for display + ordering. */
  date: string;
  stage: Stage;
  status: MilestoneStatus;
  title: Bilingual;
  description: Bilingual;
  /** Optional screenshots / mockups / clips shown inside the milestone card. */
  media?: LabMedia[];
}

export interface LabProduct {
  slug: string;
  name: string;
  /** One-line pitch. */
  tagline: Bilingual;
  /** Longer intro paragraph for the detail header. */
  description: Bilingual;
  /** Brand accent used for nodes, badges and the tracker fill. */
  color: string;
  /** Where the product is right now — fills the tracker up to this stage. */
  currentStage: Stage;
  /** e.g. ["iOS", "Android"]. */
  platforms: string[];
  /** Optional tech stack chips (developer-facing). */
  stack?: string[];
  milestones: LabMilestone[];
}

/** Ordered stage metadata — the single source of truth for the tracker. */
export const STAGES: { key: Stage; label: Bilingual }[] = [
  { key: "idea", label: { es: "Idea", en: "Idea" } },
  { key: "design", label: { es: "Diseño", en: "Design" } },
  { key: "building", label: { es: "Desarrollo", en: "Building" } },
  { key: "beta", label: { es: "Beta", en: "Beta" } },
  { key: "release", label: { es: "Lanzamiento", en: "Release" } },
];

export const STATUS_LABELS: Record<MilestoneStatus, Bilingual> = {
  completed: { es: "Completado", en: "Completed" },
  "in-progress": { es: "En curso", en: "In progress" },
  planned: { es: "Planeado", en: "Planned" },
};

export const stageIndex = (stage: Stage): number =>
  STAGES.findIndex((s) => s.key === stage);

export const stageLabel = (stage: Stage): Bilingual =>
  STAGES[stageIndex(stage)]?.label ?? { es: stage, en: stage };

const MONTHS: Record<"es" | "en", string[]> = {
  es: [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ],
  en: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
};

/** "2026-05" -> "May 2026" (locale-aware short month). */
export function formatMonth(date: string, locale: "es" | "en"): string {
  const [year, month] = date.split("-");
  const idx = Number(month) - 1;
  const name = MONTHS[locale][idx];
  if (!name || !year) return date;
  return `${name} ${year}`;
}

/**
 * The milestone that best represents "where it is now":
 * the in-progress one if any, otherwise the last completed one.
 */
export function latestMilestone(product: LabProduct): LabMilestone | undefined {
  return (
    product.milestones.find((m) => m.status === "in-progress") ??
    [...product.milestones].reverse().find((m) => m.status === "completed")
  );
}

export const labs: LabProduct[] = [
  {
    slug: "chupiroom",
    name: "ChupiRoom",
    color: "#7C3AED",
    currentStage: "building",
    platforms: ["iOS", "Android"],
    stack: ["React Native", "Expo", "TypeScript", "Supabase"],
    tagline: {
      es: "La app para organizar reuniones con amigos, sin el caos del chat grupal.",
      en: "The app to plan hangouts with friends — without the group-chat chaos.",
    },
    description: {
      es: "ChupiRoom reúne en un solo lugar todo lo que implica juntar a tus amigos: proponer un plan, ponerse de acuerdo en fecha y lugar, ver quién se apunta y compartir los detalles. Una experiencia social, rápida y pensada para móvil.",
      en: "ChupiRoom brings together everything that goes into getting your friends together: propose a plan, agree on a date and place, see who's in, and share the details. A fast, social, mobile-first experience.",
    },
    milestones: [
      {
        date: "2026-01",
        stage: "idea",
        status: "completed",
        title: {
          es: "El origen de ChupiRoom",
          en: "Where ChupiRoom started",
        },
        description: {
          es: "Estoy trabajando en una idea pensada por un streamer el cual tiene en mente una app para reuniones y streams con juegos para tomar. Aún sigue en desarrollo, pero me ha permitido experimentar con flujos de juego (TypeScript), diseño de interfaces (React Native + Expo) y decisiones enfocadas en que la experiencia sea rápida y fácil de usar tanto en móvil como en web (React y Expo Web). Seguiré construyendo esta app ya que en algún punto de este mes será mostrada a este mismo streamer y a su comunidad.",
          en: "I am working on a concept devised by a streamer who envisions an app for gatherings and streams featuring drinking games. It is still under development, but the project has allowed me to experiment with game logic (TypeScript), UI design (React Native + Expo), and design choices aimed at ensuring a fast, user-friendly experience across both mobile and web platforms (React and Expo Web). I will continue building this application, as it is set to be showcased to the streamer and their community later this month"
        },
      },
      {
        date: "2026-02",
        stage: "design",
        status: "completed",
        title: {
          es: "Primeras pantallas e ideas",
          en: "First screens and ideas",
        },
        description: {
          es: "Empecé a darle forma a la idea: dibujé las primeras pantallas y pensé cómo se sentiría usar la app de principio a fin, desde crear una reunión hasta arrancar un juego con amigos. La meta era ver la idea cobrar vida antes de entrar en los detalles.",
          en: "I started giving the idea shape: I sketched the first screens and thought about how the app would feel to use from start to finish, from creating a gathering to starting a game with friends. The goal was to see the idea come to life before getting into the details.",
        },
      },
      {
        date: "2026-03",
        stage: "design",
        status: "completed",
        title: {
          es: "La identidad y el estilo de ChupiRoom",
          en: "ChupiRoom's look and feel",
        },
        description: {
          es: "Definí cómo se ve y se siente ChupiRoom: sus colores, su estilo y su personalidad. Quería que se sintiera divertida y coherente en cada pantalla, fiel a la energía de una reunión entre amigos.",
          en: "I defined how ChupiRoom looks and feels: its colors, its style, and its personality. I wanted it to feel fun and consistent on every screen, true to the energy of hanging out with friends.",
        },
        // First version of the app — early screens.
        media: [
          {
            type: "image",
            src: "/labs/chupiroom/old1.png",
            alt: "ChupiRoom — early version, screen 1",
            aspect: "389/835",
          },
          {
            type: "image",
            src: "/labs/chupiroom/old2.png",
            alt: "ChupiRoom — early version, screen 2",
            aspect: "387/821",
          },
          {
            type: "image",
            src: "/labs/chupiroom/old3.png",
            alt: "ChupiRoom — early version, screen 3",
            aspect: "387/840",
          },
        ],
      },
      {
        date: "2026-05",
        stage: "building",
        status: "completed",
        title: {
          es: "Construyendo la primera versión",
          en: "Building the first version",
        },
        description: {
          es: "Ahora mismo estoy construyendo las partes principales de la app: crear una sala, invitar a tus amigos y los juegos para disfrutar juntos. Es la etapa en la que la idea por fin se vuelve algo que puedes tocar y usar.",
          en: "Right now I'm building the main parts of the app: creating a room, inviting your friends, and the games to enjoy together. This is the stage where the idea finally becomes something you can actually touch and use.",
        },
        // Most recent updates in the app.
        media: [
          {
            type: "image",
            src: "/labs/chupiroom/new1.jpg",
            alt: "ChupiRoom — latest version, screen 1",
            aspect: "1284/2630",
          },
          {
            type: "image",
            src: "/labs/chupiroom/new2.jpg",
            alt: "ChupiRoom — latest version, screen 2",
            aspect: "1283/2581",
          },
          {
            type: "image",
            src: "/labs/chupiroom/new3.jpg",
            alt: "ChupiRoom — latest version, screen 3",
            aspect: "1283/2643",
          },
          {
            type: "image",
            src: "/labs/chupiroom/new4.jpg",
            alt: "ChupiRoom — latest version, screen 4",
            aspect: "1282/2636",
          },
        ],
      },
      {
        date: "2026-07",
        stage: "building",
        status: "in-progress",
        title: {
          es: "Salas online y una interfaz más intuitiva",
          en: "Online rooms and a more intuitive interface",
        },
        description: {
          es: "Dos semanas después de haber publicado el primer avance de ChupiRoom, finalmente he podido hostear una sala online en la cual otros dispositivos se han podido unir a jugar. A su vez he mejorado el UI a como estaba antes, con el propósito de hacerlo mas intuitivo y que el usuario al llegar sepa crear su partida online u offline.",
          en: "Two weeks after publishing the first ChupiRoom update, I was finally able to host an online room that other devices could join to play. I also improved the UI compared to before, with the goal of making it more intuitive so that, as soon as they arrive, users know how to create their game — online or offline.",
        },
        // Online multiplayer working + reworked, more intuitive UI.
        media: [
          {
            type: "image",
            src: "/labs/chupiroom/chupi12.jpg",
            alt: "ChupiRoom — online room, screen 1",
            aspect: "1282/2563",
          },
          {
            type: "image",
            src: "/labs/chupiroom/chupi13.jpg",
            alt: "ChupiRoom — online room, screen 2",
            aspect: "1282/2471",
          },
          {
            type: "image",
            src: "/labs/chupiroom/chupi14.jpg",
            alt: "ChupiRoom — online room, screen 3",
            aspect: "1282/2470",
          },
          {
            type: "image",
            src: "/labs/chupiroom/chupi15.jpg",
            alt: "ChupiRoom — online room, screen 4",
            aspect: "1283/2461",
          },
        ],
      },
      {
        date: "2026-08",
        stage: "beta",
        status: "planned",
        title: {
          es: "Primeras pruebas con personas reales",
          en: "First tests with real people",
        },
        description: {
          es: "El siguiente paso es dejar que un grupo pequeño de personas pruebe la app en una reunión real. Su experiencia me ayudará a entender qué funciona, qué mejorar y cómo hacerla aún más divertida.",
          en: "The next step is to let a small group of people try the app in a real gathering. Their experience will help me understand what works, what to improve, and how to make it even more fun.",
        },
      },
      {
        date: "2026-11",
        stage: "release",
        status: "planned",
        title: {
          es: "Lanzamiento público",
          en: "Public launch",
        },
        description: {
          es: "La meta es lanzar ChupiRoom para que cualquiera pueda descargarla y usarla con sus amigos. A partir de ahí, seguiré mejorándola con todo lo aprendido en el camino.",
          en: "The goal is to launch ChupiRoom so anyone can download it and use it with their friends. From there, I'll keep improving it with everything learned along the way.",
        },
      },
    ],
  },
  {
    slug: "momentum",
    name: "Momentum",
    color: "#EA580C",
    currentStage: "design",
    platforms: ["iOS", "Android"],
    stack: ["React Native", "Expo", "TypeScript"],
    tagline: {
      es: "Construye constancia. Convierte tus metas en hábitos diarios.",
      en: "Build consistency. Turn your goals into daily habits.",
    },
    description: {
      es: "Este fin de semana estuve creando una app que me ayude a mejorar mis hábitos tanto personales como laborales. La idea principal es crear habito, definir hora y recibir la notificación. Lo cual fue lo mas importante y en lo que me enfoque, que la notificación sea visible y este a la hora programada.",
      en: "This weekend, I was building an application to help me improve my personal and professional habits. The core idea is to establish a habit, set a time, and receive a notification. That was the most important aspect—and my main focus—was ensuring the notification was visible and arrived at the scheduled time.",
    },
    milestones: [
      {
        date: "2026-03",
        stage: "idea",
        status: "completed",
        title: {
          es: "La idea detrás de Momentum",
          en: "The idea behind Momentum",
        },
        description: {
          es: "Momentum nació de una necesidad personal: quería mejorar mis hábitos del día a día, tanto personales como de trabajo. La idea es simple: eliges un hábito, defines a qué hora quieres hacerlo y la app te recuerda en el momento justo para que no se te pase.",
          en: "Momentum was born from a personal need: I wanted to improve my everyday habits, both personal and work-related. The idea is simple: you choose a habit, set the time you want to do it, and the app reminds you at just the right moment so you don't miss it.",
        },
      },
      {
        date: "2026-04",
        stage: "idea",
        status: "completed",
        title: {
          es: "Lo más importante: el recordatorio",
          en: "The most important part: the reminder",
        },
        description: {
          es: "Me di cuenta de que lo más importante era el recordatorio: tenía que ser claro y llegar justo a la hora indicada, porque si la notificación falla, el hábito se pierde. Eso se volvió el centro de toda la app.",
          en: "I realized the most important thing was the reminder: it had to be clear and arrive right on time, because if the notification fails, the habit falls apart. That became the heart of the whole app.",
        },
      },
      {
        date: "2026-06",
        stage: "design",
        status: "in-progress",
        title: {
          es: "Diseñando la experiencia",
          en: "Designing the experience",
        },
        description: {
          es: "Estoy diseñando cómo se ve y se siente la app: crear un hábito, elegir la hora y ver tu progreso de una forma sencilla y motivadora. Quiero que abrirla sea fácil y que dé ganas de seguir.",
          en: "I'm designing how the app looks and feels: creating a habit, choosing a time, and seeing your progress in a simple, motivating way. I want it to be easy to open and to make you want to keep going.",
        },
        media: [
          {
            type: "image",
            src: "/labs/momentum/mome1.png",
            alt: "Momentum — app screen 1",
            aspect: "1284/2778",
          },
          {
            type: "image",
            src: "/labs/momentum/mome2.png",
            alt: "Momentum — app screen 2",
            aspect: "1284/2778",
          },
          {
            type: "image",
            src: "/labs/momentum/mome3.png",
            alt: "Momentum — app screen 3",
            aspect: "1284/2778",
          },
        ],
      },
      {
        date: "2026-09",
        stage: "building",
        status: "planned",
        title: {
          es: "Construyendo la primera versión",
          en: "Building the first version",
        },
        description: {
          es: "Con el diseño listo, el siguiente paso es construir las funciones principales: crear hábitos, recibir los recordatorios y llevar el seguimiento de tu progreso día a día.",
          en: "With the design ready, the next step is to build the main features: creating habits, getting reminders, and keeping track of your progress day by day.",
        },
      },
      {
        date: "2026-12",
        stage: "beta",
        status: "planned",
        title: {
          es: "Probándola en el día a día",
          en: "Testing it day to day",
        },
        description: {
          es: "Dejaré que algunas personas la usen en su rutina real para ver si de verdad les ayuda a ser constantes. Lo que me cuenten me servirá para mejorarla antes de abrirla a todos.",
          en: "I'll let a few people use it in their real routine to see if it truly helps them stay consistent. What they tell me will help me improve it before opening it to everyone.",
        },
      },
      {
        date: "2027-02",
        stage: "release",
        status: "planned",
        title: {
          es: "Lanzamiento público",
          en: "Public launch",
        },
        description: {
          es: "La meta es lanzar Momentum para que cualquiera pueda usarla para construir mejores hábitos. Y a partir de ahí, seguir mejorándola poco a poco.",
          en: "The goal is to launch Momentum so anyone can use it to build better habits. And from there, keep improving it little by little.",
        },
      },
    ],
  },
];

export const labBySlug = Object.fromEntries(labs.map((p) => [p.slug, p]));

export function getLabBySlug(slug: string): LabProduct | undefined {
  return labBySlug[slug];
}
