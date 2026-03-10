import { Project } from "@/types/types";

export const projects: Project[] = [
  {
    slug: "gent-event-map",
    title: "Gent Event Map",
    shortDescription: "Een interactieve event map van Gent.",
    longDescription:
      "Dit project toont evenementen op een interactieve kaart met filtering en detailweergaves.",
    process:
      "We hebben een user-centered design benadering gevolgd om de gebruikerservaring te optimaliseren.",
    challenge:
      "De grootste uitdaging was het efficiënt laden van kaartdata en het implementeren van realtime updates.",

    image: "/image.jpg",
    role: "Full Stack Developer",
    client: "SchoolProject",
    tags: ["Unreal Engine", "API"],
    year: 2026,
    link: "https://google.com",
  },
  {
    slug: "hogwarts-configurator",
    title: "Hogwarts Configurator",
    shortDescription: "Een 3D configurator met interactieve hotspots.",
    longDescription:
      "Een immersive configurator gebouwd met moderne webtechnologieën en 3D assets.",
    process:
      "We hebben een user-centered design benadering gevolgd om de gebruikerservaring te optimaliseren.",
    challenge:
      "De grootste uitdaging was het efficiënt laden van kaartdata en het implementeren van realtime updates.",
    image: "/image.jpg",
    role: "Frontend Developer",
    client: "Personal Project",
    tags: ["React", "Three.js", "UI/UX"],
    year: 2026,
    link: "https://google.com",
  },
];

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
