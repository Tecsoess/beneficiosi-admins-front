import { createMuiTheme } from "@material-ui/core";
import { esES } from "@material-ui/core/locale";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#F04141',
      contrastText: '#FFF',
    },
    info: {
      main: '#4285F4',
      contrastText: '#FFF',
    },
    warning: {
      main: '#FDBC15',
      contrastText: '#FFF',
    },
    success: {
      main: '#09CE87',
      contrastText: '#FFF',
    },
  }
}, esES);

export default theme;
