import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Idea01Icon,
  Target01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { AnimatedHeading } from "../components/AnimatedHeading";
import { DesignSystemSegmentedControl } from "../components/DesignSystemSegmentedControl";
import type { DesignSystemView } from "../components/DesignSystemSegmentedControl";
import { DesignTokenFlow } from "../components/DesignTokenFlow";
import { FigmaFileTree } from "../components/FigmaFileTree";
import { DirectionArtistique } from "../components/DirectionArtistique";
import { PersonaBubble } from "../components/PersonaBubble";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectIntroCard } from "../components/ProjectIntroCard";
import { RevealChars } from "../components/RevealChars";
import { RevealWords } from "../components/RevealWords";
import { ScreensCarousel } from "../components/ScreensCarousel";
import { SitemapTree } from "../components/SitemapTree";
import { Squircle } from "../components/Squircle";
import { TargetUserCarousel } from "../components/TargetUserCarousel";
import { projects } from "../data/projects";
import { useEntranceReveal } from "../hooks/useEntranceReveal";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { usePageTransition } from "../lib/PageTransitionContext";
import {
  EXIT_DISTANCE,
  EXIT_DURATION,
  EXIT_SECTION_STAGGER,
} from "../lib/exitTransition";
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
const animatedSectionTitleClassName = `${sectionTitleClassName} leading-none [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]`;
const SECTION_TITLE_STAGGER = 0.05;
const SECTION_TITLE_DURATION = 0.5;
const overviewLabelClassName = "text-sm font-medium text-body";
const overviewValueClassName = "text-lg font-medium text-heading";
const SPECS_LINE_STAGGER = 0.08;

// Placeholder lorem ipsum, reused until real persona quotes are provided.
const PERSONA_BUBBLES: { text: string; align: "left" | "right" }[] = [
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    align: "left",
  },
  {
    text: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    align: "right",
  },
  {
    text: "Ut enim ad minim veniam, quis nostrud exercitation.",
    align: "left",
  },
];

