import React from "react";
import { Link as RemixLink, LinkProps } from "@remix-run/react";

export const Link: React.FC<LinkProps> = (props) => {
  return <RemixLink {...props} />;
};
