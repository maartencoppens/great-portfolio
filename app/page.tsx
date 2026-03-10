import Image from "next/image";
import Button from "./components/Button";
import Logo from "./components/Logo";
import ProjectCard from "./components/ProjectCard";
import SmallInfoCard from "./components/SmallInfoCard";
import ToolIcon from "./components/ToolIcon";
import ToolList from "./components/ToolList";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main>
      <div className="bg-[radial-gradient(600px,var(--pastel-purple-light)_0%,transparent_40%)] h-screen flex items-center justify-between">
        <div className="flex flex-col gap-l w-1/2">
          <SmallInfoCard content="Maarten Coppens" />
          <h2 className="text-hero font-bold">
            <span className="text-accent-primary font-bold">I</span>nteractive
            <br />
            <span className="text-accent-primary font-bold">M</span>edia <br />
            <span className="text-accent-primary font-bold">
              D
            </span>eveloper <br />
          </h2>
          <p className="text-body">
            Exploring the intersection of development, design, and interactive
            digital experiences.
          </p>
          <div className="flex flex-row gap-m">
            <Button label="View Projects" href="/projects" variant="primary" />
            <Button label="Contact Me" href="/contact" variant="secondary" />
          </div>
        </div>
        <Logo />
      </div>

      <div className="py-2xl h-screen">
        <SmallInfoCard content="Projects" />
        <h2 className="text-section-title font-bold">My Recent Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-m py-xl">
          {projects.slice(-3).map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.shortDescription}
              imageUrl={project.image}
              technologies={project.tags}
              slug={project.slug}
            />
          ))}
        </div>
        <div className="w-full flex justify-center pt-xs">
          <Button
            label="View All Projects"
            href="/projects"
            variant="secondary"
          />
        </div>
      </div>
      <div className="py-2xl h-screen">
        <SmallInfoCard content="About Me" />
        <h2 className="text-section-title font-bold">What I Do</h2>
        <div className="flex flex-col md:flex-row gap-2xl my-xl">
          <div className="relative w-full max-w-md aspect-3/5 overflow-hidden rounded-3xl">
            <Image
              src="/image.jpg"
              alt="About section visual"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-card-title text-accent-primary font-semibold">
                Web Development
              </h3>
              <p className="text-body pt-s">
                I build modern, responsive websites using technologies like
                React and Next.js, focusing on performance, scalability, and
                clean code.
              </p>
            </div>
            <div>
              <h3 className="text-card-title text-accent-primary font-semibold">
                Digital Design
              </h3>
              <p className="text-body pt-s">
                I design intuitive and visually engaging interfaces, translating
                ideas into thoughtful user experiences and clean digital
                products.
              </p>
            </div>
            <div>
              <h3 className="text-card-title text-accent-primary font-semibold">
                Creative Development
              </h3>
              <p className="text-body pt-s">
                I explore interactive and experimental digital experiences using
                creative technologies like Three.js and TouchDesigner.
              </p>
            </div>
            <div>
              <h3 className="text-card-title text-accent-primary font-semibold">
                Technologies
              </h3>
              <ToolList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
