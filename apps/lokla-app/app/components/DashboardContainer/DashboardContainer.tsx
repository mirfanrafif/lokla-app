import React, { useRef } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';

const DashboardContainer = (props: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="flex flex-row justify-between p-4 bg-white shadow-md">
        <IconButton
          aria-label="Sidebar"
          onClick={() => onOpen()}
          ref={buttonRef}
        >
          <HamburgerIcon />
        </IconButton>
      </div>

      <Sidebar isOpen={isOpen} onClose={onClose} />

      <div className="p-4">{props.children}</div>
    </div>
  );
};

export default DashboardContainer;
