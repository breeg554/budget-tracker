import React from "react";
import { CalendarDays } from "lucide-react";
import { IconProps } from "~/icons/icon.types";

export const CalendarIcon: React.FC<IconProps> = (props) => {
  return <CalendarDays {...props} />;
};
