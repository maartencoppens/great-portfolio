import { Project } from "@/types/types";

export const projects: Project[] = [
  // {
  //   slug: "foodkiosk-frontend",
  //   title: "Subway Foodkiosk Frontend",
  //   shortDescription:
  //     "An interactive kiosk interface for building and ordering sandwiches.",
  //   longDescription:
  //     "This project is the frontend for a self-service food kiosk inspired by Subway. Users can build their own sandwich through an intuitive multi-step interface, including choices for bread, toppings, and sauces. The interface is designed to work quickly and clearly on a kiosk screen, with a focus on usability, clear visual feedback, and a streamlined ordering experience.",

  //   process:
  //     "The project started with a full design process in Figma, mapping the complete kiosk flow from the start screen to the order summary. The design was then translated step by step into a frontend application with a component-based structure. The interface was built from reusable UI components and multiple pages that together form the full ordering experience.",

  //   challenge:
  //     "The biggest challenge was creating a clear and intuitive flow for users who want to build their order quickly. Because kiosk interfaces are often used under time pressure, the navigation had to remain simple while still supporting many choices.",

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
  //     "A backend API for managing menu items, orders, and food kiosk configurations.",
  //   longDescription:
  //     "This project is the backend for a food kiosk application. The server manages menu items, orders, and product configurations through a REST API. The backend was built with Node.js and Express and uses a PostgreSQL database to store products, toppings, and orders.",

  //   process:
  //     "The backend was developed using a structured API architecture where routes, services, and database logic are separated. The data model was designed first, followed by endpoints for retrieving products, building orders, and storing order data.",

  //   challenge:
  //     "The biggest challenge was designing a flexible data model for sandwich configuration. Since users can create many different combinations of bread, toppings, and sauces, the database had to be structured to store and retrieve these variations efficiently.",

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
      "An interactive 3D configurator that lets users build their own skateboard.",
    longDescription:
      "This project is an interactive 3D configurator that allows users to customize different parts of a skateboard. Through a real-time 3D view, users can experiment with different decks, colors, and components while instantly seeing the visual result.",

    process:
      "The project started with modeling the 3D assets in Blender. These models were then imported into a web application where they could be customized interactively. The configurator was built around a component-based structure, with UI controls directly connected to the 3D scene.",

    challenge:
      "The biggest challenge was combining a smooth user interface with real-time 3D rendering in the browser. It was important to keep the configurator performant while allowing different components to be changed dynamically.",

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
      "An interactive product website for a smart cup with animated storytelling.",
    longDescription:
      "Muggy is a concept product: a smart cup that reacts to temperature and usage. For this project, an interactive product page was developed to explain the concept visually through animations and 3D visuals. The website combines storytelling, motion design, and interactive elements to present the product in an engaging way.",

    process:
      "The design was first developed as a storytelling experience that guides the user through the product features. The website was then built with interactive sections and scroll-based animations to visually enhance the product experience.",

    challenge:
      "The main challenge was combining visual storytelling with a clear information structure. The animations needed to support the story without reducing the website's readability or performance.",

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
      "An interactive museum installation where physical interaction drives digital visualizations.",
    longDescription:
      "OnderDruk is an interactive installation developed for the Huis van Kina in Ghent. Visitors can physically interact with the installation, after which sensors and a backend system control real-time digital visualizations. The project combines physical hardware, a Node.js backend, and real-time communication between different systems.",

    process:
      "The installation was developed as a combination of hardware and software. Sensor input is processed through a server and forwarded to the visualization. The backend acts as a central hub that manages communication between the physical installation and the digital visualization.",

    challenge:
      "The biggest challenge was synchronizing hardware input with real-time digital output. Because visitors expect immediate feedback from an interactive installation, communication between the different systems had to be fast and reliable.",

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
      "An interactive 3D map of Hogwarts with exploration features and animations.",
    longDescription:
      "This project is an interactive 3D map of Hogwarts where users can explore different locations. The environment is rendered in real-time 3D and includes interactive hotspots that reveal extra information or interactions.",

    process:
      "The 3D environment was built with models from Blender, then integrated into a web application. Interactive elements such as hotspots and camera animations were added to guide users through the environment.",

    challenge:
      "The biggest challenge was optimizing the 3D scene so it runs smoothly in the browser. Because 3D assets are often heavy, extra attention had to be given to performance and asset optimization.",

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
  //     "A real-time visualization that reacts to music and audio input.",
  //   longDescription:
  //     "This project is an audio-reactive visualization where visual elements respond to music in real time. The visuals change dynamically based on audio frequencies and are driven through an interactive pipeline between different software components.",

  //   process:
  //     "The visuals were developed in TouchDesigner, where different nodes analyze audio frequencies and convert them into visual parameters. Through a WebSocket connection, external input can be forwarded to the visualization.",

  //   challenge:
  //     "The biggest challenge was translating audio data into visually interesting patterns. Because audio frequencies constantly change, the visualization had to stay dynamic without becoming chaotic.",

  //   image: "/image.jpg",
  //   role: "Creative Developer",
  //   client: "Schoolproject",
  //   tags: ["Touchdesigner", "Websocket"],
  //   year: 2026,
  //   category: "Creative Technology",
  // },
];
