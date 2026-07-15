export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
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
];
