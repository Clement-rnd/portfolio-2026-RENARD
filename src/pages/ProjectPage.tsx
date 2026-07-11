import { useParams } from "react-router-dom";
import { AnimatedHeading } from "../components/AnimatedHeading";
import { projects } from "../data/projects";

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <p className="text-neutral-400">Projet introuvable : {slug}</p>
      </main>
    );
  }

  return (
    <main className="px-6">
      <section className="min-h-screen flex items-center">
        <AnimatedHeading
          text={project.title}
          as="h1"
          className="font-casta font-light leading-none text-[clamp(2.5rem,7vw,9rem)]"
        />
      </section>
    </main>
  );
}
