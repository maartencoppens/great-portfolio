import React from "react";
import Button from "./Button";

const Navbar = () => {
  return (
    <nav className="w-full flex flex-row justify-between items-center py-l px-xl mx-auto fixed top-0 left-0 right-0 z-10">
      <a href="/">
        <h1 className="text-2xl font-bold">Maarten Coppens</h1>
      </a>
      <ul className="flex flex-row text-body gap-xl">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About Me</a>
        </li>
        <li>
          <a href="/projects">Projects</a>
        </li>
      </ul>
      <Button label="Contact" href="/contact" variant="primary" />
    </nav>
  );
};

export default Navbar;
