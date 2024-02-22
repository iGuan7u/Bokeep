import { render, ComponentChild, Component, Attributes, ComponentChildren, Ref } from 'preact';
import Router from 'preact-router';

import { Theme, ThemeProvider, createTheme, AppBar, Toolbar, Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';

import CostRecord from './model/record';
import CreateDialog from './module/create_dialog';
import { addRecord, openIndexedDB } from './utils/indexd_db';
import './style.css';
import Database from './module/database';

interface AppState {
  isModalOpen: boolean;
  theme: Theme;
}

class App extends Component<{}, AppState> {
  constructor() {
    super();
    this.state = {
      isModalOpen: false,
      theme: createTheme({
        typography: {
          fontFamily: [
            "ui-sans-serif",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Helvetica",
            "Apple Color Emoji",
            "Arial",
            "sans-serif",
            "Segoe UI Emoji",
            "Segoe UI Symbol"
          ].join(','),
        },
        palette: {
          primary: {
            main: "#541DAB",
          }
        }
      }),
    };

  }
  handleClose = () => {
    this.setState({
      isModalOpen: false,
    });
  }

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

  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<{}>, context?: any): ComponentChild {
    return <ThemeProvider theme={this.state.theme}>
      <AppBar className="fixed_navigation_bar" position="fixed" sx={{ bgcolor: "white" }} elevation={0}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            News
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="navigation_bar_placeholder"></div>
      <Router>
        <div default path="/"><a href="/db">asdf</a></div>
        <Database path='/db' />
      </Router>
      <CreateDialog
        open={this.state.isModalOpen}
        onFinished={this.handleCreate}
        onClose={this.handleClose}
      >
      </CreateDialog>
      <Fab className={"float_button"} color="primary" aria-label="add" onClick={this.handleClickOpen}>
        <AddIcon />
      </Fab>
    </ThemeProvider>;
  }
}

render(<App />, document.getElementById('app'));
