import React from "react";
import SmallInfoCard from "../components/SmallInfoCard";
import Logo from "../components/Logo";
import ExpertiseCard from "../components/ExpertiseCard";
import ToolList from "../components/ToolList";

const About = () => {
  return (
    <section className="flex flex-col gap-xl pt-xl">
      <div className="flex justify-between">
        <div className="w-1/2">
          <SmallInfoCard content="About Me" />
          <h2 className="text-section-title font-bold">My Journey</h2>
          <p className="text-body">
            I’m a developer and digital designer focused on crafting modern,
            thoughtful digital experiences through code, design, and creative
            technology.
          </p>
        </div>
        <Logo />
      </div>
      <div className="py-2xl flex flex-col gap-l">
        <p className="text-body font-bold">My Story</p>
        <p className="text-body">
          My interest in digital creation started with a curiosity about how
          websites and interactive experiences are built. What began as learning
          the fundamentals of web development quickly evolved into a broader
          passion for combining technology, design, and creativity.
        </p>
        <p className="text-body">
          During my studies in interactive media and web development, I
          discovered how powerful the web can be as a medium to build meaningful
          digital experiences. I enjoy the process of turning ideas into
          functional and visually engaging products, whether that means
          developing modern web applications, designing intuitive interfaces, or
          experimenting with interactive technologies.
        </p>
        <p className="text-body">
          Today, I focus on building modern digital experiences that combine
          clean development with thoughtful design. I’m particularly interested
          in the space where development, design, and creative technology meet —
          creating projects that are not only functional, but also engaging and
          interactive.
        </p>
      </div>
      <div>
        <SmallInfoCard content="About Me" />
        <h2 className="text-section-title font-bold">My Expertise</h2>
      </div>
      <div className="grid grid-cols-2 gap-xl gap-y-m">
        <ExpertiseCard title="Web Development" />
        <ExpertiseCard title="Creative Development" />
        <ExpertiseCard title="CMS / No-Code" />
        <ExpertiseCard title="Tools" />
      </div>
      <div className="p-l flex flex-col gap-l justify-center items-center bg-bg-tertiary rounded-2xl">
        <h2 className="text-body-lg text-accent-primary">My Toolbox</h2>
        <ToolList />
      </div>
    </section>
  );
};

export default About;
