import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AnimatedHeading } from "../components/AnimatedHeading";
import { Button } from "../components/Button";
import { ProjectCard } from "../components/ProjectCard";
import { RevealChars } from "../components/RevealChars";
import { RevealWords } from "../components/RevealWords";
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

const ABOUT_PARAGRAPHS = [
  "Je me définis comme un architecte d’interfaces. Je conçois des interfaces qui répondent aux problèmes des utilisateurs. Je ne m’arrête pas uniquement à la conception des écrans. Le design ne doit pas rester dans Figma, il doit vivre.",
  "Créer une expérience passe aussi par la conception de prototypes les plus réels possible. C’est pourquoi je vibe code mes propres prototypes pour que le handoff avec les développeurs soit le plus fluide possible.",
  "J’aime apprendre des autres, me mesurer à eux, le tout pour tirer tout le monde vers le haut. C’est ma façon de progresser.",
];

const ABOUT_WORD_STAGGER = 0.02;
const ABOUT_PARAGRAPH_GAP = 0.1;
const ABOUT_WORD_DURATION = 0.3;

// Each paragraph's delay starts only once the previous one's last word has
// finished revealing, so they read one at a time rather than all at once.
const ABOUT_PARAGRAPH_DELAYS: number[] = [];
{
  let nextDelay = 0;
  for (const text of ABOUT_PARAGRAPHS) {
    ABOUT_PARAGRAPH_DELAYS.push(nextDelay);
    nextDelay += text.split(" ").length * ABOUT_WORD_STAGGER + ABOUT_PARAGRAPH_GAP;
  }
}

export function Home() {
  const aboutTextRef = useRef(null);
  const isAboutTextInView = useInView(aboutTextRef, {
    once: true,
    amount: 0.3,
  });

  return (
    <main>
      <section className="flex min-h-screen flex-col justify-end gap-12 pb-[33vh] md:justify-center md:gap-8 md:px-6 md:pb-0">
        <div className="hidden md:flex md:flex-col md:items-start md:gap-8">
          <AnimatedHeading
            text="Studio Oni"
            as="h1"
            className="font-casta font-light leading-none text-[clamp(2.5rem,7vw,9rem)]"
          />
          <Button className="text-lg">Voir les projets</Button>
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
              text={HERO_PARAGRAPH_TEXT}
              trigger={true}
              delay={HERO_PARAGRAPH_DELAY}
              stagger={HERO_PARAGRAPH_STAGGER}
              duration={HERO_PARAGRAPH_WORD_DURATION}
              className="text-[16px] font-medium tracking-[-0.16px] text-body"
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
            >
              Me contacter
            </Button>
            <Button
              wrapperClassName="flex-1"
              className="w-full justify-center px-4 text-sm text-heading"
              charClassName="py-2"
              cornerRadius={8}
            >
              Voir mon CV
            </Button>
          </motion.div>
        </div>
      </section>

      <section
        id="projets"
        className="-mt-[156px] px-4 pt-0 pb-24 md:mt-0 md:px-6 md:py-24"
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

      <section id="about" className="px-4 py-24 md:px-6">
        <AnimatedHeading
          text="À propos"
          as="h2"
          stagger={0.05}
          duration={0.5}
          className="font-casta text-4xl font-light leading-none text-heading [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]"
        />
        <div
          ref={aboutTextRef}
          className="mt-6 flex max-w-3xl flex-col gap-6"
        >
          {ABOUT_PARAGRAPHS.map((text, index) => (
            <RevealWords
              key={index}
              text={text}
              trigger={isAboutTextInView}
              delay={ABOUT_PARAGRAPH_DELAYS[index]}
              stagger={ABOUT_WORD_STAGGER}
              duration={ABOUT_WORD_DURATION}
              className="text-lg text-body font-medium"
            />
          ))}
        </div>
      </section>

      <motion.section
        {...useScrollReveal({ delay: 0.4 })}
        className="px-4 py-24 md:px-6"
      >
        <h2 className="font-casta text-4xl font-light leading-none">Process</h2>
      </motion.section>
    </main>
  );
}
