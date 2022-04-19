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

import Card from "../../../components/Card";
import Pagination from "../../../components/Pagination";
import Ring from "../../../components/Ring";
import SectionTitle from "../../../components/SectionTitle";
import { Link } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import DescriptionIcon from '@material-ui/icons/Description';
import ClearIcon from '@material-ui/icons/Clear';
import { useEffect, useRef, useState } from "react";
import useOrders from "../../../hooks/useOrders";
import usePaymentMethods from "../../../hooks/usePaymentMethods";
import useOrdersStatuses from "../../../hooks/useOrdersStatuses";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";

const orderRings: {
  title: string;
  value: number;
  color: "primary" | "info" | "success" | "warning";
}[] = [
    { title: 'Rechazadas', value: 120, color: 'primary' },
    { title: 'En proceso', value: 210, color: 'warning' },
    { title: 'Finalizadas', value: 239, color: 'success' },
  ];


const useStyles = makeStyles(theme => ({
  actionsCell: {
    whiteSpace: 'nowrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    }
  },
  mb: {
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    color: theme.palette.primary.main
  },
  money: {
    fontSize: theme.spacing(3)
  },
  textSuccess: {
    color: theme.palette.success.main,
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },

  tablehead: {
    background: theme.palette.primary.main,
    height: 40,
    width: '100%',
    marginTop: 30
  },

  borderb: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`
  },
  bordert: {
    borderTop: `1px solid ${theme.palette.grey[400]}`
  },
  dayMonth: {
    fontSize: theme.spacing(5)
  },
  orderStatusCard: {
    display: 'flex',
    justifyContent: 'space-evenly',
  }
}));

const Orders = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const classes = useStyles();

  const tableInitRef = useRef<any>();

  const [filters, setFilters] = useState({
    page: 1,
    id: "",
    clientName: "",
    orderNumber: "",
    address: "",
    storeName: "",
    minTotal: "",
    maxTotal: "",
    from: "",
    until: "",
    orderStatusCode: "",
    paymentMethodCode: "",
    sort: "createdAt,DESC"
  });

  const [{ orders, error: ordersError, loading: ordersLoading, numberOfPages }, getOrders] = useOrders({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

  const [{ paymentMethods, error: payMethodsError, loading: payMethodsLoading }, getPayMethods] = usePaymentMethods();

  const [{ ordersStatuses, error: ordersStatusesError, loading: ordersStatusesLoading }, getOrdersStatuses] = useOrdersStatuses();

  const [{ data: ordersCount }] = useAxios({ url: `/orders/orders-count` }, { useCache: false });

  useEffect(() => {
    setLoading?.({ show: ordersLoading, message: "Obteniendo tus pedidos" });
  }, [ordersLoading]);

  useEffect(() => {
    console.log(orders);
  }, [orders])


  useEffect(() => {

    if (ordersError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${ordersError?.response?.status === 400 ? ordersError?.response?.data.message[0] : ordersError?.response?.data.message}.`, severity: "error" });
    }

    if (payMethodsError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${payMethodsError?.response?.status === 400 ? payMethodsError?.response?.data.message[0] : payMethodsError?.response?.data.message}.`, severity: "error" });
    }

    if (ordersStatusesError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${ordersStatusesError?.response?.status === 400 ? ordersStatusesError?.response?.data.message[0] : ordersStatusesError?.response?.data.message}.`, severity: "error" });
    }
  }, [ordersError, payMethodsError, ordersStatusesError]);

  const handleChange = (e: any) => {
    tableInitRef.current?.scrollIntoView();
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

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      id: "",
      clientName: "",
      orderNumber: "",
      address: "",
      storeName: "",
      minTotal: "",
      maxTotal: "",
      from: "",
      until: "",
      orderStatusCode: "",
      paymentMethodCode: "",
      sort: "createdAt,DESC"
    })
  }

  return (
    <div>
      <SectionTitle withMargin>Ordenes</SectionTitle>
      <Grid container spacing={2} className={classes.mb}>
        <Grid item xs={12}>
          <Card
            title="Estado de las ordenes"
            contentClassName={classes.orderStatusCard}
          >
            <Ring
              value={ordersCount?.canceled}
              title={"Rechazadas"}
              color="danger"
              size="medium"
            />
            <Ring
              value={ordersCount?.processing}
              title={"Pendientes"}
              color="warning"
              size="medium"
            />

            <Ring
              value={ordersCount?.completed}
              title={"Aceptadas"}
              color="success"
              size="medium"
            />
          </Card>
        </Grid>        
      </Grid>

      <Paper elevation={0} ref={tableInitRef}>
        <div className={classes.tablehead}>

        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box textAlign="center">
                    ID
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Tienda
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Numero de orden
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Entrega
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Cliente
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Total
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Fecha
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Estado
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    PDF
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Pago
                  </Box>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    name="id"
                    onChange={handleChange}
                    value={filters.id}
                    placeholder="id"
                    variant="outlined"
                    size="small"
                    fullWidth />
                </TableCell>
                <TableCell>
                  <TextField
                    name="storeName"
                    onChange={handleChange}
                    value={filters.storeName}
                    placeholder="Nombre de la tienda"
                    variant="outlined"
                    size="small"
                    fullWidth />
                </TableCell>
                <TableCell>
                  <TextField
                    name="orderNumber"
                    onChange={handleChange}
                    value={filters.orderNumber}
                    placeholder="Numero de orden"
                    variant="outlined"
                    size="small"
                    fullWidth />
                </TableCell>
                <TableCell>
                  <TextField
                    name="address"
                    onChange={handleChange}
                    value={filters.address}
                    placeholder="Dirección de entrega"
                    variant="outlined"
                    size="small"
                    fullWidth>
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    name="clientName"
                    onChange={handleChange}
                    value={filters.clientName}
                    placeholder="Nombre de cliente"
                    variant="outlined"
                    size="small"
                    fullWidth />
                </TableCell>
                <TableCell>
                  <TextField
                    name="minTotal"
                    onChange={handleChange}
                    value={filters.minTotal}
                    placeholder="min"
                    margin="dense"
                    variant="outlined"
                    size="small"
                    fullWidth />
                  <TextField
                    name="maxTotal"
                    onChange={handleChange}
                    value={filters.maxTotal}
                    placeholder="max"
                    margin="dense"
                    variant="outlined"
                    size="small"
                    fullWidth />
                </TableCell>
                <TableCell>
                  <TextField
                    name="from"
                    onChange={handleChange}
                    value={filters.from}
                    placeholder="desde"
                    margin="dense"
                    variant="outlined"
                    size="small"
                    fullWidth />
                  <TextField
                    name="until"
                    onChange={handleChange}
                    value={filters.until}
                    placeholder="hasta"
                    margin="dense"
                    variant="outlined"
                    size="small"
                    fullWidth />
                </TableCell>
                <TableCell>
                  <TextField
                    name="orderStatusCode"
                    onChange={handleChange}
                    value={filters.orderStatusCode}
                    variant="outlined"
                    size="small"
                    fullWidth select>
                    {
                      ordersStatuses?.map((orderStatus, i) => {
                        return (
                          <MenuItem style={{ textTransform: "capitalize" }} key={i} value={orderStatus?.code}>{orderStatus?.name}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    ---
                  </Box>
                </TableCell>
                <TableCell>
                  <TextField
                    name="paymentMethodCode"
                    onChange={handleChange}
                    value={filters.paymentMethodCode}
                    variant="outlined"
                    size="small"
                    style={{ textTransform: "capitalize" }}
                    fullWidth
                    select>
                    {
                      paymentMethods?.map((paymentMethod, i) => {
                        return (
                          <MenuItem style={{ textTransform: "capitalize" }} key={i} value={paymentMethod?.code}>{paymentMethod?.name}</MenuItem>
                        )
                      })
                    }
                  </TextField>
                </TableCell>
                <TableCell>
                  <Button onClick={handleClearFilters} startIcon={<ClearIcon />} size="small">
                    Limpiar Filtros
                  </Button>
                </TableCell>
              </TableRow>
              {
                orders.length > 0 ?
                  orders.map((order, i) => <TableRow key={i}>
                    <TableCell>
                      <Box textAlign="center">
                        <b>{order?.id}</b>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        <Link to={`/users-management/stores/${order?.store?.storeId}/edit`}>
                          {
                            order?.store?.storeProfile?.logo ?
                              <img style={{ height: 40, width: 40, borderRadius: 5 }}
                                src={`${process.env.REACT_APP_API_URL}/${order?.store?.storeProfile?.logo}`} alt={order?.store?.name} />
                              :
                              null
                          }
                          <p>{order?.store?.name}</p>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        <b>{order?.orderNumber}</b>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        {order?.delivery?.profileAddress?.address}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        <Link to={`/users-management/clients/${order?.user?.id}/edit`}>
                          {
                            order?.user?.imgPath ?
                              <img style={{ height: 50, width: 50, borderRadius: "100%" }}
                                src={`${process.env.REACT_APP_API_URL}/${order?.user?.imgPath}`} alt={order?.user?.name} />
                              :
                              null
                          }
                          <p>{order?.user?.name}</p>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        $ {order?.total?.toLocaleString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        {order?.createdAt}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box bgcolor={order?.orderStatus?.color} px={2} py={1} borderRadius={5} color="white" style={{ textTransform: "capitalize" }}>
                        {order?.orderStatus?.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        {
                          order?.invoice ?
                            <DescriptionIcon />
                            :
                            '--'
                        }
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center" style={{ textTransform: "capitalize" }}>
                        {order?.paymentMethod?.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right" className={classes.actionsCell}>
                      <IconButton size="small" component={Link} to={`/orders-management/orders/${order?.id}/edit`}>
                        <SearchIcon />  Ver
                      </IconButton>
                    </TableCell>
                  </TableRow>)
                  :
                  <TableRow>
                    <TableCell colSpan={11}>
                      <Box component="p" color="red" textAlign="center">No hay Ordenes</Box>
                    </TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Box p={"20px 20%"}>
          <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
        </Box>
      </Paper>
    </div>
  )
}

export default Orders;
