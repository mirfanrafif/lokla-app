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
import { Form, NavLink } from '@remix-run/react';

const Sidebar = (props: { isOpen: boolean; onClose: () => void }) => {
  const { isOpen, onClose } = props;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Lokla</DrawerHeader>

        <DrawerBody>
          <NavLink to={'/app/projects'}>
            <Button w="full" variant="ghost" justifyContent="start">
              Projects
            </Button>
          </NavLink>
        </DrawerBody>
        <DrawerFooter>
          <Form action="/logout" method="post">
            <Button variant="outline" mr={3} onClick={onClose} type="submit">
              Logout
            </Button>
          </Form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
