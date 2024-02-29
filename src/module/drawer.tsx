import { Attributes, Component, ComponentChild, ComponentChildren, Ref } from "preact";
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

class NavDrawer extends Component<NavDrawerProps & DrawerProps, {}> {
  constructor() {
    super();
    this.state = {
    };
  }
  render(props?: Readonly<NavDrawerProps & DrawerProps & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    const drawer = (
      <div>
        <Toolbar />
        <Divider />
        <Match>
        {({ matches, path, url }) => <>
          <List>
            {['Home', 'Datas'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton 
                  selected={(index === 0 && path === "/") || (index === 1 && path === "/db")}
                  onClick={console.log("this")}
                  >
                  <ListItemIcon>
                    {index % 2 === 0 ? <Home /> : <Storage />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Settings'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary={text} />
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