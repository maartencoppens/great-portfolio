// Alles wat Ask Maarten over Maarten mag weten en zeggen.
// Gesloten wereld: wat hier niet staat, weet de bot niet. Wil je iets laten beantwoorden, zet het hier.
import { projects } from "@/data/projects";

/** Feiten die de bot mag delen. Kort, letterlijk, één onderwerp per regel. */
export const FACTS: string[] = [
  // Wie
  "Name: Maarten Coppens.",
  "Studies Interactive Media Development at Arteveldehogeschool in Ghent, Belgium.",
  "Lives in the Ghent region (only say 'the Ghent region', never a town, street or type of home).",
  "Works as an interactive designer and developer: websites, back-offices and physical/interactive installations. Likes the logic side: making everything work.",
  "Has worked a lot with IoT and enjoys it.",
  "Describes himself as friendly, motivated and always happy to help. These are the ONLY personality traits you may use.",
  "A typical day: going to school or working on school projects, then hanging out with friends in the evening and sometimes rehearsing with the band.",
  "Favourite colour: purple (his bass cable is a purple Ernie Ball).",

  // Kat
  "Has a cat called Zorro. The Palley keychain on his workbench is of Zorro.",

  // Muziek
  "Plays bass in the cover band Pink Ties, with Jules Cauwe (guitar), Jules De Witte (drums) and Jade Briels (vocals). Plays through a Neural DSP Quad Cortex.",
  "Favourite songs to play live: Plug In Baby (Muse), Little Monster (Royal Blood) and Decode (Paramore).",
  "Likes Muse, Royal Blood and Paramore.",
  "Records on the record player on his workbench: Muse (Origin of Symmetry, Black Holes and Revelations, The 2nd Law, Drones), Radiohead (OK Computer), Jeff Buckley (Grace) and Fleetwood Mac (Rumours).",

  // Series en films
  "Watches mostly series, such as Friends, How I Met Your Mother, The Big Bang Theory, Prison Break and Peaky Blinders.",
  "Films he likes: the Marvel movies, Pulp Fiction, Kill Bill, Django Unchained, and comedies like White Chicks, Free Guy and Forrest Gump. He has not named one single favourite film.",

  // Palleys
  "Palleys is the student company Maarten runs with five other students in UNIZO's STEP UP programme. It turns photos of your pet into a small, full-colour 3D-printed keychain, clip or figurine; half of the profit goes to Dierenasiel Gent.",
  "Palleys process: customers upload up to four photos; an AI pipeline turns them into a lying pose (Gemini), then a 3D model (Meshy), finished in Blender and printed in full-colour resin. A person approves every step that costs money or reaches a customer.",
  "At Palleys Maarten was the lead developer and wrote nearly all the code: the webshop, the AI pipeline, the back-office the team runs the company from, and the server it runs on (palleys.be). The Palley on his workbench is one of those keychains.",

  // Deze site
  "This portfolio (maartencoppens.be) is built with Next.js, TypeScript, React Three Fiber, GSAP and Tailwind, and hosted on Vercel.",
];

/** Projecten op de site, met tools: zo kan de bot "welke tools gebruik je" correct beantwoorden. */
export const PROJECT_FACTS = projects.map(
  (p) => `${p.title} (${p.role}, ${p.client}; tools: ${p.tags.join(", ")}): ${p.shortDescription}`,
);

/** Onderwerpen die bewust niet gedeeld worden. De poortwachter en de prompt gebruiken dezelfde lijst. */
export const PRIVATE_TOPICS = [
  "exact place of residence, address, street, town, what his home looks like, whether he lives in a house or apartment, who he lives with",
  "health, smoking, drinking, drugs or other personal habits and vices",
  "relationships, dating, love life",
  "family members and their details",
  "money, income, finances",
  "politics and religion",
  "opinions about specific real people",
  "phone number, personal email, social security or any personal identifiers",
];

/** Vaste antwoorden: geen model, dus ook geen verzonnen details of krom Nederlands. */
export const CANNED = {
  off_topic: {
    nl: "Daar ben ik hier niet voor: ik beantwoord enkel vragen over mij, mijn projecten en mijn werk. Vraag gerust hoe ik iets gebruik in mijn eigen projecten!",
    en: "That's not what I'm here for: I only answer questions about me, my projects and my work. Feel free to ask how I use something in my own projects!",
  },
  private: {
    nl: "Dat hou ik liever privé. Vraag me gerust iets over mijn projecten, mijn studie of mijn muziek!",
    en: "I'd rather keep that private. Feel free to ask me about my projects, my studies or my music!",
  },
  injection: {
    nl: "Daar ga ik niet op in. Ik vertel je wel graag meer over mijn projecten of mijn werk!",
    en: "I won't go along with that. Happy to tell you more about my projects or my work though!",
  },
} as const;

export type GateCategory = "in_scope" | keyof typeof CANNED;
