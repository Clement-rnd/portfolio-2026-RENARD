export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    label: "E-mail",
    href: "mailto:clement_rnd@hotmail.com",
    external: false,
  },
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/cl%C3%A9ment-renard-701285293/",
    external: true,
  },
  {
    label: "Mon CV",
    href: "/cv-renard.pdf",
    external: true,
  },
];
