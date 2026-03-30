"use client";

import React, { useMemo, useState } from "react";
import SmallInfoCard from "../components/cards/SmallInfoCard";
import Button from "../components/Button";
import ProjectCard from "../components/cards/ProjectCard";
import { projects } from "@/data/projects";
import Text from "../components/typography/Text";

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
    <section className="flex flex-col gap-xl pt-m container">
      <div className="md:w-1/2 flex flex-col items-center text-center md:text-start md:items-start gap-s">
        <SmallInfoCard content="Selected Work" />
        <Text.Header as="h1" className="pt-s">
          My Projects
        </Text.Header>
        <Text.Body>
          A selection of projects exploring web development, digital design, and
          creative technology.
        </Text.Body>
      </div>
      <div className="w-full flex flex-wrap justify-center gap-m">
        {categories.map((category) => (
          <Button
            key={category}
            label={category}
            onClick={() => setActiveCategory(category)}
            variant="secondary"
            isActive={activeCategory === category}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-m lg:gap-l">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            description={project.shortDescription}
            imageUrl={project.image}
            {...(project.video ? { videoUrl: project.video } : {})}
            technologies={project.tags}
            slug={project.slug}
          />
        ))}
      </div>
    </section>
  );
};

export default Projects;
