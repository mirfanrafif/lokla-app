import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { NavLink } from '@remix-run/react';

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
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
