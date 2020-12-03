import { createMuiTheme } from "@material-ui/core";

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: "#98C09B",
    },
    secondary: {
      main: "#83B399",
    },
  },
  status: {
    danger: "orange",
  },
});

export default Theme;
