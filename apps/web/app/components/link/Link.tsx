import React from 'react';
import { LinkProps, Link as RemixLink } from '@remix-run/react';

export const Link: React.FC<LinkProps> = (props) => {
  return <RemixLink {...props} />;
};
