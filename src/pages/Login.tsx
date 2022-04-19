import { Box, Button, Checkbox, CssBaseline, Grid, FormControlLabel, IconButton, makeStyles, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import womenShopping from "../assets/images/women-shopping.png";
import { useAuth } from "../contexts/AuthContext";
import { isEmail, isRequired, validate } from "../helpers/formsValidations";
import useAxios from "../hooks/useAxios";
import CloseIcon from '@material-ui/icons/Close';



type SylesProps = {
  leftSideBg: string;
};

const useStyles = makeStyles(theme => ({

  leftSideLogo: {
    width: theme.spacing(23),
    height: theme.spacing(23),
  },
  rightSideLogo: {
    display: 'inline-block',
    width: theme.spacing(10),
    height: theme.spacing(10),
  },


}));

const Login = () => {
  const classes = useStyles({ leftSideBg: womenShopping });
  const { setAuthInfo, setLoading } = useAuth();
  const history = useHistory();

  const [loginFormData, setLoginFormData] = useState({ email: '', password: '', save: false });

  const [actualError, setActualError] = useState(false);

  const [errorsForm, setErrorsForm] = useState<{ email: null | string, password: null | string }>({ email: null, password: null });

  const [{ data, error, loading }, login] = useAxios({ url: "/auth/login-admin", method: "POST" }, { manual: true });

  const handleSubmit = (e: any) => {

    e.preventDefault();
    if (errorsForm.email || errorsForm.password) {
      return;
    }

    if (actualError) {
      setActualError(false);
    }

    login({ data: loginFormData });
  }

  useEffect(() => {
    if (data) {
      console.log(data);
      setAuthInfo?.({ isAuthenticated: true, user: data.user, token: data.accessToken });
      history.push('/dashboard')
    }

    if (error) {
      setActualError(true);
    }
  }, [data, error])

  useEffect(() => {
    setLoading?.({ show: loading, message: "Iniciando Sesión" });
  }, [loading])

  useEffect(() => {
    setErrorsForm({
      email: validate(loginFormData.email, [
        { validator: isRequired, errorMessage: "el email no puede estar vacio" },
        { validator: isEmail, errorMessage: "tiene que ser un email valido." }
      ]),
      password: validate(loginFormData.password, [
        { validator: isRequired, errorMessage: "la contraseña es requerida." }
      ]),
    })
  }, [loginFormData])

  const handleChange = (e: any) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  }

  const handleCloseAlert = () => {
    setActualError(false);
  }

  return <Box maxHeight="100vh" maxWidth="100vw">
    <CssBaseline />
    <Grid container>
      <Grid item md={6}>
        <Box height="100vh" style={{ background: `url(${womenShopping})`, backgroundSize: '100% 100%', backgroundRepeat: 'none' }}>
          <Box height="100%" bgcolor="rgba(0,0,0, .5)">
            <Box textAlign="center" pt={"15%"}>
              <img src={logo} alt="Beneficio Si" className={classes.leftSideLogo} />
              <Box component="h1" color="white" fontSize="30px">Beneficio Si</Box>
              <Box component="p" color="white" fontSize="20px">La mejor plataforma para hacer crecer tus ventas.</Box>
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item md={6} style={{ position: "relative" }}>
        <Box py={5} px={10} height="100vh">
          <Box display="flex" mb={5} alignItems="center" justifyContent="center">
            <img src={logo} alt="Beneficio Si" className={classes.rightSideLogo} />
            <Box component="h2" ml="10px">
              Login Administrador
            </Box>
          </Box>
          <Box textAlign="center" mb={5} component="h1" borderBottom="1px solid red">
            Login Administrador
          </Box>

          {
            actualError ?
              <Box bgcolor="red" borderRadius="10px" p={1} color="white" mb={5} display="flex" justifyContent="space-between" alignItems="center">
                {error?.response?.data.message}
                <IconButton style={{ color: "white" }} onClick={handleCloseAlert}>
                  <CloseIcon />
                </IconButton>
              </Box>
              :
              null
          }


          <form onSubmit={handleSubmit}>
            <Box mb={5}>
              <TextField
                error={errorsForm.email ? true : false}
                helperText={
                  errorsForm.email ?
                    <Box component="p" color="red">{errorsForm.email}</Box>
                    :
                    null
                }
                onChange={handleChange}
                name="email"
                label="Correo electronico"
                fullWidth id="email"
                variant="outlined"
                placeholder="john@gmail.com" />
            </Box>

            <Box mb={5}>
              <TextField
                error={errorsForm.password ? true : false}
                helperText={
                  errorsForm.password ?
                    <Box component="p" color="red">{errorsForm.password}</Box>
                    :
                    null
                }
                onChange={handleChange}
                name="password"
                fullWidth
                label="Contraseña"
                type="password"
                id="password"
                variant="outlined"
                placeholder="********" />
            </Box>

            <Box mb={5}>
              <FormControlLabel
                control={<Checkbox checked={loginFormData.save} onChange={handleChange} color="primary" name="save" />}
                label="Recuerdame"
                name="save"
              />
            </Box>

            <Box mb={5} textAlign="center">
              <Button variant="contained" color="primary" type="submit">Iniciar Sesión</Button>
            </Box>
            <Box mb={5} textAlign="center">
              <Link to={'/login'}>
                He olvidado mi contraseña
              </Link>
            </Box>
          </form>
        </Box>
        <Box component="p" position="absolute" right="2%" bottom="0">
          &copy; 2021 <strong>Beneficio Si</strong>. Todos los derechos reservados. Diseñado por TECSOES
        </Box>
      </Grid>
    </Grid>
  </Box>;
};

export default Login;
