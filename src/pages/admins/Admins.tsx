import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Box,
  Grid,
  makeStyles
} from "@material-ui/core";

import { Link } from "react-router-dom";

import Pagination from '../../components/Pagination';

import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import clsx from "clsx";
import { useEffect, useState } from "react";
import { isEmail, isRequired, validate } from "../../helpers/formsValidations";
import useAdmins from "../../hooks/useAdmins";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../hooks/useAxios";
import useUserStatus from "../../hooks/useUserStatus";


const useStyles = makeStyles(theme => ({
  pageTilte: {
    color: theme.palette.grey[500],
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
  },

  mlAuto: {
    marginLeft: 'auto'
  },

  textSuccess: {
    color: theme.palette.success.main
  },

  textPrimary: {
    color: theme.palette.primary.main
  },

  textWarning: {
    color: theme.palette.info.main
  },

  redBar: {
    background: theme.palette.primary.main,
    minHeight: '50px',
    borderRadius: '5px 5px 0px 0px'
  },

  redBar2: {
    background: theme.palette.primary.main,
    minHeight: '50px',
    borderRadius: '5px 5px 0px 0px',
    padding: '10px 15px',
    color: 'white',
    margin: 0
  },

  actionCell: {
    whiteSpace: 'nowrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    }
  },
}));


