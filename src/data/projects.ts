import type { ProcessStep } from "./process";

export interface ProjectMeta {
  roles: string[];
  duration: string;
  tools: string[];
}

export interface ProjectIntroCard {
  title: string;
  description: string;
}

export interface ProjectScreen {
  image: string;
  caption?: string;
}

export interface ProjectDesignSystemToken {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  /** Shown on the home card as "Projet perso"/"Projet pro". */
  projectKind?: "personnel" | "professionnel";
  /** Shown on the home card next to projectKind, e.g. "6 mois". */
  duration?: string;
  /** Short tags shown as pill chips on the home project card. */
  tags: string[];
  /** Image or video (.mp4/.webm) shown on the home project card. */
  coverImage?: string;
  tagline?: string;
  meta?: ProjectMeta;
  intro?: {
    project: ProjectIntroCard;
    context: ProjectIntroCard;
  };
  context?: string;
  targetUsers?: string;
  artDirection?: string;
  screens?: ProjectScreen[];
  designSystem?: ProjectDesignSystemToken[];
  keyDecisions?: string[];
  userTesting?: string;
  livePrototypeUrl?: string;
  retrospective?: string;
  /** Shown in the project page's overview row, e.g. "Application mobile". */
  overviewType?: string;
  /** Shown in the project page's overview row, e.g. "Terminé"/"En cours". */
  status?: string;
  /** The project page's own "Cadrage" process steps (reuses the home
   * page's ProcessCard). */
  processSteps?: ProcessStep[];
}

// Placeholder lorem ipsum, reused across every project page's introduction
// cards until each project gets its own specific write-up.
const DEFAULT_INTRO: { project: ProjectIntroCard; context: ProjectIntroCard } =
  {
    project: {
      title: "Lorem ipsum dolor",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    context: {
      title: "Ut enim ad minim",
      description:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  };

// Generic UX methodology steps, reused across every project page's
// "Cadrage" section until each project gets its own specific write-up.
const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Cadrage & Objectifs",
    description:
      "Définir le périmètre du projet, poser les intentions et les objectifs avant toute décision visuelle.",
  },
  {
    number: "02",
    title: "Identité & Univers",
    description:
      "Création de la charte graphique et construction de l'univers visuel, la base qui donne le ton à tout le reste.",
  },
  {
    number: "03",
    title: "Navigation & Flows",
    description:
      "Conception de l'architecture de navigation et des flows pour définir comment les écrans s'articulent entre eux.",
  },
  {
    number: "04",
    title: "Design & Prototypage",
    description:
      "Création des écrans, des assets, et vibe coding du prototype pour faire vivre l'application.",
  },
];

export const projects: Project[] = [
  {
    slug: "naya",
    title: "Naya",
    // Placeholder — à remplacer par la vraie tagline du projet.
    tagline: "Une tagline à venir pour Naya",
    projectKind: "personnel",
    duration: "6 mois",
    tags: [
      "UX Research",
      "Direction Artistique",
      "UI Design",
      "Prototypage & Vibe coding",
    ],
    meta: {
      roles: ["Product Designer"],
      duration: "6 mois",
      tools: ["Figma"],
    },
    overviewType: "Application mobile",
    status: "Terminé",
    // Placeholder — à remplacer par le vrai texte de présentation.
    context:
      "Texte de présentation du projet à venir : contexte, objectifs, et périmètre de Naya.",
    // Placeholder — à remplacer par la vraie cible/problématique.
    targetUsers:
      "Description de la cible et de la problématique adressée par Naya à venir.",
    screens: [{ image: "" }, { image: "" }],
    intro: DEFAULT_INTRO,
    processSteps: DEFAULT_PROCESS_STEPS,
  },
  {
    slug: "acpr",
    title: "ACPR",
    tagline: "Outil de réclamation pour assureurs — projet d'alternance OS",
    projectKind: "professionnel",
    duration: "En cours",
    tags: [
      "UX/UI Design",
      "Prototypage & Vibe coding",
      "Collaboration stakeholders",
    ],
    meta: {
      roles: ["Product Designer"],
      duration: "En cours",
      tools: ["Figma"],
    },
    // Placeholder — à remplacer par le vrai type de projet.
    overviewType: "À définir",
    status: "En cours",
    // Placeholder — à remplacer par le vrai texte de présentation.
    context:
      "Texte de présentation du projet à venir : contexte, objectifs, et périmètre d'ACPR.",
    // Placeholder — à remplacer par la vraie cible/problématique.
    targetUsers:
      "Description de la cible et de la problématique adressée par ACPR à venir.",
    screens: [{ image: "" }, { image: "" }],
    intro: DEFAULT_INTRO,
    processSteps: DEFAULT_PROCESS_STEPS,
  },
  {
    slug: "design-system-os",
    title: "Design System OS",
    // Placeholder — à remplacer par la vraie tagline du projet.
    tagline: "Une tagline à venir pour Design System OS",
    projectKind: "professionnel",
    duration: "En cours",
    tags: ["Design System", "Design Tokens", "Figma"],
    meta: {
      roles: ["Product Designer"],
      duration: "En cours",
      tools: ["Figma"],
    },
    // Placeholder — à remplacer par le vrai type de projet.
    overviewType: "À définir",
    status: "En cours",
    // Placeholder — à remplacer par le vrai texte de présentation.
    context:
      "Texte de présentation du projet à venir : contexte, objectifs, et périmètre de Design System OS.",
    // Placeholder — à remplacer par la vraie cible/problématique.
    targetUsers:
      "Description de la cible et de la problématique adressée par Design System OS à venir.",
    screens: [{ image: "" }, { image: "" }],
    intro: DEFAULT_INTRO,
    processSteps: DEFAULT_PROCESS_STEPS,
  },
  {
    slug: "voyage",
    title: "Voyage",
    // Placeholder — à remplacer par la vraie tagline du projet.
    tagline: "Une tagline à venir pour Voyage",
    projectKind: "personnel",
    duration: "2 mois",
    tags: ["Direction Artistique", "UI Design", "Prototypage"],
    meta: {
      roles: ["Product Designer"],
      duration: "2 mois",
      tools: ["Figma"],
    },
    // Placeholder — à remplacer par le vrai type de projet.
    overviewType: "À définir",
    status: "Terminé",
    // Placeholder — à remplacer par le vrai texte de présentation.
    context:
      "Texte de présentation du projet à venir : contexte, objectifs, et périmètre de Voyage.",
    // Placeholder — à remplacer par la vraie cible/problématique.
    targetUsers:
      "Description de la cible et de la problématique adressée par Voyage à venir.",
    screens: [{ image: "" }, { image: "" }],
    intro: DEFAULT_INTRO,
    processSteps: DEFAULT_PROCESS_STEPS,
  },
];
