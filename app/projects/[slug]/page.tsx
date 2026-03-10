import SmallInfoCard from "@/app/components/SmallInfoCard";
import { projects } from "@/data/projects";
import Image from "next/image";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <div>Project niet gevonden</div>;
  }

  return (
    <section>
      <a href="/projects" className="text-accent-primary">
        ← Back to projects
      </a>
      <div className="w-full h-95 relative rounded-2xl overflow-hidden my-12">
        <Image
          src="/image.jpg"
          alt="Project image"
          fill
          className="object-cover"
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 text-body">
          <h2 className="text-section-title font-bold pb-s">{project.title}</h2>
          <p>{project.longDescription}</p>
          <h3 className="text-body-lg font-bold pt-xl pb-s">The Challenge</h3>
          <p>{project.challenge}</p>
          <h3 className="text-body-lg font-bold pt-l pb-s">The Process</h3>
          <p>{project.process}</p>
        </div>
        <div className="p-l flex flex-col gap-m bg-bg-tertiary rounded-2xl">
          <h3 className="text-body-lg font-bold">Project Info</h3>
          <div>
            <p className="pb-xs">Year</p>
            <p className="text-accent-primary">{project.year}</p>
          </div>
          <div>
            <p className="pb-xs">Client</p>
            <p className="text-accent-primary">{project.client}</p>
          </div>
          <div>
            <p className="pb-xs">Role</p>
            <p className="text-accent-primary">{project.role}</p>
          </div>
          <div>
            <p className="pb-s">Technologies</p>
            <div className="flex gap-xs">
              {project.tags.map((tag, index) => (
                <SmallInfoCard key={index} content={tag} />
              ))}
            </div>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary hover:underline"
            >
              View Project
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
