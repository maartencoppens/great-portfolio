import React from "react";
import Link from "next/link";
import Image from "next/image";
import Text from "./typography/Text";

interface Social {
  name: string;
  url: string;
  icon: string;
  newTab?: boolean;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/contact", label: "Contact" },
  ];

  const socials: Social[] = [
    {
      name: "GitHub",
      url: "https://github.com/maartencoppens",
      icon: "github",
      newTab: true,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/maarten-coppens-242470351/",
      icon: "linkedin",
      newTab: true,
    },
    {
      name: "Email",
      url: "mailto:maartencoppens3@gmail.com",
      icon: "email",
    },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-bg-secondary text-text-secondary">
      <div className="mx-auto grid w-full max-w-7xl justify-items-center grid-cols-1 gap-10 px-m py-xl md:px-xl lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-8">
        <div className="space-y-3 text-center md:text-start lg:pr-6">
          <Text.BodyLarge className="text-text-secondary">
            Maarten Coppens
          </Text.BodyLarge>
          <Text.Body className="text-text-tertiary">
            Frontend developer focused on performant, thoughtful digital
            experiences.
          </Text.Body>
          <Text.Body className="text-text-tertiary">
            Available for freelance and collaboration opportunities.
          </Text.Body>
        </div>

        <div className="space-y-4 flex justify-center flex-col items-center text-center md:justify-start md:items-start md:text-left">
          <Text.Small
            as="p"
            className="uppercase tracking-[0.08em] text-text-tertiary"
          >
            Navigation
          </Text.Small>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block transition-colors duration-200 hover:text-accent-secondary"
                >
                  <Text.Nav>{link.label}</Text.Nav>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 flex justify-center flex-col items-center text-center md:justify-start md:items-start md:text-left">
          <Text.Small
            as="p"
            className="uppercase tracking-[0.08em] text-text-tertiary"
          >
            Connect
          </Text.Small>
          <ul className="flex flex-col gap-3">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.url}
                  target={social.newTab ? "_blank" : undefined}
                  rel={social.newTab ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-4 py-2 transition-colors duration-200 hover:border-accent-secondary"
                  aria-label={social.name}
                >
                  <Image
                    src={`/icons/${social.icon}.png`}
                    alt=""
                    width={16}
                    height={16}
                    aria-hidden="true"
                    className="h-4 w-4 object-contain opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                  />
                  <Text.Nav className="transition-colors duration-200 group-hover:text-accent-secondary">
                    {social.name}
                  </Text.Nav>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl border-t border-white/10 px-m py-m text-center md:px-xl">
        <Text.Small as="p" className="text-text-tertiary">
          © {currentYear} Maarten Coppens. Crafted with detail and care.
        </Text.Small>
      </div>
    </footer>
  );
};

export default Footer;
