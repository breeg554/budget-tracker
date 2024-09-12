import React, { useMemo } from 'react';
import {
  Link as RemixLink,
  LinkProps as RemixLinkProps,
  useSearchParams,
} from '@remix-run/react';

import { buildUrlWithParams } from '~/utils/url';

interface LinkProps extends RemixLinkProps {
  withQuery?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, withQuery, ...props }) => {
  const [params] = useSearchParams();

  const url = useMemo(() => {
    if (!withQuery) return to;
    if (typeof to === 'string') {
      return buildUrlWithParams(to, Object.fromEntries(params.entries()));
    }
    return {
      ...to,
      search: `?${params.toString()}`,
    };
  }, [to, withQuery, params]);

  return <RemixLink to={url} {...props} />;
};
