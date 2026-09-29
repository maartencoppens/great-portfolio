import { projects as allProjects } from "#site/content";
import type { Project } from "@/types/types";

const published = allProjects
  .filter((project) => !project.draft)
  .sort((a, b) => a.order - b.order);

export const projects: Project[] = published.map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ body, ...project }) => project,
);

export function getProjectBySlug(slug: string) {
  return published.find((project) => project.slug === slug);
}
