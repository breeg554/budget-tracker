import React from 'react';

import { FieldError } from '~/form/fields';

import { Field } from './Field';

export const GlobalError = () => {
  return (
    <Field name="global">
      <FieldError />
    </Field>
  );
};
