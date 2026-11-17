import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maartencoppens.be"
).replace(/\/$/, "");

const toAbsolute = (path: string) =>
  path.startsWith("http")
    ? path
    : `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const projectDates = projects.map((project) => new Date(project.date));
  const latestProject = projectDates.length
    ? new Date(Math.max(...projectDates.map((d) => d.getTime())))
    : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: latestProject,
      changeFrequency: "weekly",
      priority: 1,
      images: [toAbsolute("/og-image.jpg")],
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: latestProject,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
    const images = [
      project.image,
      ...(project.media ?? [])
        .filter((item) => item.type === "image")
        .map((item) => item.src),
    ];

    return {
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(project.date),
      changeFrequency: "monthly",
      priority: 0.7,
      images: [...new Set(images)].map(toAbsolute),
    };
  });

  return [...staticRoutes, ...projectRoutes];
}
