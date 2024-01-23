import React, { RefObject } from 'react';

export const useClickOutside = (
  dropdownOpen: boolean,
  refList: RefObject<HTMLElement>[],
  action: () => void,
) => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownOpen &&
      refList.every((item) => !item.current?.contains(event.target as Node))
    ) {
      action();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};
