import { projects } from "@/data/projects";
import { JSX } from "react";
import Hero from "./components/werkbank";
import ProjectCardAnimation from "./sections/ProjectCardAnimation";
import AboutStory from "./sections/AboutStory";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maartencoppens.be"
).replace(/\/$/, "");

// Gestructureerde gegevens: helpt zoekmachines je naam aan deze site te koppelen
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Maarten Coppens",
      url: siteUrl,
      image: `${siteUrl}/og-image.jpg`,
      jobTitle: "Interactive Designer & Developer",
      address: { "@type": "PostalAddress", addressRegion: "East Flanders", addressCountry: "BE" },
      affiliation: { "@type": "CollegeOrUniversity", name: "Arteveldehogeschool" },
      sameAs: [
        "https://github.com/maartencoppens",
        "https://www.linkedin.com/in/maarten-coppens-242470351/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Maarten Coppens",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export default function Home(): JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* De werkbank-hero schuift onder de vaste Navbar door */}
      <div id="hero" className="-mt-20 md:-mt-24">
        <Hero />
      </div>
      <div id="projects">
        <ProjectCardAnimation projects={projects} />
      </div>
      <div id="about">
        <AboutStory />
      </div>
    </>
  );
}
