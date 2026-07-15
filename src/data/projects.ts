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

export interface DesignToken {
  name: string;
  /** The tier-below token/value it resolves to, e.g. a semantic token
   * pointing at "corail/500", or a raw hex for the primitive tier. */
  reference: string;
  /** Swatch color shown next to the token. */
  color: string;
}

export interface DesignTokenFlow {
  primitives: DesignToken[];
  semantic: DesignToken[];
  component: DesignToken[];
}

export interface SitemapItem {
  label: string;
  /** Deepest level of the tree, shown with a subtler style (no icon). */
  children?: string[];
}

export interface SitemapCategory {
  label: string;
  items: SitemapItem[];
}

export interface TargetUserPersona {
  title: string;
  context: string;
  needs: string;
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
  /** Personas shown in the "Utilisateurs cibles" section, just before the
   * problématique. */
  targetUserPersonas?: TargetUserPersona[];
  targetUsers?: string;
  artDirection?: string;
  screens?: ProjectScreen[];
  /** The project page's "Branding" section, just below the problématique —
   * a grid of image cards (moodboard, logo, palette, etc.). */
  brandingImages?: ProjectScreen[];
  /** The project page's "Design system" section (title + write-up, above
   * the token construction visual). */
  designSystemSection?: {
    title: string;
    description: string;
  };
  /** The token construction visual (primitives -> semantic -> component). */
  designTokenFlow?: DesignTokenFlow;
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
  /** The project page's sitemap/arborescence tree. */
  sitemap?: SitemapCategory[];
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
    tagline: "Prendre soin, sans stress",
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
    targetUserPersonas: [
      {
        title: "Jeune propriétaire",
        context:
          "Premier animal, l'a adopté il y a quelques mois. Tout est nouveau, il découvre.",
        needs:
          "Être rassuré. Comprendre si un symptôme est grave ou bénin. Savoir quoi faire en cas de doute. Ne pas paraître ridicule auprès du vétérinaire en posant \"des questions bêtes\".",
      },
      {
        title: "Le propriétaire multi-animaux",
        context:
          "Vit avec deux ou trois animaux. Souvent des espèces ou âges différents : un chat senior + un jeune chien par exemple.",
        needs:
          "Gérer plusieurs dossiers de santé en parallèle. Ne pas mélanger les traitements. Suivre des rythmes de soins différents (vermifuge tous les mois pour l'un, vaccin annuel pour l'autre).",
      },
      {
        title: "Le propriétaire occupé / pragmatique",
        context:
          "Vie active, peu de temps. L'animal est là depuis longtemps, la relation est stable.",
        needs:
          "Efficacité. Prendre rendez-vous rapidement. Ne pas oublier les renouvellements de traitements ou les vaccins annuels. Tout faire sans appeler.",
      },
      {
        title: "Le propriétaire d'un animal âgé ou malade",
        context:
          "Animal entré dans une phase de soins réguliers : maladie chronique, vieillissement, suivi post-opératoire.",
        needs:
          "Suivre l'évolution dans le temps (poids, symptômes, prises de traitement). Communiquer régulièrement avec le vétérinaire entre les rendez-vous. Documenter l'état pour adapter les soins.",
      },
    ],
    targetUsers:
      "Comment améliorer la communication entre vétérinaires et propriétaires d'animaux ?",
    // Placeholder slots — vraies images à venir.
    brandingImages: [
      { image: "" },
      { image: "" },
      { image: "" },
      { image: "" },
    ],
    screens: [{ image: "" }, { image: "" }],
    intro: {
      project: {
        title: "Projet",
        description:
          "NAYA est un écosystème digital dédié à la santé animale une application disponible sur mobile et web, pensée pour deux types d'utilisateurs. Du côté propriétaire : centraliser toutes les informations de ses animaux en un seul endroit. Du côté vétérinaire : gérer les fiches patients, le planning et les échanges.",
      },
      context: {
        title: "Contexte",
        description:
          "Quand leur animal ne va pas bien, la plupart des propriétaires se tournent d'abord vers les réseaux sociaux. Les conseils qu'ils reçoivent proviennent de personnes sans formation médicale. Pour un sujet aussi sérieux, ce n'est clairement pas une source fiable.",
      },
    },
    processSteps: [
      {
        number: "01",
        title: "Cadrage",
        description:
          "Définir le périmètre du concept, identifier les cibles et poser les bases du projet.",
      },
      {
        number: "02",
        title: "Recherche",
        description:
          "Procéder à un benchmark concurrentiel, étudier le public cible et les cas d'usage. Définir le scope MVP.",
      },
      {
        number: "03",
        title: "Direction artistique",
        description:
          "Construction de l'identité de marque : nom, logo, univers visuel.",
      },
      {
        number: "04",
        title: "Design system",
        description:
          "Mise en place des fondations visuelles : couleurs, typographies, composants réutilisables.",
      },
      {
        number: "05",
        title: "Design des écrans",
        description:
          "Mise en place de l'arborescence et des userflows, conception des écrans.",
      },
      {
        number: "06",
        title: "Prototype",
        description:
          "Vibe coding du prototype hi-fi totalement fonctionnel sur mobile.",
      },
      {
        number: "07",
        title: "Tests",
        description:
          "Définition des utilisateurs à interviewer, conception de la trame de test et des scénarios à vérifier. Organiser les tests, traiter et synthétiser les résultats.",
      },
      {
        number: "08",
        title: "Itérations",
        description: "Ajuster l'application en fonction des retours.",
      },
    ],
    designSystemSection: {
      title: "Design system",
      // Placeholder — à remplacer par le vrai texte de présentation.
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
    designTokenFlow: {
      primitives: [
        { name: "corail-500", reference: "#FF5A7D", color: "#FF5A7D" },
      ],
      semantic: [
        {
          name: "brand-surface-default",
          reference: "corail/500",
          color: "#FF5A7D",
        },
        {
          name: "brand-border-primary",
          reference: "corail/500",
          color: "#FF5A7D",
        },
        {
          name: "brand-border-focus",
          reference: "corail/500",
          color: "#FF5A7D",
        },
        {
          name: "brand-content-primary",
          reference: "corail/500",
          color: "#FF5A7D",
        },
      ],
      component: [
        {
          name: "dropdown-border-focus",
          reference: "brand-border-focus",
          color: "#FF5A7D",
        },
        {
          name: "search-border-focus",
          reference: "brand-border-focus",
          color: "#FF5A7D",
        },
        {
          name: "textfield-border-focus",
          reference: "brand-border-focus",
          color: "#FF5A7D",
        },
      ],
    },
    sitemap: [
      {
        label: "Accueil",
        items: [
          { label: "Planifier une consultation" },
          { label: "Ajouter des animaux" },
          { label: "Rappels" },
          { label: "Notifications" },
          { label: "Santé" },
          { label: "Messagerie" },
          { label: "Profil" },
        ],
      },
      {
        label: "Messages",
        items: [
          { label: "Nouvelle conversation" },
          {
            label: "Conversations",
            children: ["Historique du chat", "Informations"],
          },
        ],
      },
      {
        label: "Calendrier",
        items: [{ label: "Créer un rappel" }],
      },
      {
        label: "Santé",
        items: [
          { label: "Consultations" },
          {
            label: "Mes animaux",
            children: ["Informations générales", "Informations médicales"],
          },
          { label: "Ordonnances" },
          { label: "Traitements" },
        ],
      },
      {
        label: "Compte",
        items: [
          {
            label: "Ma clinique",
            children: [
              "Informations générales",
              "Sécurité et confidentialité",
              "Langue",
              "Supprimer mon compte",
            ],
          },
          {
            label: "Mes informations",
            children: [
              "Informations générales",
              "Sécurité et confidentialité",
              "Langue",
              "Supprimer mon compte",
            ],
          },
          { label: "Paramètres de confidentialité" },
          { label: "À propos" },
          { label: "Déconnexion" },
        ],
      },
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
