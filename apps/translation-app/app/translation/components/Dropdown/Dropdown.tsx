'use client';

import React, { useRef } from 'react';

import classNames from 'classnames';
import { UseFormRegisterReturn } from 'react-hook-form';

import { useClickOutside } from '@apps/translation-app/hooks/clickoutside.hooks';

type Props = {
  formRegister?: UseFormRegisterReturn;
  options: {
    label: string;
    value: string;
  }[];
  onSelectItem?: (value: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Dropdown = (props: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = React.useState('');

  useClickOutside(isOpen, [inputRef, popupRef], () => setIsOpen(false));

  return (
    <div className="relative">
      <input
        type="text"
        {...props}
        className={classNames('w-full', props.className)}
        ref={inputRef}
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="absolute z-10 top-[calc(100%+8px)] bg-white rounded-lg  w-full p-2"
          ref={popupRef}
        >
          <input
            type="text"
            className="w-full p-2 border-b-2 border-neutral-100 mb-2"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <div className="max-h-[200px] overflow-y-auto ">
            {props.options
              .filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase()),
              )
              .map((option) => (
                <div
                  key={option.value}
                  className="p-2 hover:bg-neutral-100 rounded-lg"
                  onClick={() => {
                    setIsOpen(false);
                    setSearch('');
                    props.onSelectItem?.(option.value);
                  }}
                >
                  {option.label}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
