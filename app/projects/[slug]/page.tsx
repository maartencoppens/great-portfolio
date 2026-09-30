import SmallInfoCard from "@/app/components/cards/SmallInfoCard";
import ProjectMediaGallery from "@/app/components/projects/ProjectMediaGallery";
import Text from "@/app/components/typography/Text";
import {
  getProjectMedia,
  getProjectPrimaryImage,
} from "@/app/lib/projectMedia";
import MdxContent from "@/app/components/mdx/MdxContent";
import { getProjectBySlug, projects } from "@/data/projects";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const primaryImage = getProjectPrimaryImage(project);

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | Maarten`,
      description: project.shortDescription,
      url: `/projects/${project.slug}`,
      type: "article",
      images: [
        {
          url: primaryImage,
          width: 1200,
          height: 630,
          alt: `Preview of ${project.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | Maarten`,
      description: project.shortDescription,
      images: [primaryImage],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  const mediaItems = getProjectMedia(project);

  return (
    <section className="container pb-l pt-m md:pt-l">
      <Link
        href="/projects"
        className="inline-flex items-center text-accent-primary hover:underline"
      >
        <span>← All projects</span>
      </Link>

      <ProjectMediaGallery
        mediaItems={mediaItems}
        projectTitle={project.title}
        projectSlug={project.slug}
      />

      <div className="grid grid-cols-1 gap-l lg:grid-cols-12 lg:gap-xl">
        <div className="lg:col-span-8 text-body">
          <Text.Header as="h1" className="pb-s">
            {project.title}
          </Text.Header>
          <MdxContent code={project.body} />
        </div>
        <aside className="lg:col-span-4 h-fit rounded-2xl bg-bg-tertiary p-m sm:p-l lg:sticky lg:top-28">
          <Text.SubHeader as="h2" className="pb-s">
            Project Info
          </Text.SubHeader>
          <div className="pb-m">
            <Text.Body className="pb-xs">Date</Text.Body>
            <Text.Body className="text-accent-primary">
              {new Date(project.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </Text.Body>
          </div>
          <div className="pb-m">
            <Text.Body className="pb-xs">Client</Text.Body>
            <Text.Body className="text-accent-primary">
              {project.client}
            </Text.Body>
          </div>
          <div className="pb-m">
            <Text.Body className="pb-xs">Role</Text.Body>
            <Text.Body className="text-accent-primary">
              {project.role}
            </Text.Body>
          </div>
          <div className="pb-s">
            <Text.Body className="pb-s">Technologies</Text.Body>
            <div className="flex gap-xs flex-wrap">
              {project.tags.map((tag) => (
                <SmallInfoCard key={`${project.slug}-${tag}`} content={tag} />
              ))}
            </div>
          </div>
          {(project.link || project.github) && (
            <div className="flex flex-wrap gap-s border-t border-black/10 pt-m">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-4xl bg-accent-primary px-l py-s text-text-secondary transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
                >
                  <Text.Button>
                    Visit live site
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Text.Button>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-4xl border-2 border-text-primary px-l py-s transition-colors duration-200 hover:border-accent-primary hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
                >
                  <Text.Button>
                    View code on GitHub
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Text.Button>
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
