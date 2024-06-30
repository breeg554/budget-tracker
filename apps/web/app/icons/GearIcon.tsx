import React from "react";
import { Settings } from "lucide-react";
import { IconProps } from "~/icons/icon.types";

export const GearIcon: React.FC<IconProps> = (props) => {
  return <Settings {...props} />;
};
