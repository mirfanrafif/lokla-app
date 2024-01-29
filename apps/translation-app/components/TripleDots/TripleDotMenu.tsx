'use client';

import React, { useState } from 'react';

import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TripleDotMenu = (props: {
  menus: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
}) => {
  const [isShowMenu, setisShowMenu] = useState(false);

  return (
    <div>
      <button
        className="relative w-6 h-6"
        onClick={() => setisShowMenu(!isShowMenu)}
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />

        {isShowMenu && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
            {props.menus.map((menu, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setisShowMenu(false);
                  menu.onClick();
                }}
                disabled={menu.disabled}
              >
                {menu.label}
              </button>
            ))}
          </div>
        )}
      </button>
    </div>
  );
};

export default TripleDotMenu;
