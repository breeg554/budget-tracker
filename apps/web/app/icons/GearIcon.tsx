import React from "react";
import { GearIcon as RadixGearIcon } from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

export const GearIcon: React.FC<IconProps> = (props) => {
  return <RadixGearIcon {...props} />;
};
