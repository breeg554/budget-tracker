import React, { PropsWithChildren, ReactNode } from 'react';
import { ClientOnly } from 'remix-utils/client-only';

import { Skeleton } from '~/ui/skeleton';

interface ClientDateProps {
  fallback?: ReactNode;
}

export const ClientDate = ({
  children,
  fallback = <Skeleton className="w-[178px] h-[20px] rounded-2xl" />,
}: PropsWithChildren<ClientDateProps>) => {
  return <ClientOnly fallback={fallback}>{() => children}</ClientOnly>;
};
