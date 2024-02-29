import createTheme from "@mui/material/styles/createTheme";

const mainTheme = createTheme({
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
      main: "#742D90",
    }
  }
});

export default mainTheme;