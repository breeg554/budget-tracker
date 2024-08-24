import React, { useRef } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { FilterIcon } from 'lucide-react';
import { z } from 'zod';

import { IconButton } from '~/buttons/IconButton';
import { Field } from '~/form/Field';
import { TextField } from '~/form/fields';
import { ValidatedForm } from '~/form/ValidatedForm';

interface ReceiptsFilterProps {
  onFilter: (params: Record<string, string | number>) => void;
}

export const ReceiptsFilter = ({ onFilter }: ReceiptsFilterProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [form] = useForm({
    onSubmit: (e, { formData }) => {
      e.preventDefault();

      const search = formData.get('search')?.toString() ?? '';

      onFilter({ search });
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: z.object({ search: z.string().optional() }),
      });
    },
  });

  // todo temp. Remove it
  const onBlur = () => {
    buttonRef.current?.click();
  };

  return (
    <div className="flex justify-between items-center gap-1">
      <ValidatedForm form={form} className="grow">
        <Field name="search">
          <TextField placeholder="Search..." onBlur={onBlur} />
        </Field>

        <button
          ref={buttonRef}
          type="submit"
          className="pointer-events-none opacity-0 hidden"
        />
      </ValidatedForm>

      <IconButton icon={<FilterIcon />} variant="secondary" />
    </div>
  );
};
