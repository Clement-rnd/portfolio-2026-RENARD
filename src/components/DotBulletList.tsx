import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DotSeparator } from "./DotSeparator";
import { RevealWords } from "./RevealWords";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface DotBulletItem {
  label?: string;
  text: string;
}

export interface DotBulletListProps {
  items: DotBulletItem[];
  exiting?: boolean;
  exitDelay?: number;
}

const BLOCK_STAGGER = 0.2;
const WORD_STAGGER = 0.02;
const WORD_DURATION = 0.4;

function wordCount(text: string) {
  return text.split(" ").filter(Boolean).length;
}

// Each bullet's label + text reveal word by word (matching the site's usual
// paragraph convention) rather than fading in as one block — the label's
// words finish first, then the following text continues the same cascade.
function DotBulletItemRow({
  item,
  delay,
  exiting,
  exitDelay,
}: {
  item: DotBulletItem;
  delay: number;
  exiting: boolean;
  exitDelay: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const labelWords = item.label ? wordCount(item.label) : 0;
  const textDelay = delay + labelWords * WORD_STAGGER;

  return (
    <li ref={ref} className="flex items-start gap-2 text-lg font-medium text-body">
      <motion.span
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
            : { duration: WORD_DURATION, delay, ease: "easeOut" }
        }
        className="flex h-7 items-center text-heading"
      >
        <DotSeparator />
      </motion.span>
      <span>
        {item.label && (
          <>
            <RevealWords
              words={item.label}
              trigger={isInView}
              exiting={exiting}
              exitDelay={exitDelay}
              delay={delay}
              stagger={WORD_STAGGER}
              duration={WORD_DURATION}
              as="span"
              wordClassName="font-bold text-heading"
            />{" "}
          </>
        )}
        <RevealWords
          words={item.text}
          trigger={isInView}
          exiting={exiting}
          exitDelay={exitDelay}
          delay={textDelay}
          stagger={WORD_STAGGER}
          duration={WORD_DURATION}
          as="span"
        />
      </span>
    </li>
  );
}

export function DotBulletList({
  items,
  exiting = false,
  exitDelay = 0,
}: DotBulletListProps) {
  return (
    <ul className="flex max-w-2xl flex-col gap-2">
      {items.map((item, index) => (
        <DotBulletItemRow
          key={item.text}
          item={item}
          delay={index * BLOCK_STAGGER}
          exiting={exiting}
          exitDelay={exitDelay}
        />
      ))}
    </ul>
  );
}
