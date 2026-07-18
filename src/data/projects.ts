import type { ProcessStep } from "./process";
import screenSplash from "../assets/images/naya/screens/splash.png";
import screenHome from "../assets/images/naya/screens/home.png";
import screenHealth from "../assets/images/naya/screens/health.png";
import screenAnimalProfile from "../assets/images/naya/screens/animal-profile.png";
import screenAnimalInfo from "../assets/images/naya/screens/animal-info.png";
import screenConsultationsList from "../assets/images/naya/screens/consultations-list.png";
import screenConsultationDetails from "../assets/images/naya/screens/consultation-details.png";
import screenMedicalHistoryDetails from "../assets/images/naya/screens/medical-history-details.png";
import screenTreatmentDetails from "../assets/images/naya/screens/treatment-details.png";
import screenVaccineDetails from "../assets/images/naya/screens/vaccine-details.png";
import screenAllergyDetails from "../assets/images/naya/screens/allergy-details.png";
import screenPrescriptionDetails from "../assets/images/naya/screens/prescription-details.png";
import modifiedVaccineDetails from "../assets/images/naya/screens-modified/vaccine-details.png";
import modifiedTreatmentDetails from "../assets/images/naya/screens-modified/treatment-details.png";
import modifiedMedicalAddData from "../assets/images/naya/screens-modified/medical-add-data.png";
import modifiedMedicalTypingData1 from "../assets/images/naya/screens-modified/medical-typing-data-1.png";
import modifiedMedicalTypingData2 from "../assets/images/naya/screens-modified/medical-typing-data-2.png";
import modifiedMedicalSize from "../assets/images/naya/screens-modified/medical-size.png";
import userTestingAnalysisBoard from "../assets/images/naya/user-testing-analysis-board.png";
import userTestingAnalysisBoardMobile from "../assets/images/naya/user-testing-analysis-board-mobile.png";
import {
  Target02Icon,
  PaintBoardIcon,
  PuzzleIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons";

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
  /** Shows the "Direction artistique" section (logo, color palette,
   * typography specimen, icon set) — bespoke content, currently Naya only. */
  hasDirectionArtistique?: boolean;
  directionArtistiqueText?: string;
  /** The project page's "Design system" section (title + write-up, above
   * the token construction visual). */
  designSystemSection?: {
    title: string;
    description: string;
    /** Optional bullet list under the description, e.g. one item per
     * design file (Librairie / Design System / Projet). */
    items?: { label: string; text: string }[];
  };
  /** The token construction visual (primitives -> semantic -> component). */
  designTokenFlow?: DesignTokenFlow;
  /** The "Décisions clés" section — one card per decision. */
  keyDecisions?: { title: string; description: string }[];
  /** The "Tests utilisateurs" section — same label/value layout as the
   * overview row (Type / Rôle / Compétences / Statut). */
  userTesting?: { label: string; value: string }[];
  /** Composed analysis board (single Figma export, full viewport width,
   * intentionally cropped top/bottom) shown between the stats row and the
   * updated screens, in "Tests utilisateurs" — desktop only. */
  userTestingAnalysisBoard?: string;
  /** Simpler single-scenario board shown instead, on mobile. */
  userTestingAnalysisBoardMobile?: string;
  /** Screens updated after user testing, shown at the end of "Tests
   * utilisateurs" — same swipe carousel as the "Écrans" section. */
  userTestingScreens?: string[];
  livePrototypeUrl?: string;
  /** The "Ce que je ferais différemment" section — bullet list, same
   * DotSeparator marker as the Design system items. */
  retrospective?: { label?: string; text: string }[];
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
    icon: Target02Icon,
    title: "Cadrage & Objectifs",
    description:
      "Définir le périmètre du projet, poser les intentions et les objectifs avant toute décision visuelle.",
  },
  {
    icon: PaintBoardIcon,
    title: "Identité & Univers",
    description:
      "Création de la charte graphique et construction de l'univers visuel, la base qui donne le ton à tout le reste.",
  },
  {
    icon: PuzzleIcon,
    title: "Navigation & Flows",
    description:
      "Conception de l'architecture de navigation et des flows pour définir comment les écrans s'articulent entre eux.",
  },
  {
    icon: SourceCodeIcon,
    title: "Design & Prototypage",
    description:
      "Création des écrans, des assets, et vibe coding du prototype pour faire vivre l'application.",
  },
];

