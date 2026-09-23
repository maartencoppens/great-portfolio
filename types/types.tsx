export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
};

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  challenge: string;
  process: string;
  media?: ProjectMedia[];
  image: string;
  video?: string;
  role: string;
  client: string;
  tags: string[];
  year: number;
  link?: string;
  category: string;
};
