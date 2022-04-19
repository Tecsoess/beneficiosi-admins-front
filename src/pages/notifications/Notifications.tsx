import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableBody,
  TextField,
  IconButton,
  MenuItem
} from "@material-ui/core";

import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

import { Link } from 'react-router-dom';

import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';

import Pagination from '../../components/Pagination';
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import useNotifications from "../../hooks/useNotifications";
import { useEffect } from "react";


const notifications = Array.from(Array(10).keys()).map((n) => {
  return {
    id: n + 1,
    to: 'Administradores',
    message: 'Revisar orden #16456465',
    createdAt: new Date().toLocaleString()
  }
});


const Notifications = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [filters, setFilters] = useState({ id: null, rol: null, dateFrom: null, dateTo: null, message: "" });
  const [isFilters, setIsFilters] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const [{ notifications, loading, error, size, numberOfPages, total }, getNotifications] = useNotifications();

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo notificaciones" });
  }, [loading])

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando" });
    getNotifications({
      params: {
        page: activePage
      }
    }).then(() => {
      setLoading?.({ show: false, message: "" });
    });
  }, [activePage])

  useEffect(() => {
    console.log(notifications);
  }, [notifications])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }
  }, [error]);

  const handleChange = (e: any) => {
    setFilters((oldFilters) => {
      return {
        ...oldFilters,
        [e.target.name]: e.target.value
      }
    });
  }

  const handleClearFilters = async () => {
    setFilters({ id: null, rol: null, dateFrom: null, dateTo: null, message: "" });
    setLoading?.({ show: true, message: "Eliminando Filtros" })
    await getNotifications();
    setLoading?.({ show: false, message: "" })
    setIsFilters(false);
  }

  const handleClick = async () => {
    setLoading?.({ show: true, message: "Filtrando Clientes" })
    await getNotifications({ params: filters });
    setLoading?.({ show: false, message: "" })
    setIsFilters(true);
  }


  return (
    <Box>
      <Box mb={4} component="h1" color="gray">
        <NotificationsActiveOutlinedIcon />
        Notificaciones
      </Box>

      <Box textAlign="right" mb={4} >
        <Link style={{ textDecoration: "none" }} to="/notifications/create">
          <Button variant="contained" color="primary">
            Crear Notificacion
          </Button>
        </Link>
      </Box>

      <Paper elevation={0}>
        <Box bgcolor="red" borderRadius={"10px 10px 0 0"} p={5}>

        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Usuario</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Mensaje</TableCell>
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
                    value={filters.id}
                    onChange={handleChange}
                    fullWidth variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    name="rol"
                    value={filters.rol}
                    onChange={handleChange}
                    fullWidth variant="outlined" size="small" select >
                    <MenuItem value={1}>Cliente</MenuItem>
                    <MenuItem value={2}>Administrador</MenuItem>
                    <MenuItem value={3}>Tienda</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <Box mb={2}>
                    <TextField
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleChange}
                      label="desde" fullWidth variant="outlined" size="small" />
                  </Box>
                  <Box>
                    <TextField
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleChange}
                      label="hasta" fullWidth variant="outlined" size="small" />
                  </Box>
                </TableCell>
                <TableCell>
                  <TextField
                    name="message"
                    value={filters.message}
                    onChange={handleChange}
                    fullWidth variant="outlined" size="small" />
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
              {notifications.length > 0 ?
                notifications.map((notification, i) => <TableRow key={i}>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {notification.id}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {notification.role}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {notification.createdAt}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {notification.message}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" component={Link} to="/users-management/banners/1/edit">
                      <CreateIcon />
                    </IconButton>
                    <IconButton color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
                :
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box textAlign="center" color="red">
                      No se encontraron notificaciones
                    </Box>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>

        <Box p={"20px 20%"}>
          <Pagination activePage={activePage} pages={numberOfPages} onChange={e => { setActivePage(e) }} />
        </Box>
      </Paper>
    </Box>
  )
}

export default Notifications;