const Admins = () => {

  const classes = useStyles();

  const { setLoading, setCustomAlert } = useAuth();

  const [{ admins, total, error, loading, numberOfPages }, getAdmins] = useAdmins({ options: { useCache: false } });
  const [{ userStatus, error: userStatusError }, getUserStatus] = useUserStatus({ options: { manual: true } });

  const [{ data: createData, error: createError, loading: createLoading }, createAdmin] = useAxios({ method: "POST", url: 'admins' }, { manual: true });

  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '' });

  const [filters, setFilters] = useState({ id: null, name: "", email: "", userStatusCode: null, phoneNumber: "" });
  const [isFilters, setIsFilters] = useState(false);

  const [activePage, setActivePage] = useState(1);

  const [errorsForm, setErrorsForm] = useState<{ name: null | string, email: null | string, password: null | string }>({ name: null, email: null, password: null });

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando datos" });
    Promise.all([getAdmins(), getUserStatus()]).then((values) => {
      setLoading?.({ show: false, message: "" });
    })
  }, []);


  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (createError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, createError]);

  useEffect(() => {
    if (createData) {
      getAdmins().then(() => {
        setCustomAlert?.({ show: true, message: `Se ha creado el administrador exitosamente.`, severity: "success" });
        setAdminFormData({ name: "", email: "", password: "" });
      });
    }
  }, [createData]);

  useEffect(() => {
    setErrorsForm({
      name: validate(adminFormData.name, [
        { validator: isRequired, errorMessage: "el nombre es Obligatorio." },
      ]),
      email: validate(adminFormData.email, [
        { validator: isRequired, errorMessage: "el email es Obligatorio." },
        { validator: isEmail, errorMessage: "el email debe de ser un email valido." },
      ]),
      password: validate(adminFormData.password, [
        { validator: isRequired, errorMessage: "La contraseña es obligatoria." }
      ])
    })
  }, [adminFormData]);

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando" });
    getAdmins({
      params: {
        page: activePage
      }
    }).then(() => {
      setLoading?.({ show: false, message: "" });
    });
  }, [activePage])

  const handleChange = (e: any) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
  }

  const handleFiltersChange = (e: any) => {
    setFilters((oldFilters) => {
      if (e.target.name !== "page") {
        return {
          ...oldFilters,
          [e.target.name]: e.target.value,
          page: 1
        }
      }
      return {
        ...oldFilters,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handleClearFilters = async () => {
    setFilters({ id: null, name: "", email: "", userStatusCode: null, phoneNumber: "" });
    setLoading?.({ show: true, message: "Eliminando Filtros" })
    await getAdmins();
    setLoading?.({ show: false, message: "" })
    setIsFilters(false);
  }

  const handleClick = async () => {
    setLoading?.({ show: true, message: "Filtrando Administradores" })
    await getAdmins({ params: filters });
    setLoading?.({ show: false, message: "" })
    setIsFilters(true);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }
    setLoading?.({ show: true, message: "Creando usuario" });
    await createAdmin({ data: adminFormData });
    setLoading?.({ show: false, message: "" });
  }

  const handlePageChange = (e: any) => {
    setActivePage(e)
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <SupervisorAccountIcon style={{ fontSize: '40px' }} />
          <h1>Administradores</h1>
        </div>
      </Box>

      <Box>
        <Grid container alignItems="baseline" spacing={2}>
          <Grid item xs={8}>
            <Paper elevation={0}>
              <div className={classes.redBar} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Imagen</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Correo</TableCell>
                      <TableCell>Teléfono</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>
                        <Button onClick={handleClick} color="primary" startIcon={<SearchIcon />}>
                          Buscar
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <TextField
                          name="id"
                          onChange={handleFiltersChange}
                          value={filters.id}
                          variant="outlined" size="small" />
                      </TableCell>
                      <TableCell align="center">---</TableCell>
                      <TableCell>
                        <TextField
                          name="name"
                          onChange={handleFiltersChange}
                          value={filters.name}
                          variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="email"
                          onChange={handleFiltersChange}
                          value={filters.email}
                          variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="phoneNumber"
                          onChange={handleFiltersChange}
                          value={filters.phoneNumber}
                          variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name="userStatusCode"
                          onChange={handleFiltersChange}
                          value={filters.userStatusCode}
                          variant="outlined" size="small" select>
                          {
                            userStatus.map((status, i) => {
                              return (
                                <MenuItem key={i} value={status.code}>{status.name}</MenuItem>
                              )
                            })
                          }
                        </TextField>
                      </TableCell>
                      <TableCell>
                        {
                          isFilters ?
                            <Box textAlign="center">
                              <Button startIcon={<CloseIcon />} onClick={handleClearFilters}>
                                Limpiar Filtros
                              </Button>
                            </Box>
                            :
                            null
                        }
                      </TableCell>
                    </TableRow>
                    {
                      admins.length > 0 ?
                        admins.map((admin, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell style={{ textAlign: 'center' }}>{admin.id}</TableCell>
                              <TableCell>
                                {
                                  admin.imgPath ?
                                    <img style={{ borderRadius: "100%", height: 80, width: 80, boxShadow: "5px 5px 10px -3px rgba(0,0,0,0.5)" }} src={process.env.REACT_APP_API_URL + "/" + admin.imgPath} alt="" />
                                    :
                                    <Box color="gray">
                                      <AccountCircleIcon style={{ height: "80px", width: "80px" }} />
                                    </Box>
                                }
                              </TableCell>
                              <TableCell>
                                <Link to={`/users-management/admins/${admin.id}/edit`}>
                                  {admin.name}
                                </Link>
                              </TableCell>
                              <TableCell>{admin.email}</TableCell>
                              <TableCell>{admin.phone}</TableCell>
                              <TableCell>
                                <span className={clsx({
                                  [classes.textSuccess]: admin?.userStatus?.code === "urs-001",
                                  [classes.textPrimary]: admin?.userStatus?.code === "urs-002",
                                })}>
                                  {admin.userStatus.name}
                                </span>
                              </TableCell>
                              <TableCell align="right" className={classes.actionCell}>
                                <IconButton size="small" component={Link} to={`/users-management/admins/${admin.id}/edit`}>
                                  <VisibilityIcon />
                                </IconButton>
                                <IconButton color="primary" size="small">
                                  <CloseIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        })
                        :
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Box textAlign="center" color="red">
                              No hay Usuarios
                            </Box>
                          </TableCell>
                        </TableRow>
                    }
                  </TableBody>
                </Table>
              </TableContainer>

              <Box p={"20px 20%"}>
                <Pagination activePage={activePage} pages={numberOfPages} onChange={handlePageChange} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={10}>
              <div className={classes.redBar2}>
                <h1 style={{ margin: 0 }}>Añadir nuevo usuario</h1>
                <p style={{ margin: 0 }}>Crear nuevo admin user</p>
              </div>
              <form onSubmit={handleSubmit}>
                <Box className={classes.textPrimary} p={2}>
                  <Box mb={3}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <PersonIcon />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={errorsForm.name ? true : false}
                          value={adminFormData.name}
                          helperText={<Box component="p">{errorsForm.name}</Box>}
                          onChange={handleChange}
                          label="Nombre"
                          name="name"
                          fullWidth></TextField>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box mb={3}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <EmailIcon />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={errorsForm.email ? true : false}
                          value={adminFormData.email}
                          helperText={<Box component="p">{errorsForm.email}</Box>}
                          onChange={handleChange}
                          label="Correo"
                          name="email"
                          fullWidth></TextField>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box mb={3}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <LockIcon />
                      </Grid>
                      <Grid item>
                        <TextField
                          error={errorsForm.password ? true : false}
                          helperText={<Box component="p">{errorsForm.password}</Box>}
                          value={adminFormData.password}
                          onChange={handleChange}
                          label="Contraseña"
                          name="password"
                          type="password"
                          fullWidth></TextField>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box style={{ textAlign: 'right' }} mt={5}>
                    <Button type="submit" color="primary" variant="contained">
                      Crear Administrador
                    </Button>
                  </Box>
                </Box>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Admins;
