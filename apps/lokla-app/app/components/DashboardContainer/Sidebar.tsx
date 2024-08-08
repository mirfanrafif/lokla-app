import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { NavLink } from '@remix-run/react';
import React from 'react';

const Sidebar = (props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose } = props;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Lokla</DrawerHeader>

        <DrawerBody>
          <NavLink to={'/projects'}>
            <Button w="full" variant="ghost" justifyContent="start">
              Projects
            </Button>
          </NavLink>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue">Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
