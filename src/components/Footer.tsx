import { AnimatedLink } from "./AnimatedLink";
import { Button } from "./Button";
import { scrollToTop } from "../lib/scroll";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-neutral-800 text-neutral-50 px-6 py-16 flex flex-col gap-12"
    >
      <div className="flex gap-8">
        <AnimatedLink href="mailto:hello@studio-oni.fr">Email</AnimatedLink>
        <AnimatedLink
          href="https://www.linkedin.com"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </AnimatedLink>
        <AnimatedLink href="/cv.pdf" target="_blank" rel="noreferrer">
          CV
        </AnimatedLink>
      </div>
      <Button onClick={() => scrollToTop()} className="self-start">
        Retour en haut
      </Button>
    </footer>
  );
}
