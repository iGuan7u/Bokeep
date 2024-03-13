import { Component, ComponentChild, ComponentChildren, Ref } from "preact";
import Match from 'preact-router/match';

import { Toolbar, Divider } from '@mui/material';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Home, Settings, Storage } from '@mui/icons-material';
import { drawerWidth } from '../static/static';
import Box from '@mui/material/Box';

interface NavDrawerProps {
  onTransitionEnd: () => void;
}

class NavItem {
  icon: JSX.Element;
  text: String;
  isSelected: (index: number, path: String | null) => boolean
  href: String
}

interface NavDrawerState {
  isMobile: boolean;
  items: Array<NavItem>;
  settingItems: Array<NavItem>;
}

class NavDrawer extends Component<NavDrawerProps & DrawerProps, NavDrawerState> {
  constructor() {
    super();
    this.state = {
      isMobile: false,
      items: [{
        icon: <Home />,
        text: "Home",
        isSelected: (index, path) => (index == 0 && (path === "/" || path == null)),
        href: "/"
      }, {
        icon:  <Storage />,
        text: "Datas",
        isSelected: (index, path) => (index == 1 && path === "/db"),
        href: "/db"
      }],
      settingItems: [{
        icon: <Settings />,
        text: "Settings",
        isSelected: (index, path) => (index == 0 && path === "/settings"),
        href: "/settings"
      }]
    };
  }
  render(props?: Readonly<NavDrawerProps & DrawerProps & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<NavDrawerState>, context?: any): ComponentChild {
    const drawer = (
      <div>
        <Toolbar/>
        <Divider />
        <Match>
          {({ matches, path, url }) => <>
            <List>
              {state.items.map((item, index) => (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    href={item.href}
                    selected={item.isSelected(index, path)}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            { state.settingItems.length != 0 && <Divider /> }
            <List>
              {state.settingItems.map((item, index) => (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    href={item.href}
                    selected={item.isSelected(index, path)}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>}
        </Match>
      </div>
    );
    const container = window !== undefined ? () => window.document.body : undefined;
    return <Box
      component="nav"
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant="temporary"
        open={props.open}
        onClose={props.onClose}
        onTransitionEnd={props.onTransitionEnd}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>;
  }
}

export default NavDrawer;