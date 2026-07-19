import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Home01Icon,
  Bookmark02Icon,
  PaintBoardIcon,
  MoonCloudFastWindIcon,
  Message01Icon,
  BrowserIcon,
  Idea01Icon,
  UserIcon,
  Target01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import logoFacebook from "../assets/images/naya/logos/facebook.svg";
import logoInstagram from "../assets/images/naya/logos/instagram.svg";
import logoGoogle from "../assets/images/naya/logos/google.svg";
import logoWhatsapp from "../assets/images/naya/logos/whatsapp.svg";
import logoSpotify from "../assets/images/naya/logos/spotify.svg";
import logoYoutube from "../assets/images/naya/logos/youtube.svg";
import logoTiktok from "../assets/images/naya/logos/tiktok.svg";
import logoLinkedin from "../assets/images/naya/logos/linkedin.svg";
import logoX from "../assets/images/naya/logos/x.svg";
import logoApple from "../assets/images/naya/logos/apple.svg";
import flagFr from "../assets/images/naya/flags/fr.svg";
import flagGb from "../assets/images/naya/flags/gb.svg";
import flagEs from "../assets/images/naya/flags/es.svg";
import flagDe from "../assets/images/naya/flags/de.svg";
import flagIt from "../assets/images/naya/flags/it.svg";
import flagPt from "../assets/images/naya/flags/pt.svg";
import flagNo from "../assets/images/naya/flags/no.svg";
import flagAt from "../assets/images/naya/flags/at.svg";
import flagHr from "../assets/images/naya/flags/hr.svg";
import flagCh from "../assets/images/naya/flags/ch.svg";
import dog1 from "../assets/images/naya/animals/dog1.jpg";
import dog2 from "../assets/images/naya/animals/dog2.jpg";
import dog3 from "../assets/images/naya/animals/dog3.jpg";
import cat1 from "../assets/images/naya/animals/cat1.jpg";
import cat2 from "../assets/images/naya/animals/cat2.jpg";
import cat3 from "../assets/images/naya/animals/cat3.jpg";
import avatar1 from "../assets/images/naya/avatars/avatar-1.jpg";
import avatar2 from "../assets/images/naya/avatars/avatar-2.jpg";
import avatar3 from "../assets/images/naya/avatars/avatar-3.jpg";
import avatar4 from "../assets/images/naya/avatars/avatar-4.jpg";
import { Squircle } from "./Squircle";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface LibraryShowcaseProps {
  exiting?: boolean;
  exitDelay?: number;
}

type Visual =
  | { kind: "icon"; icon: IconSvgElement }
  | { kind: "flag"; src: string }
  | { kind: "photo"; src: string }
  | { kind: "logo"; src: string };

interface LibraryCard {
  title: string;
  visuals: Visual[];
  gapClassName?: string;
  tileSizeClassName?: string;
  mobileTileSizeClassName?: string;
  mobileAutoSpacing?: boolean;
}

const CARDS: LibraryCard[] = [
  {
    title: "Icônes",
    gapClassName: "gap-6 md:gap-4",
    mobileTileSizeClassName: "h-8 w-8",
    tileSizeClassName: "md:h-6 md:w-6",
    visuals: [
      { kind: "icon", icon: Home01Icon },
      { kind: "icon", icon: Bookmark02Icon },
      { kind: "icon", icon: PaintBoardIcon },
      { kind: "icon", icon: MoonCloudFastWindIcon },
      { kind: "icon", icon: Message01Icon },
      { kind: "icon", icon: BrowserIcon },
      { kind: "icon", icon: Idea01Icon },
      { kind: "icon", icon: UserIcon },
      { kind: "icon", icon: Target01Icon },
      { kind: "icon", icon: Tick01Icon },
    ],
  },
  {
    title: "Logos",
    gapClassName: "gap-6 md:gap-4",
    mobileTileSizeClassName: "h-8 w-8",
    tileSizeClassName: "md:h-6 md:w-6",
    visuals: [
      { kind: "logo", src: logoFacebook },
      { kind: "logo", src: logoInstagram },
      { kind: "logo", src: logoGoogle },
      { kind: "logo", src: logoWhatsapp },
      { kind: "logo", src: logoSpotify },
      { kind: "logo", src: logoYoutube },
      { kind: "logo", src: logoTiktok },
      { kind: "logo", src: logoLinkedin },
      { kind: "logo", src: logoX },
      { kind: "logo", src: logoApple },
    ],
  },
  {
    title: "Drapeaux",
    gapClassName: "gap-4",
    mobileTileSizeClassName: "h-8 w-8",
    mobileAutoSpacing: true,
    tileSizeClassName: "md:h-6 md:w-6",
    visuals: [
      { kind: "flag", src: flagFr },
      { kind: "flag", src: flagEs },
      { kind: "flag", src: flagPt },
      { kind: "flag", src: flagNo },
      { kind: "flag", src: flagDe },
      { kind: "flag", src: flagAt },
      { kind: "flag", src: flagIt },
      { kind: "flag", src: flagHr },
      { kind: "flag", src: flagGb },
      { kind: "flag", src: flagCh },
    ],
  },
  {
    title: "Avatars",
    gapClassName: "gap-6 md:gap-4",
    mobileTileSizeClassName: "h-8 w-8",
    tileSizeClassName: "md:h-6 md:w-6",
    visuals: [
      { kind: "photo", src: dog1 },
      { kind: "photo", src: dog2 },
      { kind: "photo", src: dog3 },
      { kind: "photo", src: cat1 },
      { kind: "photo", src: cat2 },
      { kind: "photo", src: cat3 },
      { kind: "photo", src: avatar1 },
      { kind: "photo", src: avatar2 },
      { kind: "photo", src: avatar3 },
      { kind: "photo", src: avatar4 },
    ],
  },
];

