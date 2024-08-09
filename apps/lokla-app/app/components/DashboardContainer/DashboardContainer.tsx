import React, { useRef } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure, Text, Heading } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { useGetCurrentUser } from '../../usecases/GetCurrentUserUseCase';

const DashboardContainer = (props: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { data: currentUser } = useGetCurrentUser();

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <div className="flex flex-row justify-between p-4 bg-white shadow-md sticky top-0 z-50">
        <IconButton
          aria-label="Sidebar"
          onClick={() => onOpen()}
          ref={buttonRef}
        >
          <HamburgerIcon />
        </IconButton>

        <div>
          {currentUser && (
            <div className="text-right">
              <Heading size={'sm'}>{currentUser.user.fullName}</Heading>
              <Text>{currentUser.user.email}</Text>
            </div>
          )}
        </div>
      </div>

      <Sidebar isOpen={isOpen} onClose={onClose} />

      <div className="p-4">{props.children}</div>
    </div>
  );
};

export default DashboardContainer;
