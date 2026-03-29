import { typography, TypographyKey } from "@/app/lib/Typography";
import { CSSProperties, ReactNode, ElementType, HTMLAttributes } from "react";

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function BaseText({
  as: Tag = "p",
  type,
  children,
  className,
  style,
  ...props
}: TextProps & { type: TypographyKey }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any;
  return (
    <Component
      className={className}
      style={{ ...typography[type], ...style }}
      {...props}
    >
      {children}
    </Component>
  );
}

const Text = {
  Hero: (props: TextProps) => <BaseText type="hero" as="h1" {...props} />,
  Header: (props: TextProps) => <BaseText type="header" as="h2" {...props} />,
  SubHeader: (props: TextProps) => (
    <BaseText type="subHeader" as="h3" {...props} />
  ),
  Body: (props: TextProps) => <BaseText type="body" as="p" {...props} />,
  BodyLarge: (props: TextProps) => (
    <BaseText type="bodyLarge" as="p" {...props} />
  ),
  Small: (props: TextProps) => <BaseText type="small" as="span" {...props} />,
  Label: (props: TextProps) => <BaseText type="label" as="span" {...props} />,
  Nav: (props: TextProps) => <BaseText type="nav" as="span" {...props} />,
  Button: (props: TextProps) => <BaseText type="button" as="span" {...props} />,
};

export default Text;
