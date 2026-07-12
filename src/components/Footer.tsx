import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ExternalLinkIcon } from "@hugeicons/core-free-icons";
import { AnimatedLink } from "./AnimatedLink";
import { Button } from "./Button";
import { scrollToTop } from "../lib/scroll";
import { CONTACT_LINKS } from "../data/contact";
import { projects } from "../data/projects";
import { useScrollReveal } from "../hooks/useScrollReveal";

const columnTitleClassName = "font-casta text-xl font-medium text-heading";
const linkClassName = "-mx-2 -my-1 px-2 py-1 text-base font-medium text-body";

const LINE_STAGGER = 0.08;

const revealProps = (index: number) =>
  useScrollReveal({ y: 16, duration: 0.4, delay: index * LINE_STAGGER, amount: 0.2 });

export function Footer() {
  return (
    <footer
      id="contact"
      className="mx-auto flex max-w-[96rem] flex-col gap-8 bg-background px-4 py-12 md:px-6 md:py-24"
    >
      <motion.div {...revealProps(0)} className="flex justify-end">
        <Button className="text-base text-heading" onClick={() => scrollToTop()}>
          Retour en haut
        </Button>
      </motion.div>

      <motion.hr {...revealProps(1)} className="border-neutral-200" />

      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-32">
        <motion.div {...revealProps(2)}>
          <AnimatedLink scrollToAnchor="about" className={columnTitleClassName}>
            À propos
          </AnimatedLink>
        </motion.div>

        <div className="flex flex-col gap-3">
          <motion.div {...revealProps(3)}>
            <AnimatedLink
              scrollToAnchor="projets"
              scrollOffset={48}
              className={columnTitleClassName}
            >
              Projets
            </AnimatedLink>
          </motion.div>
          <div className="flex flex-col items-start gap-2">
            {projects.map((project, index) => (
              <motion.div key={project.slug} {...revealProps(4 + index)}>
                <AnimatedLink
                  href={`/projects/${project.slug}`}
                  className={linkClassName}
                >
                  {project.title}
                </AnimatedLink>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <motion.div {...revealProps(3)}>
            <h3 className={columnTitleClassName}>Contacts</h3>
          </motion.div>
          <div className="flex flex-col items-start gap-2">
            {CONTACT_LINKS.map((link, index) => (
              <motion.div key={link.label} {...revealProps(4 + index)}>
                <AnimatedLink
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  icon={<HugeiconsIcon icon={ExternalLinkIcon} size={16} />}
                  className={linkClassName}
                >
                  {link.label}
                </AnimatedLink>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          {...revealProps(8)}
          className="text-sm font-medium text-body md:ml-auto"
        >
          © 2026 RENARD Clément
        </motion.p>
      </div>
    </footer>
  );
}
