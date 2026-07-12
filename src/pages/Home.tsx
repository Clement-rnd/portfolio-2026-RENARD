import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { AnimatedHeading } from "../components/AnimatedHeading";
import { Button } from "../components/Button";
import { ProcessCard } from "../components/ProcessCard";
import { ProjectCard } from "../components/ProjectCard";
import { RevealChars } from "../components/RevealChars";
import { RevealWords } from "../components/RevealWords";
import { SegmentedControl } from "../components/SegmentedControl";
import type { AboutViewMode } from "../components/SegmentedControl";
import { processSteps } from "../data/process";
import { projects } from "../data/projects";
import { useEntranceReveal } from "../hooks/useEntranceReveal";
import { useScrollReveal } from "../hooks/useScrollReveal";
import {
  HERO_BUTTONS_DELAY,
  HERO_PARAGRAPH_DELAY,
  HERO_PARAGRAPH_STAGGER,
  HERO_PARAGRAPH_TEXT,
  HERO_PARAGRAPH_WORD_DURATION,
  HERO_PROJECTS_DELAY,
  HERO_STEP_DURATION,
  HERO_TITLE_CHAR_DURATION,
  HERO_TITLE_LINE_1,
  HERO_TITLE_LINE_2,
  HERO_TITLE_LINE_2_DELAY,
  HERO_TITLE_STAGGER,
} from "../lib/heroSequence";

// Each paragraph is a list of sentence-level segments. In "TL;DR" mode,
// `dimmed` segments fade out while the rest stay fully readable.
const ABOUT_SEGMENTS = [
  [
    { text: "Je me définis comme un architecte d’interfaces.", dimmed: true },
    {
      text: "Je conçois des interfaces qui répondent aux problèmes des utilisateurs. Je ne m’arrête pas uniquement à la conception des écrans.",
      dimmed: false,
    },
    {
      text: "Le design ne doit pas rester figé dans Figma, il doit vivre.",
      dimmed: true,
    },
  ],
  [
    {
      text: "Créer une expérience passe aussi par la conception de prototypes les plus réels possible.",
      dimmed: false,
    },
    {
      text: "C’est pourquoi je vibe code mes propres prototypes",
      dimmed: true,
    },
    {
      text: "pour que le handoff avec les développeurs soit le plus fluide possible.",
      dimmed: false,
    },
  ],
  [
    {
      text: "J’aime apprendre des autres, me mesurer à eux, le tout pour tirer tout le monde vers le haut. C’est ma façon de progresser.",
      dimmed: true,
    },
  ],
];

// Flatten each paragraph's segments into individual words, carrying each
// segment's `dimmed` flag onto every one of its words.
const ABOUT_PARAGRAPH_WORDS = ABOUT_SEGMENTS.map((segments) =>
  segments.flatMap((segment) =>
    segment.text.split(" ").map((text) => ({ text, dimmed: segment.dimmed })),
  ),
);

const ABOUT_WORD_STAGGER = 0.02;
const ABOUT_PARAGRAPH_GAP = 0.1;
const ABOUT_WORD_DURATION = 0.3;

// The Story/TL;DR toggle uses its own (shorter) rhythm: each word's fade
// finishes before the next one starts, so it reads as a crisp word-by-word
// ripple instead of the initial reveal's slower, more overlapped wave.
const ABOUT_TOGGLE_STAGGER = 0.025;
const ABOUT_TOGGLE_DURATION = 0.15;

const ABOUT_TITLE_TEXT = "À propos";
const ABOUT_TITLE_STAGGER = 0.05;
const ABOUT_TITLE_DURATION = 0.5;
const aboutTitleCharCount = ABOUT_TITLE_TEXT.split(" ").join("").length;

// The control appears once the title has fully finished its own reveal.
const ABOUT_CONTROL_DELAY =
  (aboutTitleCharCount - 1) * ABOUT_TITLE_STAGGER + ABOUT_TITLE_DURATION;

// Each paragraph's delay starts only once the previous one's last word has
// finished revealing, so they read one at a time rather than all at once.
const ABOUT_PARAGRAPH_DELAYS: number[] = [];
{
  let nextDelay = 0;
  for (const words of ABOUT_PARAGRAPH_WORDS) {
    ABOUT_PARAGRAPH_DELAYS.push(nextDelay);
    nextDelay += words.length * ABOUT_WORD_STAGGER + ABOUT_PARAGRAPH_GAP;
  }
}

