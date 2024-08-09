import React from 'react';

import { useDisclosure } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import Navbar from '../Navbar/Navbar';

const DashboardContainer = (props: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Navbar onOpen={onOpen} />

      <Sidebar isOpen={isOpen} onClose={onClose} />

      <div className="p-4">{props.children}</div>
    </div>
  );
};

export default DashboardContainer;
