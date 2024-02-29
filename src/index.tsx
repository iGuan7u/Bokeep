import { render, ComponentChild, Component, Attributes, ComponentChildren, Ref } from 'preact';
import Router from 'preact-router';

import { ThemeProvider, AppBar, Toolbar, Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import './style.css';
import mainTheme from './static/theme';
import { drawerWidth} from './static/static';
import CostRecord from './model/record';
import CreateDialog from './module/create_dialog';
import NavDrawer from './module/drawer';
import { addRecord, openIndexedDB } from './utils/indexd_db';
import Database from './module/database';
import Match from 'preact-router/match';

interface AppState {
  isModalOpen: boolean;
  mobileOpen: boolean;
  isClosing: boolean;
}

class App extends Component<{}, AppState> {
  constructor() {
    super();
    this.state = {
      isModalOpen: false,
      mobileOpen: false,
      isClosing: false,
    };
  }
  handleClose = () => {
    this.setState({
      isModalOpen: false,
    });
  }

  handleDrawerClose = () => {
    this.setState({
      isClosing: true,
      mobileOpen: false,
    });
  };

  handleDrawerToggle = () => {
    if (!this.state.isClosing) {
      this.setState({
        mobileOpen: !this.state.mobileOpen,
      });
    }
  };


  handleClickOpen = () => {
    this.setState({
      isModalOpen: true,
    });
  }

  handleCreate = async (record: CostRecord) => {
    const db = await openIndexedDB('cost_record');
    await addRecord(record, db);
    db.close();
  }

  handleDrawerTransitionEnd = () => {
    this.setState({
      isClosing: false,
    });
  };


  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    return <ThemeProvider theme={mainTheme}>
      <AppBar 
        className="fixed_navigation_bar" 
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }} 
        elevation={0}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            onClick={this.handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }}}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ color: "black" }}>
            <Match>{({ matches, path, url }) => <div>{path == "/" ? "Home" : "Datas" }</div>}</Match>
          </Typography>
        </Toolbar>
      </AppBar>
      <NavDrawer
        open={this.state.mobileOpen}
        onTransitionEnd={this.handleDrawerTransitionEnd}
        onClose={this.handleDrawerClose}
        />
      <Box
        component="main"
        sx={{
          marginLeft: { sm: `${drawerWidth}px` }
        }}
      >
        <div className="navigation_bar_placeholder"></div>
        <Router>
          <div default path="/"><a href="/db">asdf</a></div>
          <Database path='/db' />
        </Router>
      </Box>
      <CreateDialog
        open={this.state.isModalOpen}
        onFinished={this.handleCreate}
        onClose={this.handleClose}
      />
      <Fab className={"float_button"} color="primary" aria-label="add" onClick={this.handleClickOpen}>
        <AddIcon />
      </Fab>
    </ThemeProvider>;
  }
}

render(<App />, document.getElementById('app'));
