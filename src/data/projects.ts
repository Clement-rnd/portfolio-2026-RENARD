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
}

export const projects: Project[] = [
  {
    slug: "naya",
    title: "Naya",
    projectKind: "personnel",
    duration: "6 mois",
    tags: [
      "UX Research",
      "Direction Artistique",
      "UI Design",
      "Prototypage & Vibe coding",
    ],
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
  },
  {
    slug: "design-system-os",
    title: "Design System OS",
    projectKind: "professionnel",
    duration: "En cours",
    tags: ["Design System", "Design Tokens", "Figma"],
  },
  {
    slug: "voyage",
    title: "Voyage",
    projectKind: "personnel",
    duration: "2 mois",
    tags: ["Direction Artistique", "UI Design", "Prototypage"],
  },
];
