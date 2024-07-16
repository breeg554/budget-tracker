import React from 'react';
import {
  NavLink as RemixNavLink,
  NavLinkProps as RemixNavLinkProps,
} from '@remix-run/react';

export interface NavLinkProps extends RemixNavLinkProps {}

export const NavLink: React.FC<NavLinkProps> = (props) => {
  return <RemixNavLink {...props} />;
};