const CARD_STAGGER = 0.1;
const ITEM_STAGGER = 0.03;
const DURATION = 0.5;

function VisualTile({ visual }: { visual: Visual }) {
  if (visual.kind === "photo") {
    return (
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#FCFCFC]">
        <img src={visual.src} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }

  if (visual.kind === "flag") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={visual.src}
          alt=""
          className="h-full w-full rounded-[2px] object-contain"
        />
      </div>
    );
  }

  if (visual.kind === "logo") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img src={visual.src} alt="" className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <Squircle
      cornerRadius={8}
      cornerSmoothing={1}
      fill="#FCFCFC"
      borderWidth={0}
      className="h-full w-full"
    >
      <div className="flex h-full w-full items-center justify-center text-heading">
        <HugeiconsIcon icon={visual.icon} className="h-full w-full" />
      </div>
    </Squircle>
  );
}

function LibraryCardBlock({
  card,
  index,
  exiting,
  exitDelay,
}: {
  card: LibraryCard;
  index: number;
  exiting: boolean;
  exitDelay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const delay = index * CARD_STAGGER;

  const reveal = {
    initial: { opacity: 0, y: 32 },
    animate: exiting
      ? { opacity: 0, y: -EXIT_DISTANCE }
      : isInView
        ? { opacity: 1, y: 0 }
        : undefined,
    transition: exiting
      ? ({ duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" } as const)
      : ({ duration: DURATION, delay, ease: "easeOut" } as const),
  };

  return (
    <motion.div ref={ref} {...reveal} className="h-full">
      <Squircle
        cornerRadius={16}
        cornerSmoothing={1}
        borderColor="#F0EFEF"
        fill="#FCFCFC"
        className="h-full w-full"
      >
        <div className="flex h-full flex-col items-center gap-6 p-6">
          <h3 className="font-casta text-xl font-medium text-heading">
            {card.title}
          </h3>
          <div
            className={
              card.mobileAutoSpacing
                ? `flex w-64 flex-wrap justify-between gap-y-4 md:grid md:w-auto md:grid-cols-5 md:justify-normal md:gap-4`
                : `grid w-64 grid-cols-5 md:w-auto ${card.gapClassName ?? "gap-2"}`
            }
          >
            {card.visuals.map((visual, visualIndex) => (
              <motion.div
                key={visualIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={
                  exiting
                    ? { opacity: 0, y: -EXIT_DISTANCE }
                    : isInView
                      ? { opacity: 1, y: 0 }
                      : undefined
                }
                transition={
                  exiting
                    ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
                    : {
                        duration: 0.3,
                        delay: delay + visualIndex * ITEM_STAGGER,
                        ease: "easeOut",
                      }
                }
                className={`${card.mobileTileSizeClassName ?? "aspect-square w-full"} ${card.tileSizeClassName ?? "md:h-8 md:w-8"}`}
              >
                <VisualTile visual={visual} />
              </motion.div>
            ))}
          </div>
        </div>
      </Squircle>
    </motion.div>
  );
}

export function LibraryShowcase({
  exiting = false,
  exitDelay = 0,
}: LibraryShowcaseProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
      {CARDS.map((card, index) => (
        <div key={card.title} className="md:flex-1">
          <LibraryCardBlock
            card={card}
            index={index}
            exiting={exiting}
            exitDelay={exitDelay}
          />
        </div>
      ))}
    </div>
  );
}
