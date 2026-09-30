import { defineCollection, defineConfig, s } from "velite";

const media = s.object({
  type: s.enum(["image", "video"]),
  src: s.string(),
  alt: s.string().optional(),
  poster: s.string().optional(),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s.object({
    slug: s.slug("projects"),
    title: s.string().max(99),
    shortDescription: s.string(),
    order: s.number(),
    draft: s.boolean().default(false),
    image: s.string(),
    video: s.string().optional(),
    media: s.array(media).optional(),
    role: s.string(),
    client: s.string(),
    tags: s.array(s.string()),
    date: s.string(),
    githubLink: s.string().url().optional(),
    link: s.string().url().optional(),
    category: s.enum(["Web", "Creative tech", "IoT", "AI & automation"]),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { projects },
});
