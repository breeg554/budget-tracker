import { FormStateInput } from '@conform-to/react';
import React from 'react';
interface FormPersistentStateProps {
  formId?:string
}

export const FormPersistentState:React.FC<FormPersistentStateProps>=({formId})=> {
     return (
       <FormStateInput formId={formId}/>
     );
 }

