import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { DotSeparator } from "./DotSeparator";
import { NayaCardCover } from "./NayaCardCover";
import { Squircle } from "./Squircle";
import { usePageTransition } from "../lib/PageTransitionContext";

const PROJECT_KIND_LABEL = {
  personnel: "Projet perso",
  professionnel: "Projet pro",
} as const;

export interface ProjectCardProps {
  project: Project;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm"];

function isVideo(src: string) {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { navigateWithExit } = usePageTransition();
  const href = `/projects/${project.slug}`;
  const isCompleted = project.isLive === true;

  return (
    <Link
      to={href}
      onClick={(event) => {
        event.preventDefault();
        navigateWithExit(href);
      }}
      className="group flex flex-col gap-4"
    >
      <Squircle
        cornerRadius={16}
        cornerSmoothing={1}
        fill="var(--color-neutral-100)"
        borderWidth={0}
        className="h-80 w-full"
      >
        {project.slug === "naya" ? (
          <NayaCardCover />
        ) : (
          project.coverImage &&
          (isVideo(project.coverImage) ? (
            <video
              src={project.coverImage}
              autoPlay
              loop
              muted
              playsInline
              className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                isCompleted ? "group-hover:scale-105" : "grayscale"
              }`}
            />
          ) : (
            <img
              src={project.coverImage}
              alt=""
              className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                isCompleted ? "group-hover:scale-105" : "grayscale"
              }`}
            />
          ))
        )}
        {isCompleted ? (
          <>
            <div className="absolute inset-0 hidden bg-black opacity-0 transition-opacity duration-300 ease-out md:block md:group-hover:opacity-[0.08]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Squircle
                cornerRadius={8}
                cornerSmoothing={1}
                fill="var(--color-heading)"
                borderWidth={0}
                className="scale-90 opacity-0 transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100"
              >
                <span className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white">
                  Voir le projet
                </span>
              </Squircle>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                Coming soon...
              </span>
            </div>
          </>
        )}
      </Squircle>

      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col items-start gap-1">
          <h4 className="font-casta text-[1.75rem] font-medium leading-none text-heading">
            {project.title}
          </h4>
          {(project.projectKind || project.duration) && (
            <p className="flex items-center gap-2 text-lg font-medium text-body">
              {project.projectKind && (
                <span>{PROJECT_KIND_LABEL[project.projectKind]}</span>
              )}
              {project.projectKind && project.duration && <DotSeparator />}
              {project.duration && <span>{project.duration}</span>}
            </p>
          )}
        </div>
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Squircle
                key={tag}
                cornerRadius={8}
                cornerSmoothing={1}
                borderColor="var(--color-body)"
                fill="none"
              >
                <span className="inline-flex items-center px-3.5 py-1.5 text-base font-medium leading-none text-body">
                  {tag}
                </span>
              </Squircle>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
