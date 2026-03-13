import React from "react";
import SmallInfoCard from "../components/SmallInfoCard";
import Button from "../components/Button";

const Contact = () => {
  return (
    <section className="flex flex-col gap-xl pt-xl">
      <div className="lg:w-1/2">
        <SmallInfoCard content="About Me" />
        <h2 className="pt-s text-section-title font-bold">My Journey</h2>
        <p className="text-body">
          I’m a developer and digital designer focused on crafting modern,
          thoughtful digital experiences through code, design, and creative
          technology.
        </p>
      </div>
      <div className=" mx-auto w-4/5 bg-accent-primary text-text-secondary py-xl flex flex-col gap-l justify-center items-center rounded-2xl">
        <h2 className="text-section-title font-bold">Let's Work Together</h2>
        <p className="w-3/5 text-body">
          I'm always interested in new projects and collaborations. Whether you
          have a question or just want to say hi, feel free to reach out!
        </p>
        <Button
          label="Email Me"
          href="mailto:maartencoppens3@gmail.com"
          variant="tertiary"
        />
      </div>
    </section>
  );
};

export default Contact;
