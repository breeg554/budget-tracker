import { twMerge } from "tailwind-merge";
import clsx, { ClassValue } from "clsx";

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(args));
};
