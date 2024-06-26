import { Box, Button } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Attributes, Component, ComponentChild, ComponentChildren, Ref, type JSX } from "preact";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SyncService from "./sync";

interface ISettingState {
  serverAddress?: string
  serverToken?: string
  serverUserName?: string
  toastShown: boolean,
  snackBarShown: boolean,
  verifyResult: boolean,
};

interface IVerifyResult {
  ret: number
};

interface IUserInfoResult {
  ret: number
  id: string
}

const serverAddressId = "setting_server_address";
const serverTokenId = "setting_server_token";
const serverUserNameId = "sever_user_name";

class Setting extends Component<{}, ISettingState> {
  componentWillMount(): void {
    this.setState({
      toastShown: false,
      serverAddress: window.localStorage.getItem("SETTING_SERVER_ADDRESS"),
      serverToken: window.localStorage.getItem("SETTING_SERVER_TOKEN"),
      serverUserName: window.localStorage.getItem("SETTING_SERVER_USER_NAME"),
    });

  }

  onButtonClick = async () => {
    this.setState({
      toastShown: true,
    });
    const serverAddressDOM = document.getElementById(serverAddressId) as HTMLInputElement;
    const serverAddress = serverAddressDOM.value;
    const serverToken = (document.getElementById(serverTokenId) as HTMLInputElement).value;
    const serverUserName = (document.getElementById(serverUserNameId) as HTMLInputElement).value;
    if (serverAddress == null || serverToken == null || serverUserName == null) {
      return;
    }
    try {
      // const result = await fetch(`${window.location.protocol}//${serverAddress}`, {
      const result = await fetch(`https://${serverAddress}/verify`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${serverToken}`
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      }) as IVerifyResult;
      this.setState({
        snackBarShown: true,
        toastShown: false,
        verifyResult: result.ret == 0,
      });
      if (result.ret == 0) {
        this.setState({
          serverAddress: serverAddress,
          serverToken: serverToken,
        });
        window.localStorage.setItem("SETTING_SERVER_ADDRESS", serverAddress);
        window.localStorage.setItem("SETTING_SERVER_TOKEN", serverToken);
        this.loadUserInfo(serverUserName);
      }
    } catch (error) {
      this.setState({
        snackBarShown: true,
        toastShown: false,
        verifyResult: false,
      });
    }
  }

  loadUserInfo = async (serverUserName: string) => {
    const result = await fetch(`https://${this.state.serverAddress}/user/${serverUserName}`, {
      headers: {
        Authorization: `Token ${this.state.serverToken}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }) as IUserInfoResult;
    if (result.ret == 0 && result.id.length != 0) {
      window.localStorage.setItem("SETTING_SERVER_USER_NAME", serverUserName);
      window.localStorage.setItem("SETTING_SERVER_USER_ID", result.id);
      this.setState({
        serverUserName: serverUserName
      });
    }
  }

  delayedAction(delayInMs) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Action after delay');
        resolve();
      }, delayInMs);
    });
  }

  handleSnackBarClose = (event?: Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      snackBarShown: false,
    })
  }

  render(props?: Readonly<Attributes & { children?: ComponentChildren; ref?: Ref<any>; }>, state?: Readonly<ISettingState>, context?: any): ComponentChild {
    return <Box className="setting_cnt">
      <Box className="textfield_cnt">
        <TextField
          label="Sever Address"
          id={serverAddressId}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">{window.location.protocol}//</InputAdornment>,
          }}
          value={this.state.serverAddress}
        />
      </Box>
      <Box className="textfield_cnt">
        <TextField
          label="Sever Token"
          id={serverTokenId}
          fullWidth
          value={this.state.serverToken}
        />
      </Box>
      <Box className="textfield_cnt">
        <TextField
          label="User Name"
          id={serverUserNameId}
          fullWidth
          value={this.state.serverUserName}
        />
      </Box>
      <Box className="button_cnt flex-cnt flex-cnt-jce">
        <Button variant="contained" onClick={this.onButtonClick}>Save</Button>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={state.toastShown}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={state.snackBarShown} autoHideDuration={6000} onClose={this.handleSnackBarClose}>
        <Alert
          onClose={this.handleSnackBarClose}
          severity={state.verifyResult ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          Verify {state.verifyResult ? "Success" : "Fail"}
        </Alert>
      </Snackbar>
    </Box>
  }
}

export default Setting;