"use client";

import React, { useMemo, useState } from "react";
import SmallInfoCard from "../components/SmallInfoCard";
import Button from "../components/Button";
import ProjectCard from "../components/ProjectCard";
import { projects } from "@/data/projects";

const categories = [
  "All Projects",
  "Web Development",
  "Creative Technology",
  "Internet Of Things",
] as const;

type Category = (typeof categories)[number];

const Projects = () => {
  const [activeCategory, setActiveCategory] =
    useState<Category>("All Projects");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All Projects") {
      return projects;
    }

    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="flex flex-col gap-xl pt-xl">
      <div className="w-1/2">
        <SmallInfoCard content="Selected Work" />
        <h2 className="pt-s text-section-title font-bold">My Projects</h2>
        <p className="text-body">
          A selection of projects exploring web development, digital design, and
          creative technology.
        </p>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-m">
        {categories.map((category) => (
          <Button
            key={category}
            label={category}
            onClick={() => setActiveCategory(category)}
            variant={activeCategory === category ? "primary" : "secondary"}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-m lg:gap-l">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.shortDescription}
            imageUrl={project.image}
            videoUrl={project.video}
            technologies={project.tags}
            slug={project.slug}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
