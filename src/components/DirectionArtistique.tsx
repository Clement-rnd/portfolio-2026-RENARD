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

interface Shade {
  label: string;
  hex: string | null;
}

interface Hue {
  name: string;
  shades: Shade[];
}

// Only shades whose real value was confirmed are filled in — the rest are
// left as empty blocks rather than guessed.
const PALETTE: Hue[] = [
  {
    name: "Corail",
    shades: [
      { label: "50", hex: "#fdf7f9" },
      { label: "100", hex: "#fcf7f9" },
      { label: "200", hex: "#fceef1" },
      { label: "300", hex: "#ffe1e6" },
      { label: "400", hex: "#ff8fa7" },
      { label: "500", hex: "#ff5a7d" },
      { label: "600", hex: "#f6486d" },
      { label: "700", hex: "#da3b5d" },
      { label: "800", hex: "#cb3152" },
      { label: "900", hex: null },
      { label: "950", hex: null },
    ],
  },
  {
    name: "Stone",
    shades: [
      { label: "50", hex: "#fcfcfc" },
      { label: "100", hex: "#f7f7f7" },
      { label: "200", hex: "#f5f5f5" },
      { label: "300", hex: "#ededed" },
      { label: "400", hex: "#e8e8e8" },
      { label: "500", hex: "#dcdcdc" },
      { label: "600", hex: "#b2b2b2" },
      { label: "700", hex: "#717171" },
      { label: "800", hex: "#cccccc" },
      { label: "900", hex: "#181818" },
      { label: "950", hex: "#0b0a0a" },
    ],
  },
  {
    name: "Blue",
    shades: [
      { label: "50", hex: "#f6f7fe" },
      { label: "100", hex: "#edeefd" },
      { label: "200", hex: "#e5e8fa" },
      { label: "300", hex: "#e0e4ff" },
      { label: "400", hex: "#8e9af6" },
      { label: "500", hex: "#5d6fe9" },
      { label: "600", hex: "#7181ef" },
      { label: "700", hex: null },
      { label: "800", hex: "#39438d" },
      { label: "900", hex: null },
      { label: "950", hex: null },
    ],
  },
  {
    name: "Emerald",
    shades: [
      { label: "50", hex: "#ecfdf9" },
      { label: "100", hex: "#e9fcf8" },
      { label: "200", hex: "#e5faf5" },
      { label: "300", hex: null },
      { label: "400", hex: null },
      { label: "500", hex: "#30c09c" },
      { label: "600", hex: null },
      { label: "700", hex: null },
      { label: "800", hex: "#1d745f" },
      { label: "900", hex: null },
      { label: "950", hex: null },
    ],
  },
  {
    name: "Orange",
    shades: [
      { label: "50", hex: "#fffbe6" },
      { label: "100", hex: "#fff6e0" },
      { label: "200", hex: "#fceee3" },
      { label: "300", hex: null },
      { label: "400", hex: "#faad14" },
      { label: "500", hex: "#ea863e" },
      { label: "600", hex: null },
      { label: "700", hex: null },
      { label: "800", hex: null },
      { label: "900", hex: null },
      { label: "950", hex: null },
    ],
  },
  {
    name: "Scarlet",
    shades: [
      { label: "50", hex: "#fff1f2" },
      { label: "100", hex: "#ffe4e6" },
      { label: "200", hex: "#fee1e5" },
      { label: "300", hex: null },
      { label: "400", hex: "#fb7185" },
      { label: "500", hex: "#f43f5e" },
      { label: "600", hex: "#e11d48" },
      { label: "700", hex: "#be123c" },
      { label: "800", hex: "#9f1239" },
      { label: "900", hex: "#881337" },
      { label: "950", hex: "#4c0519" },
    ],
  },
];

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
        className="mx-auto h-auto w-full max-w-[14rem]"
      />

      <div
        ref={palette.ref}
        className="grid grid-cols-3 gap-x-4 gap-y-8"
      >
        {PALETTE.map((hue, columnIndex) => (
          <motion.div
            key={hue.name}
            {...palette.reveal(columnIndex * COLUMN_STAGGER)}
            className="flex w-full flex-col items-start gap-3"
          >
            <h4 className="font-casta text-lg font-medium text-heading">
              {hue.name}
            </h4>
            <div className="flex w-full flex-col gap-1.5">
              {hue.shades.map((shade) => (
                <div key={shade.label} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-xs font-medium text-body">
                    {shade.label}
                  </span>
                  {shade.hex ? (
                    <span
                      className="h-4 w-10 shrink-0 rounded-md"
                      style={{ backgroundColor: shade.hex }}
                    />
                  ) : (
                    <span className="h-4 w-10 shrink-0 rounded-md border border-dashed border-neutral-200" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
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
