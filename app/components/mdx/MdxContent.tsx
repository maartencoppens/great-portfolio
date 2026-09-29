import * as runtime from "react/jsx-runtime";
import {
  Children,
  isValidElement,
  type ComponentType,
  type ReactNode,
} from "react";
import Text from "@/app/components/typography/Text";
import Image from "next/image";
import ImageGrid from "@/app/components/mdx/ImageGrid";
import Video from "@/app/components/mdx/Video";
import Img from "@/app/components/mdx/Image";

type Children = { children?: ReactNode };

function MdxImage({
  src,
  alt,
  title,
}: {
  src?: string;
  alt?: string;
  title?: string;
}) {
  if (!src) return null;
  return (
    <figure className="py-m">
      <Image
        src={src}
        alt={alt ?? ""}
        width={0}
        height={0}
        sizes="(max-width: 1024px) 100vw, 66vw"
        className="w-full h-auto rounded-2xl"
      />
      {title && (
        <figcaption className="pt-xs opacity-70">
          <Text.Small>{title}</Text.Small>
        </figcaption>
      )}
    </figure>
  );
}

const blockContentTypes = [MdxImage, ImageGrid, Video];

const sharedComponents = {
  ImageGrid,
  Img,
  Video,
  h2: ({ children }: Children) => (
    <Text.SubHeader as="h2" className="pt-xl pb-s">
      {children}
    </Text.SubHeader>
  ),
  h3: ({ children }: Children) => (
    <Text.BodyLarge as="h3" className="pt-m pb-xs font-semibold">
      {children}
    </Text.BodyLarge>
  ),
  p: ({ children }: Children) => {
    const containsBlockContent = Children.toArray(children).some(
      (child) =>
        isValidElement(child) &&
        blockContentTypes.some((type) => child.type === type),
    );

    return containsBlockContent ? (
      <Text.Body as="div" className="pb-s">
        {children}
      </Text.Body>
    ) : (
      <Text.Body className="pb-s">{children}</Text.Body>
    );
  },
  a: ({ children, href }: Children & { href?: string }) => (
    <a
      href={href ?? "#"}
      className="text-accent-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: MdxImage,
  ul: ({ children }: Children) => (
    <ul className="list-disc pl-m pb-s">{children}</ul>
  ),
  ol: ({ children }: Children) => (
    <ol className="list-decimal pl-m pb-s">{children}</ol>
  ),
  li: ({ children }: Children) => <Text.Body as="li">{children}</Text.Body>,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdxComponents = Record<string, ComponentType<any>>;
type MdxFn = (props: { components?: MdxComponents }) => ReactNode;

export default function MdxContent({
  code,
  components,
}: {
  code: string;
  components?: MdxComponents;
}) {
  const mdx = new Function(code)({ ...runtime }).default as MdxFn;
  return mdx({ components: { ...sharedComponents, ...components } });
}
