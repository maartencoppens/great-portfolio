import React from "react";
import SmallInfoCard from "../components/SmallInfoCard";
import Button from "../components/Button";
import ProjectCard from "../components/ProjectCard";
import { projects } from "@/data/projects";

const Projects = () => {
  return (
    <section className="flex flex-col gap-xl pt-xl">
      <div className="w-1/2">
        <SmallInfoCard content="Selected Work" />
        <h2 className="text-section-title font-bold">My Projects</h2>
        <p className="text-body">
          A selection of projects exploring web development, digital design, and
          creative technology.
        </p>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-m">
        <Button label="All Projects" href="/projects" variant="primary" />
        <Button label="Web Development" href="/projects" variant="secondary" />
        <Button
          label="Creative Technology"
          href="/projects"
          variant="secondary"
        />
        <Button
          label="Internet Of Things"
          href="/projects"
          variant="secondary"
        />
      </div>
      <div className="grid grid-cols-3 gap-l">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.shortDescription}
            imageUrl={project.image}
            technologies={project.tags}
            slug={project.slug}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
