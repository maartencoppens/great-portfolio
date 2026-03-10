import React from "react";
import ToolIcon from "./ToolIcon";

const ToolList = () => {
  return (
    <div className="flex flex-wrap gap-l pt-m">
      <ToolIcon name="arduino" />
      <ToolIcon name="blender" />
      <ToolIcon name="figma" />
      <ToolIcon name="react" />
      <ToolIcon name="touchdesigner" />
      <ToolIcon name="unreal-engine" />
      <ToolIcon name="webflow" />
      <ToolIcon name="wordpress" />
    </div>
  );
};

export default ToolList;
