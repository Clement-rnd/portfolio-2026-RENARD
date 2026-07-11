import { motion, useInView } from "framer-motion";
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
      <section className="flex min-h-screen flex-col justify-end gap-12 pb-[33vh] md:justify-center md:gap-8 md:px-6 md:pb-0">
        <div className="hidden md:flex md:max-w-2xl md:flex-col md:items-start md:gap-8">
          <div className="flex flex-col gap-4">
            <div className="font-satoshi text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-heading">
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
              className="px-5 text-base text-white"
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
              className="px-5 text-base text-heading"
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

        <div className="flex flex-col gap-12 md:hidden">
          <div className="flex flex-col gap-3 px-4 leading-[1.4]">
            <div className="font-satoshi text-[28px] font-bold tracking-[-0.28px] text-heading">
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
              className="text-lg font-medium tracking-[-0.16px] text-body"
            />
          </div>
          <motion.div
            {...useEntranceReveal({
              delay: HERO_BUTTONS_DELAY,
              duration: HERO_STEP_DURATION,
            })}
            className="flex gap-[10px] px-4"
          >
            <Button
              wrapperClassName="flex-1"
              className="w-full justify-center px-4 text-sm text-white"
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
              wrapperClassName="flex-1"
              className="w-full justify-center px-4 text-sm text-heading"
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
        className="-mt-[156px] px-4 pt-0 pb-12 md:mt-0 md:px-6 md:py-12"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
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
      </section>

      <section id="about" className="px-4 py-12 md:px-6">
        <div
          ref={aboutHeaderRef}
          className="flex items-center justify-between gap-4"
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
          className="mt-6 flex max-w-3xl flex-col gap-6"
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

      <section id="process" className="px-4 py-12 md:px-6">
        <AnimatedHeading
          text="Mon process"
          as="h2"
          stagger={ABOUT_TITLE_STAGGER}
          duration={ABOUT_TITLE_DURATION}
          className="font-casta text-4xl font-medium leading-none text-heading [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
        />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
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
