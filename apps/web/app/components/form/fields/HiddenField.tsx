import React from 'react';

interface HiddenFieldProps {
  name: string;
  value?: number | string | string[];
  defaultValue?: number | string | string[];
  formId?: string;
}

export function HiddenField({
  name,
  value,
  defaultValue,
  formId,
}: HiddenFieldProps) {
  return (
    <input
      type="hidden"
      name={name}
      aria-label={name}
      value={value}
      defaultValue={defaultValue}
      form={formId}
    />
  );
}
