import { createMuiTheme } from "@material-ui/core";

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#ff5e00",
    },
  },
  status: {
    danger: "orange",
  },
});
// "#565656"
export default Theme;
