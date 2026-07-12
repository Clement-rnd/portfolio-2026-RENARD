import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";
import { RevealChars } from "../components/RevealChars";
import { Squircle } from "../components/Squircle";
import { projects } from "../data/projects";
import { useEntranceReveal } from "../hooks/useEntranceReveal";
import {
  PROJECT_BASELINE_CHAR_DURATION,
  PROJECT_BASELINE_STAGGER,
  PROJECT_COVER_DURATION,
  PROJECT_TITLE_CHAR_DURATION,
  PROJECT_TITLE_STAGGER,
  getProjectSequence,
} from "../lib/projectPageSequence";

const VIDEO_EXTENSIONS = [".mp4", ".webm"];

function isVideo(src: string) {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

const sectionTitleClassName = "font-casta text-3xl font-medium text-heading";
const overviewLabelClassName = "text-sm font-medium text-body";
const overviewValueClassName = "text-lg font-medium text-heading";

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

  const otherProjects = projects.filter((p) => p.slug !== project.slug);
  const baselineText = project.tagline ?? project.title;
  const { baselineDelay, coverDelay, titleDelay } = getProjectSequence(
    baselineText,
    project.title,
  );

  return (
    <main className="mx-auto max-w-[96rem] px-4 md:px-6">
      <section className="flex min-h-screen -translate-y-8 flex-col items-center justify-center gap-4 text-center">
        <RevealChars
          text={project.title}
          trigger={true}
          delay={titleDelay}
          stagger={PROJECT_TITLE_STAGGER}
          duration={PROJECT_TITLE_CHAR_DURATION}
          className="text-[1.25rem] font-medium uppercase tracking-widest text-body"
        />
        <h1 className="max-w-[56rem] font-casta font-medium leading-tight text-[3rem] text-heading lg:text-[clamp(3rem,6vw,7rem)]">
          <RevealChars
            text={baselineText}
            trigger={true}
            delay={baselineDelay}
            stagger={PROJECT_BASELINE_STAGGER}
            duration={PROJECT_BASELINE_CHAR_DURATION}
          />
        </h1>
      </section>

      <section className="-mt-[232px] pb-12 md:-mt-48">
        <motion.div
          {...useEntranceReveal({
            delay: coverDelay,
            duration: PROJECT_COVER_DURATION,
          })}
        >
          <Squircle
            cornerRadius={16}
            cornerSmoothing={1}
            fill="var(--color-neutral-100)"
            borderWidth={0}
            className="h-[66vh] w-full"
          >
            {project.coverImage &&
              (isVideo(project.coverImage) ? (
                <video
                  src={project.coverImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={project.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ))}
          </Squircle>
        </motion.div>
      </section>

      <section className="flex flex-col gap-6 pb-12">
        <hr className="border-neutral-200" />
        <div className="flex flex-col gap-12 md:flex-row">
          {project.overviewType && (
            <div className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Type</h6>
              <p className={overviewValueClassName}>{project.overviewType}</p>
            </div>
          )}
          {project.meta && project.meta.roles.length > 0 && (
            <div className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Rôle</h6>
              <p className={overviewValueClassName}>
                {project.meta.roles.join(", ")}
              </p>
            </div>
          )}
          {project.tags.length > 0 && (
            <div className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Compétences</h6>
              <div className="flex flex-col gap-2">
                {project.tags.map((tag) => (
                  <p key={tag} className={overviewValueClassName}>
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          )}
          {project.status && (
            <div className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Statut</h6>
              <Squircle
                cornerRadius={8}
                cornerSmoothing={1}
                fill="#E4E1FB"
                borderWidth={0}
                className="self-start"
              >
                <span className="inline-flex items-center px-3.5 py-1.5 text-base font-medium text-[#4338CA]">
                  {project.status}
                </span>
              </Squircle>
            </div>
          )}
        </div>
      </section>

      {project.targetUsers && (
        <section className="flex h-[66vh] flex-col items-center justify-center pb-12 text-center">
          <p className="max-w-[64rem] font-casta text-[2rem] font-medium leading-snug text-heading md:text-[3rem]">
            {project.targetUsers}
          </p>
        </section>
      )}

      {project.keyDecisions && project.keyDecisions.length > 0 && (
        <section className="flex flex-col gap-4 pb-12">
          <h2 className={sectionTitleClassName}>Décisions clés</h2>
          <ul className="flex flex-col gap-2">
            {project.keyDecisions.map((decision, index) => (
              <li key={index} className="text-lg font-medium text-body">
                {decision}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-6 pb-12">
        <h2 className={sectionTitleClassName}>Voir d'autres projets</h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
          {otherProjects.map((otherProject) => (
            <ProjectCard key={otherProject.slug} project={otherProject} />
          ))}
        </div>
      </section>
    </main>
  );
}
