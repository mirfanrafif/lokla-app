import React from 'react';

import { useForm } from 'react-hook-form';

import { RequestCreateProject } from '../../models/RequestCreateProject';

const CreateProjectPopup = (props: {
  onSubmit: (data: RequestCreateProject) => void;
}) => {
  const form = useForm<RequestCreateProject>({
    mode: 'onChange',
  });

  return (
    <div className="flex flex-col gap-y-6">
      <h1>Create New Project</h1>
      <input
        type="text"
        placeholder="Name"
        {...form.register('name', { required: 'Please input the name' })}
      />
      <input
        type="text"
        placeholder="Identifier"
        {...form.register('identifier', {
          required: 'Please input the identifier',
          pattern: {
            value: /^[a-z-]+$/gm,
            message: 'Please input a valid identifier',
          },
        })}
      />

      <button
        onClick={form.handleSubmit((data) => props.onSubmit(data))}
        className="button"
        disabled={!form.formState.isValid}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateProjectPopup;
