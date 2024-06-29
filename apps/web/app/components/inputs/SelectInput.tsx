import React from "react";
import { Select } from "@radix-ui/themes";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectInputProps
  extends React.ComponentProps<typeof Select.Root> {
  options: SelectOption[];
  contentProps?: Partial<React.ComponentProps<typeof Select.Content>>;
  triggerProps?: Partial<React.ComponentProps<typeof Select.Trigger>>;
}
export const SelectInput: React.FC<SelectInputProps> = ({
  options,
  value,
  defaultValue,
  contentProps,
  triggerProps,
  ...rest
}) => {
  return (
    <Select.Root value={value} defaultValue={defaultValue} {...rest}>
      <Select.Trigger {...triggerProps} />
      <Select.Content {...contentProps}>
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
