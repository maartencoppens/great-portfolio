"use client";

import { useEffect, useMemo, useState } from "react";
import SmallInfoCard from "../components/cards/SmallInfoCard";
import ProjectCard from "../components/cards/ProjectCard";
import { projects } from "@/data/projects";
import {
  getProjectPrimaryImage,
  getProjectPreviewVideo,
} from "@/app/lib/projectMedia";
import Text from "../components/typography/Text";
import { ScrollTrigger } from "@/app/lib/gsap";

const categories = [
  "All",
  "Web",
  "Creative tech",
  "IoT",
  "AI & automation",
] as const;

type Category = (typeof categories)[number];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  // The page height changes when a filter shows fewer cards, so
  // ScrollSmoother needs to recalculate its scroll height.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [activeCategory]);

  const counts = useMemo(() => {
    const map = new Map<Category, number>([["All", projects.length]]);
    projects.forEach((p) =>
      map.set(p.category, (map.get(p.category) ?? 0) + 1),
    );
    return map;
  }, []);

  const visibleCategories = categories.filter((c) => (counts.get(c) ?? 0) > 0);

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
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-x-l gap-y-xs border-b border-black/10"
      >
        {visibleCategories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`-mb-px cursor-pointer border-b-2 pb-s pt-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                isActive
                  ? "border-accent-primary text-text-primary"
                  : "border-transparent text-text-primary/55 hover:text-text-primary"
              }`}
            >
              <Text.Nav>{category}</Text.Nav>
              <Text.Small className="ml-1 align-super text-[0.7rem] tabular-nums text-text-tertiary">
                {counts.get(category)}
              </Text.Small>
            </button>
          );
        })}
      </div>
      <div
        key={activeCategory}
        className="grid grid-cols-1 gap-x-l gap-y-xl md:grid-cols-2 xl:grid-cols-3 lg:gap-y-2xl"
      >
        {[...filteredProjects].reverse().map((project, index) => (
          <div
            key={project.slug}
            className="card-in"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <ProjectCard
              title={project.title}
              description={project.shortDescription}
              imageUrl={getProjectPrimaryImage(project)}
              technologies={project.tags}
              slug={project.slug}
              client={project.client}
              date={project.date}
              videoUrl={getProjectPreviewVideo(project)}
              priority={index < 3} // Prioritize the first three images for loading
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
