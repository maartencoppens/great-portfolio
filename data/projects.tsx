import { Project } from "@/types/types";

export const projects: Project[] = [
  // {
  //   slug: "foodkiosk-frontend",
  //   title: "Subway Foodkiosk Frontend",
  //   shortDescription:
  //     "Een interactieve kioskinterface voor het samenstellen en bestellen van sandwiches.",
  //   longDescription:
  //     "Dit project is de frontend van een self-service foodkiosk geïnspireerd op Subway. Gebruikers kunnen hun eigen sandwich samenstellen via een intuïtieve interface met verschillende stappen, zoals het kiezen van brood, toppings en sauzen. De interface is ontworpen om snel en duidelijk te werken op een kiosk-scherm, met focus op gebruiksvriendelijkheid, duidelijke visuele feedback en een gestroomlijnde bestelervaring.",

  //   process:
  //     "Het project startte met een volledig designproces in Figma, waarbij de volledige flow van de kiosk werd uitgewerkt: van startscherm tot besteloverzicht. Daarna werd het ontwerp stap voor stap omgezet naar een frontend applicatie met component-gebaseerde structuur. De interface werd opgebouwd uit herbruikbare UI-componenten en verschillende pagina’s die samen de volledige bestelervaring vormen.",

  //   challenge:
  //     "De grootste uitdaging was het creëren van een duidelijke en intuïtieve flow voor gebruikers die snel hun bestelling willen samenstellen. Omdat een kioskinterface vaak onder tijdsdruk wordt gebruikt, moest de navigatie eenvoudig blijven terwijl er toch veel keuzes mogelijk zijn.",

  //   image: "/image.jpg",
  //   role: "Frontend Developer",
  //   client: "SchoolProject",
  //   tags: ["React", "API", "UI/UX"],
  //   year: 2025,
  //   link: "https://google.com",
  //   category: "Web Development",
  // },

  // {
  //   slug: "foodkiosk-backend",
  //   title: "Subway Foodkiosk Backend",
  //   shortDescription:
  //     "Een backend API voor het beheren van menu-items, bestellingen en configuraties van een foodkiosk.",
  //   longDescription:
  //     "Dit project vormt de backend van een foodkiosk applicatie. De server beheert menu-items, bestellingen en productconfiguraties via een REST API. De backend werd ontwikkeld met Node.js en Express en maakt gebruik van een PostgreSQL database voor het opslaan van producten, toppings en bestellingen.",

  //   process:
  //     "De backend werd ontwikkeld volgens een gestructureerde API-architectuur waarbij routes, services en database-logica van elkaar gescheiden zijn. Eerst werd het datamodel ontworpen, waarna endpoints werden gebouwd voor het ophalen van producten, het samenstellen van bestellingen en het opslaan van ordergegevens.",

  //   challenge:
  //     "De grootste uitdaging was het ontwerpen van een flexibel datamodel voor het configureren van sandwiches. Omdat gebruikers verschillende combinaties van brood, toppings en sauzen kunnen maken, moest de database zo worden opgezet dat deze variaties efficiënt konden worden opgeslagen en opgehaald.",

  //   image: "/image.jpg",
  //   role: "Backend Developer",
  //   client: "SchoolProject",
  //   tags: ["Node.js", "Express", "PostgreSQL"],
  //   year: 2025,
  //   link: "https://google.com",
  //   category: "Web Development",
  // },

  {
    slug: "skateboard-configurator",
    title: "Skateboard Configurator",
    shortDescription:
      "Een interactieve 3D configurator waarmee gebruikers hun eigen skateboard kunnen samenstellen.",
    longDescription:
      "Dit project is een interactieve 3D configurator waarmee gebruikers verschillende onderdelen van een skateboard kunnen aanpassen. Via een realtime 3D-weergave kunnen gebruikers experimenteren met verschillende decks, kleuren en onderdelen, terwijl ze het resultaat direct visueel zien.",

    process:
      "Het project begon met het modelleren van de 3D assets in Blender. Vervolgens werden deze modellen geïmporteerd in een webapplicatie waar ze interactief konden worden aangepast. De configurator werd opgebouwd rond een component-gebaseerde structuur waarbij de UI-controls direct gekoppeld zijn aan de 3D scene.",

    challenge:
      "De grootste uitdaging was het combineren van een vloeiende gebruikersinterface met realtime 3D rendering in de browser. Het was belangrijk dat de configurator performant bleef terwijl verschillende onderdelen dynamisch konden worden aangepast.",

    image: "/mockups/skateboard-configurator.png",
    role: "Full Stack Developer",
    client: "SchoolProject",
    tags: ["ThreeJS", "Blender", "React"],
    year: 2025,
    link: "https://skateboard-configurator.maartencoppens.be",
    category: "Creative Technology",
  },

  {
    slug: "muggy",
    title: "Muggy Smart Cup",
    shortDescription:
      "Een interactieve productwebsite voor een slimme beker met geanimeerde storytelling.",
    longDescription:
      "Muggy is een conceptproduct: een slimme beker die reageert op temperatuur en gebruik. Voor dit project werd een interactieve productpagina ontwikkeld die het concept visueel uitlegt via animaties en 3D-visuals. De website combineert storytelling, motion design en interactieve elementen om het product op een aantrekkelijke manier te presenteren.",

    process:
      "Het ontwerp werd eerst uitgewerkt als een storytelling-ervaring waarbij de gebruiker door de productfeatures wordt geleid. Vervolgens werd de website opgebouwd met interactieve secties en scroll-gebaseerde animaties om de productervaring visueel te versterken.",

    challenge:
      "De uitdaging lag vooral in het combineren van visuele storytelling met een duidelijke informatiestructuur. De animaties moesten het verhaal ondersteunen zonder de leesbaarheid of prestaties van de website te verminderen.",

    image: "/mockups/muggy.png",
    role: "Frontend Developer",
    client: "SchoolProject",
    tags: ["GSAP", "Webflow", "Spline"],
    year: 2025,
    link: "https://muggy.maartencoppens.be/",
    category: "Web Development",
  },

  {
    slug: "onderdruk",
    title: "Onderdruk",
    shortDescription:
      "Een interactieve museuminstallatie waarbij fysieke interactie digitale visualisaties aanstuurt.",
    longDescription:
      "OnderDruk is een interactieve installatie ontwikkeld voor het Huis van Kina in Gent. Bezoekers kunnen fysiek interageren met de installatie, waarna sensoren en een backend systeem realtime digitale visualisaties aansturen. Het project combineert fysieke hardware, een Node.js backend en realtime communicatie tussen verschillende systemen.",

    process:
      "De installatie werd ontwikkeld als een combinatie van hardware en software. Sensorinput wordt via een server verwerkt en doorgestuurd naar de visualisatie. De backend fungeert als centrale hub die de communicatie tussen de fysieke installatie en de digitale visualisatie verzorgt.",

    challenge:
      "De grootste uitdaging was het synchroniseren van hardware-input met realtime digitale output. Omdat bezoekers direct feedback verwachten van een interactieve installatie, moest de communicatie tussen de verschillende systemen snel en betrouwbaar verlopen.",

    image: "/mockups/onderdruk.png",
    role: "Backend Developer",
    client: "SchoolProject / Huis van Kina Gent",
    tags: ["Express", "Raspberry Pi", "Websocket"],
    year: 2025,
    category: "Internet Of Things",
  },

  {
    slug: "hogwarts",
    title: "Hogwarts 3D Map",
    shortDescription:
      "Een interactieve 3D kaart van Hogwarts met explore-functionaliteit en animaties.",
    longDescription:
      "Dit project is een interactieve 3D kaart van Hogwarts waarin gebruikers verschillende locaties kunnen verkennen. De omgeving wordt weergegeven in realtime 3D en bevat interactieve hotspots die extra informatie of interacties tonen.",

    process:
      "De 3D omgeving werd opgebouwd met modellen uit Blender die vervolgens werden geïntegreerd in een webapplicatie. Interactieve elementen zoals hotspots en camera-animaties werden toegevoegd om gebruikers door de omgeving te laten navigeren.",

    challenge:
      "De grootste uitdaging was het optimaliseren van de 3D scene zodat deze soepel in de browser blijft draaien. Omdat 3D assets vaak zwaar zijn, moest er aandacht worden besteed aan performance en asset-optimalisatie.",

    image: "/mockups/hogwarts.png",
    role: "Frontend Developer / 3D Artist",
    client: "Schoolproject",
    tags: ["Three.js", "Blender", "GSAP"],
    year: 2026,
    link: "https://hogwarts.maartencoppens.be/",
    category: "Creative Technology",
  },

  // {
  //   slug: "audioreactive-visual",
  //   title: "Audioreactive Visual",
  //   shortDescription:
  //     "Een realtime visualisatie die reageert op muziek en audio-input.",
  //   longDescription:
  //     "Dit project is een audioreactieve visualisatie waarbij visuele elementen realtime reageren op muziek. De visuals veranderen dynamisch op basis van audiofrequenties en worden aangestuurd via een interactieve pipeline tussen verschillende softwarecomponenten.",

  //   process:
  //     "De visuals werden ontwikkeld in TouchDesigner waar verschillende nodes audiofrequenties analyseren en omzetten naar visuele parameters. Via een websocket verbinding kan externe input worden doorgestuurd naar de visualisatie.",

  //   challenge:
  //     "De grootste uitdaging was het vertalen van audio-data naar visueel interessante patronen. Omdat audiofrequenties constant veranderen, moest de visualisatie zo worden opgebouwd dat deze dynamisch blijft zonder chaotisch te worden.",

  //   image: "/image.jpg",
  //   role: "Creative Developer",
  //   client: "Schoolproject",
  //   tags: ["Touchdesigner", "Websocket"],
  //   year: 2026,
  //   category: "Creative Technology",
  // },
];

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
