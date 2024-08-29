import React from 'react';

import { IconButton } from '~/buttons/IconButton';
import { CrossIcon } from '~/icons/CrossIcon';
import { SearchIcon } from '~/icons/SearchIcon';
import { TextInput, TextInputProps } from '~/inputs/TextInput';
import { cn } from '~/utils/cn';

export interface SearchInputProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ size, className, onClear, value, ...rest }, ref) => {
    return (
      <div className="relative grow">
        <SearchIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-muted-foreground" />
        <TextInput
          ref={ref}
          value={value}
          className={cn('pl-8 pr-6', className)}
          size={size}
          {...rest}
        />

        <IconButton
          icon={<CrossIcon />}
          size="xxs"
          variant="ghost"
          type="button"
          aria-hidden={!value}
          onClick={onClear}
          className={cn('absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4', {
            hidden: !value || !onClear,
          })}
        />
      </div>
    );
  },
);
