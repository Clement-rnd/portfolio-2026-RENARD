import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import phoneSplash from "../assets/images/naya/cover/phone-splash.jpg";
import phoneHome from "../assets/images/naya/cover/phone-home.jpg";
import phoneDetails from "../assets/images/naya/cover/phone-details.jpg";
import { Squircle } from "./Squircle";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface NayaCoverHeroProps {
  exiting?: boolean;
  exitDelay?: number;
}

// Recreates the Figma cover (node 219:7434): 3 phone screens scattered over
// a soft pink gradient, each an independent element with its own entrance —
// rather than one flat exported banner image.
//
// The screenshots are plain rectangular app screens (no phone chrome baked
// in) — the rounded corners, tilt and drop shadow are all built here with
// our own Squircle + CSS, so nothing is pre-baked against a mismatched
// background the way a raster Figma export would be.
const PHONES = [
  { src: phoneSplash, leftPct: 31, topPct: 81.19, widthPct: 26.41, rotate: -4 },
  { src: phoneHome, leftPct: 50.34, topPct: 78.92, widthPct: 26.41, rotate: 0 },
  { src: phoneDetails, leftPct: 69.68, topPct: 81.19, widthPct: 26.41, rotate: 4 },
];

const PHONE_STAGGER = 0.15;
const PHONE_SHADOW = "0px 12px 30px rgba(0,0,0,0.12)";

export function NayaCoverHero({
  exiting = false,
  exitDelay = 0,
}: NayaCoverHeroProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden bg-white">
      {PHONES.map((phone, index) => (
        <motion.div
          key={phone.src}
          initial={{ opacity: 0, y: 60 }}
          animate={
            exiting
              ? { opacity: 0, y: -EXIT_DISTANCE }
              : isInView
                ? { opacity: 1, y: 0 }
                : undefined
          }
          transition={
            exiting
              ? {
                  duration: EXIT_DURATION,
                  delay: exitDelay,
                  ease: "easeOut",
                }
              : {
                  duration: 0.7,
                  delay: index * PHONE_STAGGER,
                  ease: "easeOut",
                }
          }
          className="absolute"
          style={{
            left: `${phone.leftPct}%`,
            top: `${phone.topPct}%`,
            width: `${phone.widthPct}%`,
            aspectRatio: "393 / 852",
            translate: "-50% -50%",
            rotate: `${phone.rotate}deg`,
            filter: `drop-shadow(${PHONE_SHADOW})`,
          }}
        >
          <Squircle
            cornerRadius={28}
            cornerSmoothing={1}
            borderWidth={0}
            className="h-full w-full"
          >
            <img
              src={phone.src}
              alt=""
              className="h-full w-full object-cover"
            />
          </Squircle>
        </motion.div>
      ))}
    </div>
  );
}
