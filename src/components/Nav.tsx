import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedLink } from "./AnimatedLink";
import { BurgerIcon } from "./BurgerIcon";
import { RevealChars } from "./RevealChars";
import { scrollToId } from "../lib/scroll";
import { useEntranceReveal } from "../hooks/useEntranceReveal";
import { HERO_NAV_DELAY, HERO_STEP_DURATION } from "../lib/heroSequence";
import logo from "../assets/images/logo.svg";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const NAV_LINKS = [
  { label: "Projets", id: "projets", variant: "tertiary" as const },
  { label: "À propos", id: "about", variant: "tertiary" as const },
  { label: "Me contacter", id: "contact", variant: "primary" as const },
];

const VARIANT_CLASSES = {
  tertiary: "text-neutral-700",
  primary: "bg-neutral-700 text-neutral-50",
};

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeAndScrollTo = (id: string) => {
    setIsOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      {...useEntranceReveal({
        delay: HERO_NAV_DELAY,
        y: 20,
        duration: HERO_STEP_DURATION,
      })}
      className="relative z-50 w-[90%] max-w-[96rem] mx-auto pt-4 pb-3"
    >
      <div className="flex items-center justify-between gap-8">
        <img src={logo} alt="Studio Oni" className="h-9 w-auto" />

        <nav className="hidden md:block">
          <ul className="flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <AnimatedLink
                  scrollToAnchor={link.id}
                  className={`rounded-lg px-4 text-sm font-medium ${VARIANT_CLASSES[link.variant]}`}
                  charClassName="py-2"
                >
                  {link.label}
                </AnimatedLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
          className="relative z-50 h-7 w-7 text-heading md:hidden"
        >
          <BurgerIcon isOpen={isOpen} size={28} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE_POWER3_OUT }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-6 bg-background px-6 shadow-[-6px_0_16px_-8px_rgba(0,0,0,0.12)] md:hidden"
          >
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  closeAndScrollTo(link.id);
                }}
                className="font-casta text-4xl font-light"
              >
                <RevealChars
                  text={link.label}
                  trigger={isOpen}
                  delay={0.2 + index * 0.2}
                />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
