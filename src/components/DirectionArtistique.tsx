import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Bookmark02Icon,
  PaintBoardIcon,
  MoonCloudFastWindIcon,
  Message01Icon,
  BrowserIcon,
  ArrowDown05Icon,
  Cupcake01Icon,
  Idea01Icon,
  UserIcon,
  Target01Icon,
  Tick01Icon,
  ChevronRightIcon,
  File01Icon,
  Flag03Icon,
  Settings01Icon,
  Rocket01Icon,
  Camera01Icon,
} from "@hugeicons/core-free-icons";
import nayaLogo from "../assets/images/naya/logo-black.svg";
import nayaTypographySpecimen from "../assets/images/naya/typography-specimen.svg";
import hugeiconsLogo from "../assets/images/naya/hugeicons-logo.svg";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";
import { Squircle } from "./Squircle";

export interface DirectionArtistiqueProps {
  exiting?: boolean;
  exitDelay?: number;
}

const PALETTE = ["#fdf7f9", "#ff5a7d", "#0b0a0a"];

// Representative sample of the Hugeicons set used across the project —
// stands in for the full icon library preview. Exactly 18 (3 rows of 6).
const ICON_SAMPLE = [
  Home01Icon,
  Bookmark02Icon,
  PaintBoardIcon,
  MoonCloudFastWindIcon,
  Message01Icon,
  BrowserIcon,
  ArrowDown05Icon,
  Cupcake01Icon,
  Idea01Icon,
  UserIcon,
  Target01Icon,
  Tick01Icon,
  ChevronRightIcon,
  File01Icon,
  Flag03Icon,
  Settings01Icon,
  Rocket01Icon,
  Camera01Icon,
];

const ICONS_PER_ROW = 6;

const COLUMN_STAGGER = 0.1;
const ROW_STAGGER = 0.08;
const ICON_ITEM_STAGGER = 0.03;
const DURATION = 0.5;
const ICON_DURATION = 0.3;
const HUGEICONS_LOGO_DELAY = 0;
const ICONS_START_DELAY = HUGEICONS_LOGO_DELAY + 0.15;
const iconItemDelay = (index: number) => {
  const row = Math.floor(index / ICONS_PER_ROW);
  const col = index % ICONS_PER_ROW;
  return ICONS_START_DELAY + row * ROW_STAGGER + col * ICON_ITEM_STAGGER;
};

// If the last row doesn't fill every column, shift its first icon over so
// the row reads as centered instead of stuck to the left.
const LAST_ROW_COUNT = ICON_SAMPLE.length % ICONS_PER_ROW || ICONS_PER_ROW;
const LAST_ROW_START_INDEX = ICON_SAMPLE.length - LAST_ROW_COUNT;
const LAST_ROW_COL_OFFSET = Math.floor((ICONS_PER_ROW - LAST_ROW_COUNT) / 2);

// Each block gets its own scroll trigger (not one shared for the whole,
// often very tall, section) — otherwise a block far down the page (the
// icons) finishes its reveal before the user has even scrolled to see it,
// and just looks static/unanimated by the time it comes into view.
function useBlockReveal(exiting: boolean, exitDelay: number) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  function reveal(delay: number, duration = DURATION) {
    return {
      initial: { opacity: 0, y: 40 },
      animate: exiting
        ? { opacity: 0, y: -EXIT_DISTANCE }
        : isInView
          ? { opacity: 1, y: 0 }
          : undefined,
      transition: exiting
        ? ({ duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" } as const)
        : ({ duration, delay, ease: "easeOut" } as const),
    };
  }

  return { ref, reveal };
}

export function DirectionArtistique({
  exiting = false,
  exitDelay = 0,
}: DirectionArtistiqueProps) {
  const logo = useBlockReveal(exiting, exitDelay);
  const palette = useBlockReveal(exiting, exitDelay);
  const typography = useBlockReveal(exiting, exitDelay);
  const icons = useBlockReveal(exiting, exitDelay);

  return (
    <div className="flex flex-col gap-16 lg:flex-row lg:flex-wrap lg:items-center lg:justify-center">
      <motion.img
        ref={logo.ref}
        {...logo.reveal(0)}
        src={nayaLogo}
        alt="Logo Naya"
        className="mx-auto mt-4 h-auto w-[50vw] lg:mx-0 lg:w-48 lg:max-w-none lg:shrink-0"
      />

      <div ref={palette.ref} className="flex items-start gap-2 lg:w-48 lg:shrink-0">
        {PALETTE.map((hex, index) => (
          <motion.div
            key={hex}
            {...palette.reveal(index * COLUMN_STAGGER)}
            className="flex flex-1 flex-col gap-1.5"
          >
            <div className="aspect-[5/4] w-full drop-shadow-md">
              <Squircle
                cornerRadius={8}
                cornerSmoothing={1}
                fill={hex}
                borderWidth={0}
                className="h-full w-full"
              />
            </div>
            <span className="text-center text-xs font-medium text-body">
              {hex}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.img
        ref={typography.ref}
        {...typography.reveal(0)}
        src={nayaTypographySpecimen}
        alt="Spécimen typographique Massilia"
        className="h-auto w-full lg:w-72 lg:shrink-0"
      />

      <div ref={icons.ref} className="flex flex-col gap-4 lg:w-48 lg:shrink-0">
        <motion.img
          {...icons.reveal(HUGEICONS_LOGO_DELAY)}
          src={hugeiconsLogo}
          alt="Hugeicons"
          className="mx-auto h-auto w-[33vw] lg:h-6 lg:w-auto"
        />

        <div className="grid grid-cols-6 items-start gap-1">
          {ICON_SAMPLE.map((icon, index) => (
            <div
              key={index}
              style={
                index === LAST_ROW_START_INDEX && LAST_ROW_COL_OFFSET > 0
                  ? { gridColumnStart: LAST_ROW_COL_OFFSET + 1 }
                  : undefined
              }
              className="relative w-full"
            >
              {/* `aspect-square` proved unreliable on the actual background
                  box in this nested grid — padding-bottom percentage is
                  always relative to width, so this is a bulletproof square
                  regardless. */}
              <div className="pt-[100%]" />
              <motion.div
                {...icons.reveal(iconItemDelay(index), ICON_DURATION)}
                className="absolute inset-0 text-heading"
              >
                <Squircle
                  cornerRadius={6}
                  cornerSmoothing={1}
                  fill="#FCFCFC"
                  borderWidth={0}
                  className="h-full w-full"
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <HugeiconsIcon
                      icon={icon}
                      size={25}
                      className="lg:h-[18.75px] lg:w-[18.75px]"
                    />
                  </div>
                </Squircle>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