export function ProjectPage() {
  const { isExiting } = usePageTransition();
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const [designSystemView, setDesignSystemView] =
    useState<DesignSystemView>("design-system");

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
  const COVER_EXIT_DELAY = EXIT_SECTION_STAGGER;
  const SPECS_EXIT_DELAY = EXIT_SECTION_STAGGER * 2;
  const TIMELINE_EXIT_DELAY = EXIT_SECTION_STAGGER * 3;
  const INTRO_EXIT_DELAY = EXIT_SECTION_STAGGER * 4;
  const PERSONAS_EXIT_DELAY = EXIT_SECTION_STAGGER * 5;
  const TARGET_USER_PERSONAS_EXIT_DELAY = EXIT_SECTION_STAGGER * 6;
  const TARGET_USERS_EXIT_DELAY = EXIT_SECTION_STAGGER * 7;
  const DA_EXIT_DELAY = EXIT_SECTION_STAGGER * 8;
  const DA_CARD_EXIT_DELAY = EXIT_SECTION_STAGGER * 9;
  const SITEMAP_EXIT_DELAY = EXIT_SECTION_STAGGER * 10;
  const SCREENS_EXIT_DELAY = EXIT_SECTION_STAGGER * 11;
  const DESIGN_SYSTEM_EXIT_DELAY = EXIT_SECTION_STAGGER * 12;
  const targetUsersRef = useRef(null);
  const isTargetUsersInView = useInView(targetUsersRef, {
    once: true,
    amount: 0.2,
  });
  const daTextRef = useRef(null);
  const isDaTextInView = useInView(daTextRef, { once: true, amount: 0.2 });
  const isDesktop = useIsDesktop();
  const introRef = useRef(null);
  const isIntroInView = useInView(introRef, {
    once: true,
    margin: "0px 0px -20% 0px",
  });
  const bubblesRef = useRef(null);
  const isBubblesInView = useInView(bubblesRef, { once: true, amount: 0.2 });
  // Desktop: cards and bubbles sit side by side, so they share one trigger
  // and start together. Mobile: bubbles are stacked far below the cards, so
  // sharing the cards' trigger would "complete" their reveal off-screen
  // before the user ever scrolls to see it — they need their own trigger.
  const isBubblesRevealInView = isDesktop ? isIntroInView : isBubblesInView;
  const introReveal = (delay: number, exitDelay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: isExiting
      ? { opacity: 0, y: -EXIT_DISTANCE }
      : isIntroInView
        ? { opacity: 1, y: 0 }
        : undefined,
    transition: isExiting
      ? ({ duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" } as const)
      : ({ duration: 0.5, delay, ease: "easeOut" } as const),
  });
  const bubbleReveal = (delay: number, exitDelay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: isExiting
      ? { opacity: 0, y: -EXIT_DISTANCE }
      : isBubblesRevealInView
        ? { opacity: 1, y: 0 }
        : undefined,
    transition: isExiting
      ? ({ duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" } as const)
      : ({ duration: 0.5, delay, ease: "easeOut" } as const),
  });
  const specsRevealProps = (index: number) =>
    useScrollReveal({
      y: 16,
      duration: 0.4,
      delay: index * SPECS_LINE_STAGGER,
      amount: 0.2,
      exiting: isExiting,
      exitDelay: SPECS_EXIT_DELAY,
    });

  return (
    <main className="mx-auto max-w-[96rem] px-4 md:px-6">
      <section className="flex min-h-screen -translate-y-8 flex-col items-center justify-center gap-4 text-center">
        <RevealChars
          text={project.title}
          trigger={true}
          exiting={isExiting}
          delay={titleDelay}
          stagger={PROJECT_TITLE_STAGGER}
          duration={PROJECT_TITLE_CHAR_DURATION}
          className="text-[1.25rem] font-medium uppercase tracking-widest text-body"
        />
        <h1 className="max-w-[56rem] font-casta font-medium leading-tight text-[3rem] text-heading lg:text-[clamp(3rem,6vw,7rem)]">
          <RevealChars
            text={baselineText}
            trigger={true}
            exiting={isExiting}
            delay={baselineDelay}
            stagger={PROJECT_BASELINE_STAGGER}
            duration={PROJECT_BASELINE_CHAR_DURATION}
          />
        </h1>
      </section>

      <section className="-mt-[232px] pb-12 md:-mt-48">
        <motion.div
          {...useEntranceReveal({
            exiting: isExiting,
            exitDelay: COVER_EXIT_DELAY,
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

      <section className="flex flex-col gap-6 py-12">
        <motion.hr
          {...specsRevealProps(0)}
          className="hidden border-neutral-200 md:block"
        />
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {project.overviewType && (
            <motion.div {...specsRevealProps(1)} className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Type</h6>
              <p className={overviewValueClassName}>{project.overviewType}</p>
            </motion.div>
          )}
          {project.meta && project.meta.roles.length > 0 && (
            <motion.div {...specsRevealProps(2)} className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Rôle</h6>
              <p className={overviewValueClassName}>
                {project.meta.roles.join(", ")}
              </p>
            </motion.div>
          )}
          {project.tags.length > 0 && (
            <motion.div {...specsRevealProps(3)} className="flex flex-col gap-2">
              <h6 className={overviewLabelClassName}>Compétences</h6>
              <div className="flex flex-col gap-2">
                {project.tags.map((tag, index) => (
                  <motion.p
                    key={tag}
                    {...specsRevealProps(4 + index)}
                    className={overviewValueClassName}
                  >
                    {tag}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
          {project.status && (
            <motion.div
              {...specsRevealProps(4 + project.tags.length)}
              className="flex flex-col gap-2"
            >
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
            </motion.div>
          )}
        </div>
      </section>

      {project.processSteps && project.processSteps.length > 0 && (
        <section className="flex flex-col gap-6 py-12">
          <AnimatedHeading
            text="Process"
            as="h2"
            stagger={SECTION_TITLE_STAGGER}
            duration={SECTION_TITLE_DURATION}
            exiting={isExiting}
            exitDelay={TIMELINE_EXIT_DELAY}
            className={animatedSectionTitleClassName}
          />
          <ProcessTimeline
            steps={project.processSteps}
            exiting={isExiting}
            exitDelay={TIMELINE_EXIT_DELAY}
          />
        </section>
      )}

      {project.intro && (
        <section className="flex flex-col gap-6 py-12">
          <AnimatedHeading
            text="Introduction"
            as="h2"
            stagger={SECTION_TITLE_STAGGER}
            duration={SECTION_TITLE_DURATION}
            exiting={isExiting}
            exitDelay={INTRO_EXIT_DELAY}
            className={animatedSectionTitleClassName}
          />
          <div
            ref={introRef}
            className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-6"
          >
            <div className="flex flex-col gap-6">
              <motion.div {...introReveal(0, INTRO_EXIT_DELAY)}>
                <ProjectIntroCard
                  icon={Target01Icon}
                  title={project.intro.project.title}
                  description={project.intro.project.description}
                />
              </motion.div>
              <motion.div {...introReveal(0.2, INTRO_EXIT_DELAY)}>
                <ProjectIntroCard
                  icon={Idea01Icon}
                  title={project.intro.context.title}
                  description={project.intro.context.description}
                />
              </motion.div>
            </div>
            <div ref={bubblesRef} className="flex flex-col gap-10">
              {PERSONA_BUBBLES.map((persona, index) => (
                <motion.div
                  key={index}
                  {...bubbleReveal(index * 0.25, PERSONAS_EXIT_DELAY)}
                  className={`flex ${persona.align === "right" ? "justify-end" : "justify-start"}`}
                >
                  <PersonaBubble
                    icon={UserIcon}
                    text={persona.text}
                    align={persona.align}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.targetUserPersonas && project.targetUserPersonas.length > 0 && (
        <section className="flex flex-col gap-6 py-12">
          <AnimatedHeading
            text="Utilisateurs cibles"
            as="h2"
            stagger={SECTION_TITLE_STAGGER}
            duration={SECTION_TITLE_DURATION}
            exiting={isExiting}
            exitDelay={TARGET_USER_PERSONAS_EXIT_DELAY}
            className={animatedSectionTitleClassName}
          />
          <TargetUserCarousel
            personas={project.targetUserPersonas}
            exiting={isExiting}
            exitDelay={TARGET_USER_PERSONAS_EXIT_DELAY}
          />
        </section>
      )}

      {project.targetUsers && (
        <section className="flex h-[66vh] flex-col items-center justify-center py-12 text-center">
          <p
            ref={targetUsersRef}
            className="max-w-[64rem] font-casta text-[2rem] font-medium leading-snug text-heading md:text-[3rem]"
          >
            <RevealChars
              text={project.targetUsers}
              trigger={isTargetUsersInView}
              exiting={isExiting}
              exitDelay={TARGET_USERS_EXIT_DELAY}
              stagger={PROJECT_BASELINE_STAGGER}
              duration={PROJECT_BASELINE_CHAR_DURATION}
            />
          </p>
        </section>
      )}

      {project.hasDirectionArtistique && (
        <section className="flex flex-col gap-6 py-12">
          <AnimatedHeading
            text="Direction artistique"
            as="h2"
            stagger={SECTION_TITLE_STAGGER}
            duration={SECTION_TITLE_DURATION}
            exiting={isExiting}
            exitDelay={DA_EXIT_DELAY}
            className={animatedSectionTitleClassName}
          />
          <p ref={daTextRef} className="max-w-2xl text-lg font-medium text-body">
            <RevealWords
              words={project.directionArtistiqueText ?? ""}
              trigger={isDaTextInView}
              exiting={isExiting}
              exitDelay={DA_CARD_EXIT_DELAY}
              stagger={0.02}
              duration={0.4}
            />
          </p>
          <DirectionArtistique exiting={isExiting} exitDelay={DA_EXIT_DELAY} />
        </section>
      )}

      {project.sitemap && project.sitemap.length > 0 && (
        <section className="flex flex-col gap-6 py-12">
          <AnimatedHeading
            text="Conception"
            as="h2"
            stagger={SECTION_TITLE_STAGGER}
            duration={SECTION_TITLE_DURATION}
            exiting={isExiting}
            exitDelay={SITEMAP_EXIT_DELAY}
            className={animatedSectionTitleClassName}
          />
          <SitemapTree categories={project.sitemap} />
        </section>
      )}

      {project.screens && project.screens.length > 0 && (
        <section className="flex flex-col gap-6 py-12">
          <ScreensCarousel
            screens={project.screens.map((screen) => screen.image)}
            exiting={isExiting}
            exitDelay={SCREENS_EXIT_DELAY}
          />
        </section>
      )}

      {project.designSystemSection && (
        <section className="flex flex-col gap-6 py-12">
          <AnimatedHeading
            text={project.designSystemSection.title}
            as="h2"
            stagger={SECTION_TITLE_STAGGER}
            duration={SECTION_TITLE_DURATION}
            exiting={isExiting}
            exitDelay={DESIGN_SYSTEM_EXIT_DELAY}
            className={animatedSectionTitleClassName}
          />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-6">
            <motion.p
              {...useScrollReveal({
                y: 40,
                duration: 0.5,
                amount: 0.3,
                exiting: isExiting,
                exitDelay: DESIGN_SYSTEM_EXIT_DELAY,
              })}
              className="max-w-2xl text-lg font-medium text-body"
            >
              {project.designSystemSection.description}
            </motion.p>
            <motion.div
              {...useScrollReveal({
                y: 40,
                duration: 0.5,
                delay: 0.05,
                amount: 0.2,
                exiting: isExiting,
                exitDelay: DESIGN_SYSTEM_EXIT_DELAY,
              })}
            >
              <FigmaFileTree />
            </motion.div>
          </div>
          <motion.div
            {...useScrollReveal({
              y: 40,
              duration: 0.5,
              delay: 0.1,
              amount: 0.3,
              exiting: isExiting,
              exitDelay: DESIGN_SYSTEM_EXIT_DELAY,
            })}
            className="mt-12 md:flex md:justify-center"
          >
            <DesignSystemSegmentedControl
              value={designSystemView}
              onChange={setDesignSystemView}
            />
          </motion.div>
          {project.designTokenFlow && (
            <motion.div
              {...useScrollReveal({
                y: 40,
                duration: 0.5,
                delay: 0.1,
                amount: 0.2,
                exiting: isExiting,
                exitDelay: DESIGN_SYSTEM_EXIT_DELAY,
              })}
            >
              <DesignTokenFlow flow={project.designTokenFlow} />
            </motion.div>
          )}
        </section>
      )}

      {project.keyDecisions && project.keyDecisions.length > 0 && (
        <section className="flex flex-col gap-4 py-12">
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

      <section className="flex flex-col gap-6 py-12">
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
