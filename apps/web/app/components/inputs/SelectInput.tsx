import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectInputProps extends React.ComponentProps<typeof Select> {
  options: SelectOption[];
  contentProps?: Partial<React.ComponentProps<typeof SelectContent>>;
  triggerProps?: Partial<React.ComponentProps<typeof SelectValue>>;
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
    // <Select.Root value={value} defaultValue={defaultValue} {...rest}>
    //   <Select.Trigger {...triggerProps} />
    //   <Select.Content {...contentProps}>
    //     {options.map((option) => (
    //       <Select.Item key={option.value} value={option.value}>
    //         {option.label}
    //       </Select.Item>
    //     ))}
    //   </Select.Content>
    // </Select.Root>

    <Select value={value} defaultValue={defaultValue} {...rest}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" {...triggerProps} />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
