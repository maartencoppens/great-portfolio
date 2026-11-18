import type { Metadata } from "next";
import Text from "./components/typography/Text";
import SmallInfoCard from "./components/cards/SmallInfoCard";
import Button from "./components/Button";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Maarten Coppens" },
  robots: { index: false, follow: true },
  // Geen canonical: anders zou deze pagina naar de homepagina verwijzen
  alternates: { canonical: null },
};

// 404 in de stijl van de werkbank: een nummer dat niet op de setlist staat
export default function NotFound() {
  return (
    <section className="container flex min-h-[70svh] flex-col items-center justify-center gap-l py-2xl text-center">
      <SmallInfoCard content="Error 404" />
      <Text.Hero as="h1" aria-label="404, page not found">
        404
      </Text.Hero>
      <Text.BodyLarge className="max-w-[32ch] text-text-tertiary">
        This track isn&apos;t on the setlist. The page you&apos;re looking for
        doesn&apos;t exist, or it moved.
      </Text.BodyLarge>
      <div className="flex flex-wrap justify-center gap-s">
        <Button label="Back to home" href="/" variant="primary" />
        <Button label="See my projects" href="/projects" variant="secondary" />
      </div>
    </section>
  );
}
