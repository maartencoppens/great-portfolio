import React from "react";

const ToolIcon = ({ name }: { name: string }) => {
  return (
    <img
      src={`/icons/${name.toLowerCase().trim()}.png`}
      alt={name}
      className="w-l object-contain"
    />
  );
};
export default ToolIcon;
