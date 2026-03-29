import Button from "../Button";
import Text from "../typography/Text";
import Image from "next/image";

type ProjectCardProps = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  technologies: string[];
};

const ProjectCard = ({
  slug,
  title,
  description,
  imageUrl,
  videoUrl,
  technologies,
}: ProjectCardProps) => {
  const hasVideo = Boolean(videoUrl?.trim());

  return (
    <article className="p-m h-full flex flex-col gap-m justify-between bg-bg-tertiary rounded-2xl">
      <div className="relative w-full aspect-3/2 rounded-2xl overflow-hidden">
        {hasVideo ? (
          <video
            key={`video-${slug}`}
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            key={`image-${slug}`}
            src={imageUrl}
            alt={`${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
            loading="eager"
          />
        )}
      </div>
      <div className="flex flex-col gap-s">
        <Text.SubHeader>{title}</Text.SubHeader>
        <Text.Body>{description}</Text.Body>
        {technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-black/10 bg-bg-primary px-3 py-1"
              >
                <Text.Small>{technology}</Text.Small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full flex justify-center">
        <Button
          label="View Project"
          href={`/projects/${slug}`}
          variant="primary"
        />
      </div>
    </article>
  );
};

export default ProjectCard;
