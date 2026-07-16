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
} from "@hugeicons/core-free-icons";
import nayaLogo from "../assets/images/naya/logo-black.svg";
import nayaTypographySpecimen from "../assets/images/naya/typography-specimen.svg";
import hugeiconsLogo from "../assets/images/naya/hugeicons-logo.svg";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface DirectionArtistiqueProps {
  exiting?: boolean;
  exitDelay?: number;
}

const PALETTE = ["#fdf7f9", "#ff5a7d", "#0b0a0a"];

// Representative sample of the Hugeicons set used across the project —
// stands in for the full icon library preview. Exactly 15 (3 rows of 5).
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
];

const ICONS_PER_ROW = 5;

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
    <div className="flex flex-col gap-16">
      <motion.img
        ref={logo.ref}
        {...logo.reveal(0)}
        src={nayaLogo}
        alt="Logo Naya"
        className="mx-auto mt-4 h-auto w-full max-w-[14rem]"
      />

      <div ref={palette.ref} className="flex justify-center gap-2">
        {PALETTE.map((hex, index) => (
          <motion.span
            key={hex}
            {...palette.reveal(index * COLUMN_STAGGER)}
            className="h-10 w-[60px] shrink-0 rounded-lg drop-shadow-md"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      <motion.img
        ref={typography.ref}
        {...typography.reveal(0)}
        src={nayaTypographySpecimen}
        alt="Spécimen typographique Massilia"
        className="mx-auto h-auto w-full max-w-xl"
      />

      <div ref={icons.ref} className="flex flex-col gap-4">
        <motion.img
          {...icons.reveal(HUGEICONS_LOGO_DELAY)}
          src={hugeiconsLogo}
          alt="Hugeicons"
          className="mx-auto h-6 w-auto"
        />

        <div className="grid w-full grid-cols-5 gap-2">
          {ICON_SAMPLE.map((icon, index) => (
            <motion.div
              key={index}
              {...icons.reveal(iconItemDelay(index), ICON_DURATION)}
              className="flex aspect-square items-center justify-center rounded-lg bg-[#FCFCFC] text-heading"
            >
              <HugeiconsIcon icon={icon} size={32} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
