import React from 'react';
import { FormStateInput } from '@conform-to/react';

interface FormPersistentStateProps {
  formId?: string;
}

export const FormPersistentState: React.FC<FormPersistentStateProps> = ({
  formId,
}) => {
  return <FormStateInput formId={formId} />;
};
