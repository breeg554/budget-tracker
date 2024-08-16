import React from 'react';
import { useFetcher } from '@remix-run/react';

import { Avatar } from '~/avatar/Avatar';
import { routes } from '~/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu';

interface OrganizationAvatarProps {
  name: string;
}

export const OrganizationAvatar = ({ name }: OrganizationAvatarProps) => {
  const fetcher = useFetcher();

  const onLogout = () => {
    fetcher.submit(null, { action: routes.signOut.getPath(), method: 'post' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar content={name.slice(0, 2)} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[200px] truncate" title={name}>
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
