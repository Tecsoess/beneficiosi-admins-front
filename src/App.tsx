import { BrowserRouter as Router, Redirect, Switch, useHistory } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import Routes from "./Routes";
import Login from "./pages/Login";
import { useAuth } from "./contexts/AuthContext";
import { LinearProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import PublicRoute from "./components/Routes/PublicRoute";


import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';


function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const App = () => {

  const { customLoading, customAlert, setCustomAlert } = useAuth();

  const [dots, setDots] = useState("");

  const history = useHistory();

  useEffect(() => {

    let id: any;

    if (customLoading?.show) {
      id = setInterval(() => {
        setDots((oldDots) => oldDots.length < 3 ? oldDots + "." : "");
      }, 500);
    }

    return () => {
      if (id) clearInterval(id);
    }
  }, [customLoading]);

  useEffect(() => {
    history?.listen((location, action) => {
      document?.querySelector('body')?.scrollTo(0, 0)
    });
  }, [history]);

  const handleClose = () => {
    setCustomAlert?.({ show: false, message: "", severity: "success" });
  }

  return <>
    {
      customLoading?.show ?
        <div className="spinner-container">
          <div className="m-auto">
            <div className="spinner">
              <div className="double-bounce1"></div>
              <div className="double-bounce2"></div>
            </div>
            <div className="text-gray-700 text-2xl">{customLoading?.message}{dots}</div>
          </div>

        </div>
        :
        null
    }

    <Snackbar anchorOrigin={{ horizontal: "left", vertical: "bottom" }} open={customAlert?.show} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={customAlert?.severity}>
        {customAlert?.message}
      </Alert>
    </Snackbar>


    <Router>
      <Switch>
        <Redirect path="/" to={'/dashboard'} exact />
        <PublicRoute path="/login" component={Login} exact />
        <AppLayout>
          <Routes />
        </AppLayout>
      </Switch>
    </Router>
  </>;
};

export default App;
