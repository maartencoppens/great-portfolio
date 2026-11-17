import { projects } from "@/data/projects";
import { JSX } from "react";
import Hero from "./components/werkbank";
import ProjectCardAnimation from "./sections/ProjectCardAnimation";
import AboutStory from "./sections/AboutStory";

export default function Home(): JSX.Element {
  return (
    <>
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