export const projects: Project[] = [
  {
    slug: "naya",
    title: "Naya",
    tagline: "Prendre soin,\nsans stress",
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
    screens: [
      { image: screenSplash },
      { image: screenHome },
      { image: screenHealth },
      { image: screenAnimalProfile },
      { image: screenAnimalInfo },
      { image: screenAllergyDetails },
      { image: screenMedicalHistoryDetails },
      { image: screenVaccineDetails },
      { image: screenTreatmentDetails },
      { image: screenConsultationsList },
      { image: screenConsultationDetails },
      { image: screenPrescriptionDetails },
    ],
    hasDirectionArtistique: true,
    directionArtistiqueText:
      "Là où les autres marques adoptent une identité classique du domaine de la santé, NAYA se démarque en mettant en avant son lien affectif. Une couleur chaude, des formes plus douces, un ton de voix plus affectueux. Une manière de rappeler que derrière chaque donnée de santé, il y a une relation, pas juste un dossier.",
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
    designSystemSection: {
      title: "Design system",
      description:
        "Le design system n'est pas figé au jour de sa création : il est pensé pour grandir avec le projet. C'est pourquoi le système repose sur trois fichiers distincts qui communiquent entre eux.",
      items: [
        {
          label: "La Librairie",
          text: "rassemble tout ce qui est réutilisable brut : icônes, logos, avatars, drapeaux.",
        },
        {
          label: "Le Design System",
          text: "contient les tokens organisés en trois niveaux, les composants construits à partir de ces tokens, et toute la documentation qui explique comment le design system fonctionne.",
        },
        {
          label: "Le fichier Projet",
          text: "vient ensuite piocher dans les deux premiers pour construire les recherches, l'arborescence, les userflows et les écrans finaux.",
        },
      ],
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
    keyDecisions: [
      {
        title: "Les données médicales réservées au vétérinaire",
        description:
          "Plutôt que de tout mettre dans un seul scroll, j'ai créé deux onglets bien distincts. Le propriétaire remplit les infos générales, le vétérinaire s'occupe du médical. Chacun reste dans son rôle, et l'écran ne se retrouve pas noyé sous des infos qui n'ont rien à voir entre elles.",
      },
      {
        title: "Un pattern de fiche universel",
        description:
          "Au lieu de designer un écran différent pour chaque type d'info médicale, j'ai construit un seul template une icône, un titre, un badge de criticité, quelques blocs de détails. Ce même schéma sert aussi bien pour une allergie que pour un vaccin ou un traitement. Résultat : tout se ressemble, tout s'apprend une seule fois, et si demain il faut ajouter un nouveau type de donnée, pas besoin de tout repenser.",
      },
      {
        title: "Classement des allergies",
        description:
          "Deux façons logiques de trier les allergies d'un animal : par catégorie (alimentaire, environnementale, médicale) ou par gravité (élevé, modéré, faible). J'ai choisi la catégorie comme tri par défaut, avec un code couleur qui indique la gravité de chaque allergie sans avoir à changer de tri.",
      },
    ],
    userTesting: [
      {
        label: "Participants",
        value: "5 participants (26 à 63 ans, profils variés)",
      },
      { label: "Format", value: "Entretiens semi-dirigés de 45 min" },
      { label: "Scénarios", value: "10 scénarios testés" },
      { label: "Prototype", value: "Prototype vibecodé" },
    ],
    userTestingAnalysisBoard,
    userTestingAnalysisBoardMobile,
    userTestingScreens: [
      modifiedMedicalSize,
      modifiedMedicalAddData,
      modifiedMedicalTypingData1,
      modifiedMedicalTypingData2,
      modifiedTreatmentDetails,
      modifiedVaccineDetails,
    ],
    retrospective: [
      {
        label: "Le manque de regard extérieur.",
        text: "Ça a des avantages, mais aussi un vrai angle mort : personne pour challenger mes choix avant d'arriver aux tests. Un autre designer ou un dev aurait sûrement repéré certaines limites plus tôt.",
      },
      {
        label: "Un panel de test un peu court.",
        text: "5 participants, c'est le minimum pour commencer à voir les vrais problèmes en UX research, mais ça reste juste. Deux ou trois profils en plus auraient donné plus de poids aux retours.",
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
