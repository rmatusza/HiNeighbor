import { createMuiTheme } from "@material-ui/core";

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: "#565656",
    },
    secondary: {
      main: "#76323F",
    },
  },
  status: {
    danger: "orange",
  },
});

export default Theme;
