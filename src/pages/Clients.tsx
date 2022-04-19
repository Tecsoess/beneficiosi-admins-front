import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import useClients from "../hooks/useClients";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ConfirmAlert from "../components/ConfirmAlert";
import useAxios from "../hooks/useAxios";
import SearchIcon from '@material-ui/icons/Search';
import useUserStatus from "../hooks/useUserStatus";

const useStyles = makeStyles(theme => ({
  textSuccess: {
    color: theme.palette.success.main,
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },
  mb: {
    marginBottom: theme.spacing(2),
  },
  actionsCell: {
    whiteSpace: 'nowrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    }
  },
  redBar: {
    height: theme.spacing(5),
    backgroundColor: theme.palette.primary.main,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));

const Clients = () => {
  const { setLoading, setCustomAlert } = useAuth();
  
  const classes = useStyles();

  const [show, setShow] = useState(false);

  const [clientToDelete, setClientToDelete] = useState<any>(null);

  const [filters, setFilters] = useState({ id: "", name: "", email: "", userStatusCode: "", phoneNumber: "", sort: "createdAt,DESC" });
  const [activePage, setActivePage] = useState(1);
  const [isFilters, setIsFilters] = useState(false);

  const [{ clients, error, numberOfPages, size, total }, getClients] = useClients({ options: { manual: true } });

  const [{ userStatus, error: userStatusError }, getUserStatus] = useUserStatus({ options: { manual: true } });

  const [{ data, loading: deleteLoading, error: deleteError }, deleteClient] = useAxios({ url: `/clients/${clientToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

  const [{data: summaryClientData, loading: summaryClientLoading}] = useAxios({url: `/summaries/clients`}, {useCache: false});

  useEffect(() => {
    console.log(summaryClientData);
  }, [summaryClientData])


  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando datos" });
    Promise.all([getClients(), getUserStatus()]).then((values) => {
      setLoading?.({ show: false, message: "" });
    })
  }, []);

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando" });
    getClients({
      params: {
        page: activePage
      }
    }).then(() => {
      setLoading?.({ show: false, message: "" });
    });
  }, [activePage])

  useEffect(() => {
    console.log(clients);
  }, [clients])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (userStatusError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${userStatusError?.response?.status === 400 ? userStatusError?.response?.data.message[0] : userStatusError?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, deleteError]);

  useEffect(() => {
    if (data !== undefined) {
      getClients().then(() => {
        setCustomAlert?.({ show: true, message: "el cliente ha sido eliminado exitosamente", severity: "success" });
        setClientToDelete(null);
      });
    }
  }, [data])

  const handleDelete = (client: any) => {
    setShow(true);
    setClientToDelete(client);
  }

  const closeAlert = () => {
    setShow(false);
    setClientToDelete(null);
  }

  const handleConfirmDelete = async () => {
    setShow(false);
    setLoading?.({ show: true, message: "eliminando cliente" });
    await deleteClient();
    setLoading?.({ show: false, message: "" });
  }

  const handleChange = (e: any) => {
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
    setFilters({ id: "", name: "", email: "", userStatusCode: "", phoneNumber: "", sort: "createdAt,DESC" });
    setLoading?.({ show: true, message: "Eliminando Filtros" })
    await getClients();
    setLoading?.({ show: false, message: "" })
    setIsFilters(false);
  }

  const handleClick = async () => {
    setLoading?.({ show: true, message: "Filtrando Clientes" })
    await getClients({ params: filters });
    setLoading?.({ show: false, message: "" })
    setIsFilters(true);
  }

  const handlePageChange = (e: any) => {
    setActivePage(e)
  }

  return <>
    <SectionTitle withMargin>Clientes</SectionTitle>

    <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={AccountCircleIcon}
          iconColor="warning"
          loading={summaryClientLoading}
          value={summaryClientData?.clientsCount}
          title={'Clientes totales'}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={AccountCircleIcon}
          iconColor="success"
          loading={summaryClientLoading}
          value={summaryClientData?.activeClientsCount}
          title={'Clientes activos'}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={PersonAddDisabledIcon}
          iconColor="primary"
          loading={summaryClientLoading}
          value={summaryClientData?.bannedClientsCount}
          title={'Clientes bloqueados'}
        />
      </Grid>
    </Grid>

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
                  onChange={handleChange}
                  value={filters.id}
                  variant="outlined" size="small" />
              </TableCell>
              <TableCell align="center">---</TableCell>
              <TableCell>
                <TextField
                  name="name"
                  onChange={handleChange}
                  value={filters.name}
                  variant="outlined" size="small" />
              </TableCell>
              <TableCell>
                <TextField
                  name="email"
                  onChange={handleChange}
                  value={filters.email}
                  variant="outlined" size="small" />
              </TableCell>
              <TableCell>
                <TextField
                  name="phoneNumber"
                  onChange={handleChange}
                  value={filters.phoneNumber}
                  variant="outlined" size="small" />
              </TableCell>
              <TableCell>
                <TextField
                  name="userStatusCode"
                  onChange={handleChange}
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
            {clients.length > 0 ?
              clients.map((client, i) => <TableRow key={i}>
                <TableCell>{client.id}</TableCell>
                <TableCell>
                  {
                    client.imgPath ?
                      <img style={{ borderRadius: "100%", height: 80, width: 80, boxShadow: "5px 5px 10px -3px rgba(0,0,0,0.5)" }} src={process.env.REACT_APP_API_URL + "/" + client.imgPath} alt="" />
                      :
                      <Box color="gray">
                        <AccountCircleIcon style={{ height: "80px", width: "80px" }} />
                      </Box>
                  }
                </TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phoneNumber}</TableCell>
                <TableCell>
                  {client.userStatus.name}
                </TableCell>
                <TableCell align="right" className={classes.actionsCell}>
                  <IconButton size="small" component={Link} to={`/users-management/clients/${client.id}/edit`} >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => { handleDelete(client) }} color="primary" size="small">
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>)
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

      <ConfirmAlert
        show={show}
        title={"¿Deseas eliminar el cliente?"}
        description={clientToDelete?.name}
        onCancel={closeAlert}
        onConfirm={handleConfirmDelete} />
    </Paper>
  </>;
};

export default Clients;