// Story/TL;DR toggles ripple through every paragraph's dimmed words as one
// continuous top-to-bottom, left-to-right wave, so each paragraph's dimmed
// words pick up right after the previous paragraph's last dimmed word.
const ABOUT_TOGGLE_DELAYS: number[] = [];
{
  let dimmedWordCount = 0;
  for (const words of ABOUT_PARAGRAPH_WORDS) {
    ABOUT_TOGGLE_DELAYS.push(dimmedWordCount * ABOUT_TOGGLE_STAGGER);
    dimmedWordCount += words.filter((word) => word.dimmed).length;
  }
}

export function Home() {
  const projectsSectionRef = useRef(null);
  const { scrollYProgress: projectsScrollProgress } = useScroll({
    target: projectsSectionRef,
    offset: ["start end", "end start"],
  });
  // The left column (odd project index) and right column (even project
  // index) drift in opposite directions as you scroll, so they shift out of
  // sync instead of scrolling as a flat grid.
  const projectsColumnAY = useTransform(projectsScrollProgress, [0, 1], [120, -120]);
  const projectsColumnBY = useTransform(projectsScrollProgress, [0, 1], [-120, 120]);

  // Reading order goes by vertical position (topmost first), not left/right
  // column: Naya > ACPR > Design System OS > Voyage. "Area-2" and "Area" sit
  // at the top of the grid (visible on load), "Area-4" and "Area-3" sit
  // lower (revealed on scroll). Desktop additionally shifts "Area-3"/"Area-4"
  // one column to the right of their column-mate.
  const PROJECT_GRID_AREAS = ["Area-2", "Area", "Area-4", "Area-3"];

  const aboutTextRef = useRef(null);
  const isAboutTextInView = useInView(aboutTextRef, {
    once: true,
    amount: 0.3,
  });
  const [aboutMode, setAboutMode] = useState<AboutViewMode>("story");
  const aboutHeaderRef = useRef(null);
  const isAboutHeaderInView = useInView(aboutHeaderRef, {
    once: true,
    amount: 0.5,
  });

  return (
    <main>
      <section className="mx-auto flex min-h-screen max-w-[96rem] flex-col justify-end gap-12 px-4 pb-[33vh] md:px-6 lg:justify-center lg:gap-8 lg:pb-0">
        <div className="hidden lg:flex lg:max-w-2xl lg:flex-col lg:items-start lg:gap-8">
          <div className="flex flex-col gap-4">
            <div className="font-casta text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.1] text-heading">
              <RevealChars
                text={HERO_TITLE_LINE_1}
                trigger={true}
                delay={0}
                stagger={HERO_TITLE_STAGGER}
                duration={HERO_TITLE_CHAR_DURATION}
              />
              <br />
              <RevealChars
                text={HERO_TITLE_LINE_2}
                trigger={true}
                delay={HERO_TITLE_LINE_2_DELAY}
                stagger={HERO_TITLE_STAGGER}
                duration={HERO_TITLE_CHAR_DURATION}
              />
            </div>
            <RevealWords
              words={HERO_PARAGRAPH_TEXT}
              trigger={true}
              delay={HERO_PARAGRAPH_DELAY}
              stagger={HERO_PARAGRAPH_STAGGER}
              duration={HERO_PARAGRAPH_WORD_DURATION}
              className="text-xl font-medium tracking-[-0.16px] text-body"
            />
          </div>
          <motion.div
            {...useEntranceReveal({
              delay: HERO_BUTTONS_DELAY,
              duration: HERO_STEP_DURATION,
            })}
            className="flex gap-[10px]"
          >
            <Button
              className="px-5 text-lg text-white"
              charClassName="py-2"
              fill="var(--color-heading)"
              cornerRadius={8}
              onClick={() => {
                window.location.href = "mailto:clement_rnd@hotmail.com";
              }}
            >
              Me contacter
            </Button>
            <Button
              className="px-5 text-lg text-heading"
              charClassName="py-2"
              cornerRadius={8}
              onClick={() => {
                window.open("/cv-renard.pdf", "_blank", "noopener,noreferrer");
              }}
            >
              Voir mon CV
            </Button>
          </motion.div>
        </div>

        <div className="flex flex-col gap-12 lg:hidden">
          <div className="flex flex-col gap-3 leading-[1.4]">
            <div className="font-casta text-[28px] font-medium text-heading">
              <RevealChars
                text={HERO_TITLE_LINE_1}
                trigger={true}
                delay={0}
                stagger={HERO_TITLE_STAGGER}
                duration={HERO_TITLE_CHAR_DURATION}
              />
              <br />
              <RevealChars
                text={HERO_TITLE_LINE_2}
                trigger={true}
                delay={HERO_TITLE_LINE_2_DELAY}
                stagger={HERO_TITLE_STAGGER}
                duration={HERO_TITLE_CHAR_DURATION}
              />
            </div>
            <RevealWords
              words={HERO_PARAGRAPH_TEXT}
              trigger={true}
              delay={HERO_PARAGRAPH_DELAY}
              stagger={HERO_PARAGRAPH_STAGGER}
              duration={HERO_PARAGRAPH_WORD_DURATION}
              className="max-w-[25rem] text-lg font-medium tracking-[-0.16px] text-body md:max-w-[40rem]"
            />
          </div>
          <motion.div
            {...useEntranceReveal({
              delay: HERO_BUTTONS_DELAY,
              duration: HERO_STEP_DURATION,
            })}
            className="flex gap-[10px]"
          >
            <Button
              wrapperClassName="flex-1 md:flex-none"
              className="w-full justify-center px-4 text-base text-white md:w-auto"
              charClassName="py-2"
              fill="var(--color-heading)"
              cornerRadius={8}
              onClick={() => {
                window.location.href = "mailto:clement_rnd@hotmail.com";
              }}
            >
              Me contacter
            </Button>
            <Button
              wrapperClassName="flex-1 md:flex-none"
              className="w-full justify-center px-4 text-base text-heading md:w-auto"
              charClassName="py-2"
              cornerRadius={8}
              onClick={() => {
                window.open("/cv-renard.pdf", "_blank", "noopener,noreferrer");
              }}
            >
              Voir mon CV
            </Button>
          </motion.div>
        </div>
      </section>

      <section
        id="projets"
        ref={projectsSectionRef}
        className="mx-auto -mt-[156px] max-w-[96rem] px-4 pt-0 pb-12 md:-mt-16 md:px-6 md:pb-24"
      >
        {/* Mobile: single stacked column. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:hidden">
          {projects.map((project, index) =>
            index === 0 ? (
              <motion.div
                key={project.slug}
                {...useEntranceReveal({
                  delay: HERO_PROJECTS_DELAY,
                  duration: HERO_STEP_DURATION,
                })}
              >
                <ProjectCard project={project} />
              </motion.div>
            ) : (
              <motion.div
                key={project.slug}
                {...useScrollReveal({ y: 60, duration: 0.6, amount: 0.5 })}
              >
                <ProjectCard project={project} />
              </motion.div>
            ),
          )}
        </div>

        {/* Tablet: 2 columns, each pair offset vertically only (no
            horizontal shift), matching the reference design's 768-1023px
            grid-template-areas. */}
        <div
          className="hidden md:grid md:gap-[1.6rem] lg:hidden"
          style={{
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateAreas: `
              ". . . . Area-2 Area-2 Area-2 Area-2"
              "Area Area Area Area Area-2 Area-2 Area-2 Area-2"
              "Area Area Area Area Area-2 Area-2 Area-2 Area-2"
              "Area Area Area Area Area-2 Area-2 Area-2 Area-2"
              "Area Area Area Area Area-2 Area-2 Area-2 Area-2"
              "Area Area Area Area . . . ."
              ". . . . Area-4 Area-4 Area-4 Area-4"
              "Area-3 Area-3 Area-3 Area-3 Area-4 Area-4 Area-4 Area-4"
              "Area-3 Area-3 Area-3 Area-3 Area-4 Area-4 Area-4 Area-4"
              "Area-3 Area-3 Area-3 Area-3 Area-4 Area-4 Area-4 Area-4"
              "Area-3 Area-3 Area-3 Area-3 Area-4 Area-4 Area-4 Area-4"
              "Area-3 Area-3 Area-3 Area-3 . . . ."
            `,
          }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              style={{
                gridArea: PROJECT_GRID_AREAS[index],
                y: index % 2 === 1 ? projectsColumnAY : projectsColumnBY,
              }}
            >
              {index < 2 ? (
                <motion.div
                  {...useEntranceReveal({
                    delay: HERO_PROJECTS_DELAY,
                    duration: HERO_STEP_DURATION,
                  })}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ) : (
                <motion.div
                  {...useScrollReveal({ y: 60, duration: 0.6, amount: 0.5 })}
                >
                  <ProjectCard project={project} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Desktop: same 2 columns, but the lower card in each column also
            shifts one grid column to the right of its column-mate. */}
        <div
          className="hidden lg:grid lg:gap-[1rem]"
          style={{
            gridTemplateColumns: "repeat(10, 1fr)",
            gridTemplateAreas: `
              ". . . . . Area-2 Area-2 Area-2 Area-2 ."
              "Area Area Area Area . Area-2 Area-2 Area-2 Area-2 ."
              "Area Area Area Area . Area-2 Area-2 Area-2 Area-2 ."
              "Area Area Area Area . Area-2 Area-2 Area-2 Area-2 ."
              "Area Area Area Area . Area-2 Area-2 Area-2 Area-2 ."
              "Area Area Area Area . . . . . ."
              ". . . . . . Area-4 Area-4 Area-4 Area-4"
              ". Area-3 Area-3 Area-3 Area-3 . Area-4 Area-4 Area-4 Area-4"
              ". Area-3 Area-3 Area-3 Area-3 . Area-4 Area-4 Area-4 Area-4"
              ". Area-3 Area-3 Area-3 Area-3 . Area-4 Area-4 Area-4 Area-4"
              ". Area-3 Area-3 Area-3 Area-3 . Area-4 Area-4 Area-4 Area-4"
              ". Area-3 Area-3 Area-3 Area-3 . . . . ."
            `,
          }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              style={{
                gridArea: PROJECT_GRID_AREAS[index],
                y: index % 2 === 1 ? projectsColumnAY : projectsColumnBY,
              }}
            >
              {index < 2 ? (
                <motion.div
                  {...useEntranceReveal({
                    delay: HERO_PROJECTS_DELAY,
                    duration: HERO_STEP_DURATION,
                  })}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ) : (
                <motion.div
                  {...useScrollReveal({ y: 60, duration: 0.6, amount: 0.5 })}
                >
                  <ProjectCard project={project} />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-[96rem] px-4 py-12 md:px-6 md:py-24"
      >
        <div
          ref={aboutHeaderRef}
          className="flex max-w-3xl items-center justify-between gap-4 md:max-w-none lg:max-w-3xl"
        >
          <AnimatedHeading
            text={ABOUT_TITLE_TEXT}
            as="h2"
            stagger={ABOUT_TITLE_STAGGER}
            duration={ABOUT_TITLE_DURATION}
            className="font-casta text-4xl font-medium leading-none text-heading [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={
              isAboutHeaderInView ? { opacity: 1, y: 0 } : undefined
            }
            transition={{
              duration: 0.4,
              delay: ABOUT_CONTROL_DELAY,
              ease: "easeOut",
            }}
          >
            <SegmentedControl value={aboutMode} onChange={setAboutMode} />
          </motion.div>
        </div>
        <div
          ref={aboutTextRef}
          className="mt-6 flex max-w-3xl flex-col gap-6 md:max-w-none lg:max-w-3xl"
        >
          {ABOUT_PARAGRAPH_WORDS.map((words, index) => (
            <RevealWords
              key={index}
              words={words}
              trigger={isAboutTextInView}
              dimEnabled={aboutMode === "tldr"}
              delay={ABOUT_PARAGRAPH_DELAYS[index]}
              stagger={ABOUT_WORD_STAGGER}
              duration={ABOUT_WORD_DURATION}
              toggleDelay={ABOUT_TOGGLE_DELAYS[index]}
              toggleStagger={ABOUT_TOGGLE_STAGGER}
              toggleDuration={ABOUT_TOGGLE_DURATION}
              className="text-lg text-body font-medium"
            />
          ))}
        </div>
      </section>

      <section
        id="process"
        className="mx-auto max-w-[96rem] px-4 py-12 md:px-6 md:py-24"
      >
        <AnimatedHeading
          text="Mon process"
          as="h2"
          stagger={ABOUT_TITLE_STAGGER}
          duration={ABOUT_TITLE_DURATION}
          className="font-casta text-4xl font-medium leading-none text-heading [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
        />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.number}
              {...useScrollReveal({
                y: 40,
                duration: 0.5,
                delay: index * 0.1,
                amount: 0.3,
              })}
            >
              <ProcessCard step={step} />
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
