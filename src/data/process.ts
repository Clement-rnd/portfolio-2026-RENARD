import {
  Target02Icon,
  Search01Icon,
  PaintBoardIcon,
  PuzzleIcon,
  PenTool03Icon,
  SourceCodeIcon,
  UserGroupIcon,
  IterationCcwIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface ProcessStep {
  /** Shown instead of a step number, in the ProcessCard's header. */
  icon: IconSvgElement;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    icon: Target02Icon,
    title: "Cadrage",
    description:
      "Définir le périmètre du concept, identifier les cibles et poser les bases du projet. Définir le scope MVP.",
  },
  {
    icon: Search01Icon,
    title: "Recherche",
    description:
      "Procéder à un benchmark concurrentiel, étudier le public cible et les cas d'usage.",
  },
  {
    icon: PaintBoardIcon,
    title: "Direction artistique",
    description:
      "Construction de l'identité de marque : nom, logo, univers visuel.",
  },
  {
    icon: PuzzleIcon,
    title: "Design system",
    description:
      "Mise en place des fondations visuelles : couleurs, typographies, composants réutilisables.",
  },
  {
    icon: PenTool03Icon,
    title: "Design des écrans",
    description:
      "Mise en place de l'arborescence et des userflows, conception des écrans.",
  },
  {
    icon: SourceCodeIcon,
    title: "Prototype",
    description:
      "Vibe coding du prototype hi-fi totalement fonctionnel sur mobile.",
  },
  {
    icon: UserGroupIcon,
    title: "Tests",
    description:
      "Définition les utilisateurs cible à interviewer, conception de la trame de test et des scénarios à vérifier. Organiser les tests, traiter et synthétiser les résultats.",
  },
  {
    icon: IterationCcwIcon,
    title: "Itérations",
    description: "Ajuster l'application en fonction des retours.",
  },
];
