export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Cadrage & Brief",
    description:
      "Comprendre les objectifs, les besoins utilisateurs et les contraintes techniques. Définir le périmètre et les problèmes bloquant.",
  },
  {
    number: "02",
    title: "Recherche & Stratégie",
    description:
      "Comprendre les besoins utilisateurs par la recherche, analyser la concurrence et identifier les opportunités de design.",
  },
  {
    number: "03",
    title: "Design & Prototypage",
    description:
      "Concevoir les interfaces, vérification du respect du design system, vibe coder un prototype fonctionnel pour tester/valider.",
  },
  {
    number: "04",
    title: "Validation & Test utilisateurs",
    description:
      "Fournir aux devs des spécifications détaillées, collaborer pendant le développement et garantir la qualité jusqu'en production.",
  },
];
