import React from "react";

interface Social {
  name: string;
  url: string;
  icon: string;
}

const Footer = () => {
  const socials: Social[] = [
    {
      name: "GitHub",
      url: "https://github.com/maartencoppens",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/maarten-coppens-242470351/",
      icon: "linkedin",
    },
    {
      name: "Email",
      url: "mailto:maartencoppens3@gmail.com",
      icon: "email",
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center py-2xl px-xl gap-8 bg-bg-secondary text-text-tertiary">
      <div className="flex flex-col gap-2">
        <p className="text-lg">© 2026 · Designed & Developed with care</p>
        <p className="text-lg">Available for freelance opportunities</p>
      </div>

      <div className="flex gap-6 items-center">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
            title={social.name}
          >
            <img
              src={`/icons/${social.icon}.png`}
              alt={social.name}
              className="w-6 h-6 object-contain "
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;
