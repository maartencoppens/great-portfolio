import type { Project, ProjectMedia } from "@/types/types";

export function getProjectMedia(project: Project): ProjectMedia[] {
  if (project.media && project.media.length > 0) {
    return project.media;
  }

  const fallbackMedia: ProjectMedia[] = [];

  if (project.video?.trim()) {
    fallbackMedia.push({ type: "video", src: project.video });
  }

  fallbackMedia.push({
    type: "image",
    src: project.image,
    alt: `Preview of ${project.title}`,
  });

  return fallbackMedia;
}

export function getProjectPreviewMedia(project: Project): ProjectMedia {
  return (
    getProjectMedia(project)[0] ?? {
      type: "image",
      src: project.image,
      alt: `Preview of ${project.title}`,
    }
  );
}

export function getProjectPrimaryImage(project: Project): string {
  return (
    getProjectMedia(project).find((item) => item.type === "image")?.src ??
    project.image
  );
}
