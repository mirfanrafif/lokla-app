import React, { useMemo } from 'react';

import { Locales } from '@constants/locales';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Controller, useForm } from 'react-hook-form';

import { getLocaleLabel } from '../../helpers';
import { RequestCreateProject } from '../../models/RequestCreateProject';
import Dropdown from '../Dropdown/Dropdown';

const CreateProjectPopup = (props: {
  onSubmit: (data: RequestCreateProject) => void;
}) => {
  const form = useForm<RequestCreateProject>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      identifier: '',
      defaultLanguage: '',
      languages: [],
    },
  });

  const countryList = useMemo(() => {
    return Locales.map((item) => ({
      label: `${item.name} (${item.code})`,
      value: item.code.toLowerCase(),
    }));
  }, []);

  return (
    <div className="flex flex-col gap-y-6 w-[500px]">
      <h1>Create New Project</h1>

      <label htmlFor="name">Project Name</label>
      <input
        type="text"
        placeholder="Type here..."
        {...form.register('name', { required: 'Please input the name' })}
      />

      <label htmlFor="identifier">Identifier</label>
      <input
        type="text"
        placeholder="Type here..."
        {...form.register('identifier', {
          required: 'Please input the identifier',
          pattern: {
            value: /^[a-z-]+$/gm,
            message: 'Please input a valid identifier',
          },
        })}
      />

      <label htmlFor="defaultLanguage">Default Language</label>
      <div>
        <Controller
          control={form.control}
          name="defaultLanguage"
          render={({ field }) => (
            <div>
              <Dropdown
                placeholder="Select item below or type custom language..."
                options={countryList}
                value={field.value}
                onSelectItem={(value) => field.onChange(value)}
                onChange={(e) => field.onChange(e.target.value)}
              />

              <p className="text-sm mt-2 text-neutral-500">
                Base Language: {field.value && getLocaleLabel(field.value)}
              </p>
            </div>
          )}
        />
      </div>

      <Controller
        control={form.control}
        name="languages"
        render={({ field }) => (
          <div>
            <Dropdown
              placeholder="Target Languages (Press Enter to add custom languages)"
              options={countryList}
              onSelectItem={(value) => {
                field.onChange([...field.value, value]);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  field.onChange([...field.value, e.currentTarget.value]);
                  e.currentTarget.value = '';
                }
              }}
            />

            <div className="flex flex-row gap-x-2 gap-y-2 mt-2">
              {field.value.map((item, index) => (
                <div
                  key={index}
                  className="bg-neutral-100 rounded-lg p-2 text-sm"
                >
                  {getLocaleLabel(item)}
                  <FontAwesomeIcon
                    icon={faClose}
                    className="ml-2"
                    onClick={() => {
                      field.onChange(field.value.filter((_, i) => i !== index));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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
