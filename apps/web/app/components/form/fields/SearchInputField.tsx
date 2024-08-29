import React from 'react';
import { getInputProps } from '@conform-to/react';

import { SearchInput, SearchInputProps } from '~/inputs/SearchInput';

import { useField } from '../Field';

export const SearchField = (props: SearchInputProps) => {
  const field = useField();

  return (
    <SearchInput
      {...getInputProps(field, { type: 'text' })}
      id={field.name}
      {...props}
    />
  );
};
