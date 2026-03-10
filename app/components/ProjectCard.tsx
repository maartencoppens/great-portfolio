import React from "react";
import Button from "./Button";
import SmallInfoCard from "./SmallInfoCard";

type ProjectCardProps = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
};

const ProjectCard = ({
  slug,
  title,
  description,
  imageUrl,
  technologies,
}: ProjectCardProps) => {
  return (
    <div className="p-m flex flex-col gap-m bg-bg-tertiary rounded-2xl">
      <img
        src={imageUrl}
        alt={`An image of the project "${title}"`}
        className="rounded-2xl max-w-full"
      />
      <div className="flex flex-wrap gap-s">
        {technologies.map((tech) => (
          <SmallInfoCard key={tech} content={tech} />
        ))}
      </div>
      <h3 className="text-card-title font-bold">{title}</h3>
      <p className="text-body">{description}</p>
      <div className="w-full flex justify-center">
        <Button
          label="View Project"
          href={`/projects/${slug}`}
          variant="primary"
        />
      </div>
    </div>
  );
};

export default ProjectCard;
