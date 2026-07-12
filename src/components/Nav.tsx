import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ExternalLinkIcon } from "@hugeicons/core-free-icons";
import { AnimatedLink } from "./AnimatedLink";
import { BurgerIcon } from "./BurgerIcon";
import { RevealChars } from "./RevealChars";
import { scrollToId } from "../lib/scroll";
import { useEntranceReveal } from "../hooks/useEntranceReveal";
import { HERO_NAV_DELAY, HERO_STEP_DURATION } from "../lib/heroSequence";
import { CONTACT_LINKS } from "../data/contact";
import { projects } from "../data/projects";
import logo from "../assets/images/logo.svg";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const NAV_LINKS = [
  {
    label: "Projets",
    id: "projets",
    variant: "tertiary" as const,
    offset: 48,
  },
  { label: "À propos", id: "about", variant: "tertiary" as const, offset: 0 },
  {
    label: "Me contacter",
    id: "contact",
    variant: "primary" as const,
    offset: 0,
  },
];

const VARIANT_CLASSES = {
  tertiary: "text-neutral-700",
  primary: "bg-[var(--color-heading)] text-white",
};

interface MobileMenuSubItem {
  label: string;
  href: string;
  external?: boolean;
}

interface MobileMenuGroup {
  label: string;
  scrollId: string;
  scrollOffset: number;
  subItems: MobileMenuSubItem[];
  /** Shows the external-link icon next to each sub-item's label. */
  subItemsWithIcon?: boolean;
}

const MOBILE_MENU_GROUPS: MobileMenuGroup[] = [
  {
    label: "Projets",
    scrollId: "projets",
    scrollOffset: 48,
    subItems: projects.map((project) => ({
      label: project.title,
      href: `/projects/${project.slug}`,
    })),
  },
  {
    label: "À propos",
    scrollId: "about",
    scrollOffset: 0,
    subItems: [],
  },
  {
    label: "Contacts",
    scrollId: "contact",
    scrollOffset: 0,
    subItems: CONTACT_LINKS,
    subItemsWithIcon: true,
  },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeAndScrollTo = (id: string, offset: number) => {
    setIsOpen(false);
    scrollToId(id, undefined, offset);
  };

  const closeAndNavigate = (href: string) => {
    setIsOpen(false);
    navigate(href);
  };

  // Continuous letter-index across every group title + sub-item, so the
  // whole drawer staggers as one cascading wave.
  let mobileItemIndex = 0;

  return (
    <motion.header
      {...useEntranceReveal({
        delay: HERO_NAV_DELAY,
        y: 20,
        duration: HERO_STEP_DURATION,
      })}
      className="relative z-50 mx-auto max-w-[96rem] px-4 pt-4 pb-3 md:px-6"
    >
      <div className="flex items-center justify-between gap-8">
        <img src={logo} alt="Studio Oni" className="h-9 w-auto" />

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <AnimatedLink
                  scrollToAnchor={link.id}
                  scrollOffset={link.offset}
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
          className="relative z-50 h-7 w-7 text-heading lg:hidden"
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
            className="fixed inset-0 z-40 flex flex-col items-start gap-6 overflow-y-auto bg-background px-6 pt-24 pb-12 shadow-[-6px_0_16px_-8px_rgba(0,0,0,0.12)] lg:hidden"
          >
            {MOBILE_MENU_GROUPS.map((group) => {
              const titleDelay = 0.2 + mobileItemIndex * 0.1;
              mobileItemIndex += 1;

              return (
                <div key={group.label} className="flex flex-col items-start gap-4">
                  <a
                    href={`#${group.scrollId}`}
                    onClick={(event) => {
                      event.preventDefault();
                      closeAndScrollTo(group.scrollId, group.scrollOffset);
                    }}
                    className="font-casta text-4xl font-medium text-heading"
                  >
                    <RevealChars
                      text={group.label}
                      trigger={isOpen}
                      delay={titleDelay}
                    />
                  </a>

                  {group.subItems.length > 0 && (
                    <div className="flex flex-col items-start gap-2">
                      {group.subItems.map((item) => {
                        const itemDelay = 0.2 + mobileItemIndex * 0.1;
                        mobileItemIndex += 1;
                        const isInternal = !item.external;

                        return (
                          <a
                            key={item.label}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noreferrer" : undefined}
                            onClick={(event) => {
                              if (isInternal && item.href.startsWith("/")) {
                                event.preventDefault();
                                closeAndNavigate(item.href);
                              } else {
                                setIsOpen(false);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 text-lg font-medium text-heading"
                          >
                            <RevealChars
                              text={item.label}
                              trigger={isOpen}
                              delay={itemDelay}
                            />
                            {group.subItemsWithIcon && (
                              <motion.span
                                initial={{ opacity: 0, y: 16 }}
                                animate={
                                  isOpen
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 16 }
                                }
                                transition={{
                                  duration: 0.4,
                                  delay: itemDelay,
                                  ease: "easeOut",
                                }}
                              >
                                <HugeiconsIcon
                                  icon={ExternalLinkIcon}
                                  size={16}
                                />
                              </motion.span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
