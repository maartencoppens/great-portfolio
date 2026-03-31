import SmallInfoCard from "@/app/components/cards/SmallInfoCard";
import Text from "@/app/components/typography/Text";
import { projects } from "@/data/projects";
import Image from "next/image";
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
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

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
          url: project.image,
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
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <section className="container pb-l pt-m md:pt-l">
      <Link
        href="/projects"
        className="inline-flex items-center text-accent-primary hover:underline"
      >
        <span>← All projects</span>
      </Link>
      <div className="my-l rounded-2xl p-0 sm:p-xs md:p-s">
        <div className="relative mx-auto aspect-4/3 w-full overflow-hidden rounded-2xl sm:aspect-video lg:max-w-5xl">
          {project.video ? (
            <video
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={project.image}
              alt={`Preview of ${project.title}`}
              fill
              sizes="(min-width: 1280px) 960px, (min-width: 1024px) 80vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-l lg:grid-cols-12 lg:gap-xl">
        <div className="lg:col-span-8 text-body">
          <Text.Header as="h1" className="pb-s">
            {project.title}
          </Text.Header>
          <Text.Body>{project.longDescription}</Text.Body>
          <Text.SubHeader as="h2" className="pt-xl pb-s">
            The Challenge
          </Text.SubHeader>
          <Text.Body>{project.challenge}</Text.Body>
          <Text.SubHeader as="h2" className="pt-l pb-s">
            The Process
          </Text.SubHeader>
          <Text.Body>{project.process}</Text.Body>
        </div>
        <aside className="lg:col-span-4 h-fit rounded-2xl bg-bg-tertiary p-m sm:p-l lg:sticky lg:top-28">
          <Text.SubHeader as="h2" className="pb-s">
            Project Info
          </Text.SubHeader>
          <div className="pb-m">
            <Text.Body className="pb-xs">Year</Text.Body>
            <Text.Body className="text-accent-primary">
              {project.year}
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
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex text-accent-primary hover:underline"
            >
              <span>View Project</span>
            </a>
          )}
        </aside>
      </div>
    </section>
  );
}
