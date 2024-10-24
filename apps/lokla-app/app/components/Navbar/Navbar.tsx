import { HamburgerIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Heading,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import { ResponseLogin } from '../../data/models/ResponseLogin';

const Navbar = (props: { authData: ResponseLogin; onOpen: () => void }) => {
  const { authData: currentUser } = props;

  return (
    <div className="flex flex-row justify-between p-4 bg-white shadow-md sticky top-0 z-50">
      <IconButton aria-label="Sidebar" onClick={props.onOpen}>
        <HamburgerIcon />
      </IconButton>

      <div>
        {currentUser && (
          <Menu>
            <MenuButton>
              <div className="text-right">
                <Heading size={'sm'}>{currentUser.user.fullName}</Heading>
                <Text>{currentUser.user.email}</Text>
              </div>
            </MenuButton>
            <MenuList>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Navbar;
