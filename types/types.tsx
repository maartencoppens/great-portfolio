import type { Project as VeliteProject } from "#site/content";

export type Project = Omit<VeliteProject, "body">;
export type ProjectMedia = NonNullable<Project["media"]>[number];
