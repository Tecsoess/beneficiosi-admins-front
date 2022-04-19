import {
  Box,
  Button,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  SvgIconTypeMap,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@material-ui/core";
import Card from "../../../components/Card";
import { Link } from 'react-router-dom';
import SectionTitle from "../../../components/SectionTitle";
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import ClearIcon from '@material-ui/icons/Clear';
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from "../../../components/Pagination";
import useCarts from "../../../hooks/useCarts";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";




const CardTitle = (props: { icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>, title: string }) => {

  const { title, icon } = props;

  const Icon = icon;

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <Icon style={{ marginRight: 10 }} /> {title}
    </div>
  )
}

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
  textCenter: {
    textAlign: 'center'
  },
  borderb: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`
  },
  bordert: {
    borderTop: `1px solid ${theme.palette.grey[400]}`
  },
}));

const Carts = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const classes = useStyles();

  const [filters, setFilters] = useState({
    page: 1,
    id: "",
    clientName: "",
    storeName: "",
    minTotal: "",
    maxTotal: "",
    from: "",
    until: "",
    isProcessed: "",
    isDirectPurchase: "false",
    sort: "createdAt,DESC"
  });

  const [{ carts, numberOfPages, error: cartsError, loading: cartsLoading }, getCarts] = useCarts({ axiosConfig: { params: { ...filters } } });

  const [{data: cartSummary, loading: cartSummaryLoading}] = useAxios({url: `/carts/summary`}, {useCache: false});

  useEffect(() => {    
    console.log(cartSummary);
  }, [cartSummary])

  useEffect(() => {
    setLoading?.({ show: cartsLoading, message: "Obteniendo carritos" });
  }, [cartsLoading])

  useEffect(() => {
    if (cartsError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cartsError?.response?.status === 400 ? cartsError?.response?.data.message[0] : cartsError?.response?.data.message}.`, severity: "error" });
    }
  }, [cartsError]);

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

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      id: "",
      clientName: "",
      storeName: "",
      minTotal: "",
      maxTotal: "",
      from: "",
      until: "",
      isProcessed: "",
      isDirectPurchase: "false",
      sort: "createdAt,DESC"
    })
  }

  return (
    <div>
      <SectionTitle withMargin>Carritos</SectionTitle>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card
            title={<CardTitle icon={LocalAtmIcon} title={'Valor promedio de los carritos'} />}
          >
            <h2>$ {Number(cartSummary?.totalAverage).toFixed(2)}</h2>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            title={<CardTitle icon={ShoppingCartIcon} title={'Carritos de esta semana'} />}
          >
            <h2>{cartSummary?.numberOfCartsThisWeek}</h2>
          </Card>
        </Grid>
      </Grid>
      <Paper elevation={0}>
        <div className={classes.tablehead}>

        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.textCenter}>ID</TableCell>
                <TableCell className={classes.textCenter}>Cliente</TableCell>
                <TableCell className={classes.textCenter}>Tienda</TableCell>
                <TableCell className={classes.textCenter}>Total</TableCell>
                <TableCell className={classes.textCenter}>Fecha</TableCell>
                <TableCell className={classes.textCenter}>Procesado</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className={classes.textCenter}>
                  <TextField
                    name="id"
                    value={filters.id}
                    onChange={handleChange}
                    placeholder="id"
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell className={classes.textCenter}>
                  <TextField
                    name="clientName"
                    value={filters.clientName}
                    onChange={handleChange}
                    placeholder="Nombre del cliente"
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell className={classes.textCenter}>
                  <TextField
                    name="storeName"
                    value={filters.storeName}
                    onChange={handleChange}
                    placeholder="Nombre de la tienda"
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell className={classes.textCenter}>
                  <TextField
                    name="minTotal"
                    value={filters.minTotal}
                    onChange={handleChange}
                    placeholder="min"
                    margin="dense"
                    variant="outlined"
                    size="small" />
                  <TextField
                    name="maxTotal"
                    value={filters.maxTotal}
                    onChange={handleChange}
                    placeholder="max"
                    margin="dense"
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell className={classes.textCenter}>
                  <TextField
                    name="from"
                    value={filters.from}
                    onChange={handleChange}
                    placeholder="desde"
                    margin="dense"
                    variant="outlined"
                    size="small" />
                  <TextField
                    name="until"
                    value={filters.until}
                    onChange={handleChange}
                    placeholder="hasta"
                    margin="dense"
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell className={classes.textCenter}>
                  <TextField
                    name="isProcessed"
                    value={filters.isProcessed}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    select>
                    <MenuItem value="true">Si</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell className={classes.textCenter}>
                  <Button onClick={handleClearFilters} startIcon={<ClearIcon />} size="small">
                    Limpiar Filtros
                  </Button>
                </TableCell>
              </TableRow>
              {
                carts.length > 0 ?
                  carts.map((cart, i) => <TableRow key={i}>
                    <TableCell className={classes.textCenter}>{cart?.id}</TableCell>
                    <TableCell className={classes.textCenter}>
                      <Box textAlign="center">
                        <Link to={`/users-management/clients/${cart?.user?.id}/edit`}>
                          {
                            cart?.user?.imgPath ?
                              <img style={{ height: 50, width: 50, borderRadius: "100%" }}
                                src={`${process.env.REACT_APP_API_URL}/${cart?.user?.imgPath}`} alt={cart?.user?.name} />
                              :
                              null
                          }
                          <p>{cart?.user?.name}</p>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell className={classes.textCenter}>
                      <Link to={`/users-management/stores/${cart?.store?.storeId}/edit`}>
                        {
                          cart?.store?.storeProfile?.logo ?
                            <img style={{ height: 40, width: 40, borderRadius: 5 }}
                              src={`${process.env.REACT_APP_API_URL}/${cart?.store?.storeProfile?.logo}`} alt={cart?.store?.name} />
                            :
                            null
                        }
                        <p>{cart?.store?.name}</p>
                      </Link>
                    </TableCell>
                    <TableCell className={classes.textCenter}>$ {cart?.subTotal?.toLocaleString()}</TableCell>
                    <TableCell className={classes.textCenter}>{cart.createdAt}</TableCell>
                    <TableCell className={classes.textCenter}>
                      <Box textAlign="center" color={cart?.isProcessed ? "green" : "red"}>
                        {
                          cart?.isProcessed ?
                            <p className="text-green-500">Si</p>
                            :
                            <p className="text-red-500">No</p>
                        }
                      </Box>
                    </TableCell>
                    <TableCell align="right" className={classes.actionsCell}>
                      <IconButton size="small" component={Link} to={`/orders-management/carts/${cart?.id}`}>
                        <SearchIcon />  Ver
                      </IconButton>
                    </TableCell>
                  </TableRow>)
                  :
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Box component="p" color="red" textAlign="center">No hay Carritos</Box>
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
    </div >
  )
}

export default Carts;
