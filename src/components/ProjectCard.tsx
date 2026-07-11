import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import { DotSeparator } from "./DotSeparator";
import { Squircle } from "./Squircle";

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
  return (
    <Link to={`/projects/${project.slug}`} className="flex flex-col gap-4">
      <div className="h-80 w-full overflow-hidden rounded-2xl bg-neutral-100">
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
      </div>

      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col items-start gap-1">
          <h4 className="font-casta text-[1.75rem] font-light leading-none text-heading">
            {project.title}
          </h4>
          {(project.projectKind || project.duration) && (
            <p className="flex items-center gap-2 text-body">
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
                <span className="inline-flex items-center px-3.5 py-1.5 text-sm leading-none text-body">
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
