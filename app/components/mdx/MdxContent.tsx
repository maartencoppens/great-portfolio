import * as runtime from "react/jsx-runtime";
import type { ComponentType, ReactNode } from "react";
import Text from "@/app/components/typography/Text";

type Children = { children?: ReactNode };

const sharedComponents = {
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
  p: ({ children }: Children) => (
    <Text.Body className="pb-s">{children}</Text.Body>
  ),
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
