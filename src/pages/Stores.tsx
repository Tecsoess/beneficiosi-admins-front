import { Box, Button, Grid, IconButton, makeStyles, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import SectionTitle from "../components/SectionTitle";
import StatCard from "../components/StatCard";
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import useStores from "../hooks/useStores";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import useCategories from "../hooks/useCategories";
import SearchIcon from '@material-ui/icons/Search';
import ConfirmAlert from "../components/ConfirmAlert";
import imageNotFound from '../assets/images/image-not-found.png';
import useAxios from "../hooks/useAxios";

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
const Stores = () => {
  const classes = useStyles();

  const { setLoading, setCustomAlert } = useAuth();

  const [filters, setFilters] = useState({ id: null, name: "", email: "", categoryId: null, phoneNumber: "", sort: "createdAt,DESC" });

  const [isFilters, setIsFilters] = useState(false);

  const [show, setShow] = useState(false);

  const [storeToDelete, setStoreToDelete] = useState<any>(null);

  const [{ stores, loading, error, numberOfPages, size }, getStores] = useStores({ options: { manual: true } });
  const [activePage, setActivePage] = useState(1);
  const [{ categories, error: categoriesError }, getCategories] = useCategories({ options: { manual: true } });

  const [{ data: deleteData, error: deleteError }, deleteStore] = useAxios({ url: `/stores/${storeToDelete?.storeId}`, method: "DELETE" }, { useCache: false, manual: true });

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando Datos" });
    Promise.all([getStores(), getCategories()]).then((values) => {
      setLoading?.({ show: false, message: "" });
      console.log(categories);
    })
  }, []);

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando" });
    getStores({
      params: {
        page: activePage
      }
    }).then(() => {
      setLoading?.({ show: false, message: "" });
    });
  }, [activePage])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }

    if (categoriesError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesError?.response?.status === 400 ? categoriesError?.response?.data.message[0] : categoriesError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, deleteError, categoriesError]);

  useEffect(() => {
    console.log(stores);
  }, [stores])

  useEffect(() => {
    if (deleteData !== undefined) {
      getStores().then(() => {
        setCustomAlert?.({ show: true, message: "La Tienda ha sido eliminada exitosamente", severity: "success" });
        setStoreToDelete(null);
      });
    }
  }, [deleteData])

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

  const handleClick = async () => {
    setLoading?.({ show: true, message: "Filtrando Tiendas" })
    await getStores({ params: filters });
    setLoading?.({ show: false, message: "" })
    setIsFilters(true);
  }

  const handleClearFilters = async () => {
    setFilters({ id: null, name: "", email: "", categoryId: null, phoneNumber: "", sort: "createdAt,DESC" });
    setLoading?.({ show: true, message: "Eliminando Filtros" })
    await getStores();
    setLoading?.({ show: false, message: "" })
    setIsFilters(false);
  }

  const handleDelete = (store: any) => {
    setShow(true);
    setStoreToDelete(store);
  }

  const closeAlert = () => {
    setShow(false);
    setStoreToDelete(null);
  }

  const handleConfirmDelete = async () => {
    setShow(false);
    setLoading?.({ show: true, message: "Eliminando tienda" });
    await deleteStore();
    setLoading?.({ show: false, message: "" });
  }

  return <>
    <SectionTitle withMargin>Tiendas</SectionTitle>

    <Grid container spacing={2} className={classes.mb}>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={ListAltIcon}
          iconColor="warning"
          value={34}
          title={'Ordenes en proceso'}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={ListAltIcon}
          iconColor="success"
          value={17}
          title={'Ordenes finalizadas'}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard
          icon={ListAltIcon}
          iconColor="primary"
          value={99}
          title={'Ordenes canceladas'}
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
              <TableCell>Categoría</TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <Button color="primary" startIcon={<SearchIcon />} onClick={handleClick}>Buscar</Button>
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
                  variant="outlined"
                  size="small" />
              </TableCell>
              <TableCell align="center">---</TableCell>
              <TableCell>
                <TextField
                  name="name"
                  onChange={handleChange}
                  value={filters.name}
                  variant="outlined"
                  size="small" />
              </TableCell>
              <TableCell>
                <TextField
                  name="email"
                  onChange={handleChange}
                  value={filters.email}
                  variant="outlined"
                  size="small" />
              </TableCell>
              <TableCell>
                <TextField
                  name="phoneNumber"
                  onChange={handleChange}
                  value={filters.phoneNumber}
                  variant="outlined"
                  size="small" />
              </TableCell>
              <TableCell>
                <TextField
                  name="categoryId"
                  onChange={handleChange}
                  value={filters.categoryId}
                  variant="outlined"
                  size="small"
                  fullWidth
                  select>
                  {
                    categories.map((category, i) => {
                      return (
                        <MenuItem value={category.id} key={i}>
                          {category.name}
                        </MenuItem>
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
              stores.length > 0 ?

                stores.map((store, i) => <TableRow key={i}>
                  <TableCell>{store.id}</TableCell>
                  <TableCell>
                    {
                      store?.storeProfile?.logo ?
                        <img style={{ borderRadius: "100%", height: 80, width: 80, boxShadow: "5px 5px 10px -3px rgba(0,0,0,0.5)" }} src={process.env.REACT_APP_API_URL + "/" + store?.storeProfile?.logo} alt="" />
                        :
                        <Box color="gray">
                          <img style={{ height: 70, width: 70 }} src={imageNotFound} alt="" />
                        </Box>
                    }
                  </TableCell>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>{store?.phoneNumber}</TableCell>
                  <TableCell>
                    <Box textAlign="center" style={{ textTransform: "capitalize" }}>
                      {store.storeCategory.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right" className={classes.actionsCell}>
                    <IconButton size="small" component={Link} to={`/users-management/stores/${store.storeId}/edit`} >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => { handleDelete(store) }} color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
                :
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box textAlign="center" color="red">
                      No hay tiendas :(
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

      <ConfirmAlert
        show={show}
        title={"¿Deseas eliminar la tienda?"}
        description={storeToDelete?.name}
        onCancel={closeAlert}
        onConfirm={handleConfirmDelete} />
    </Paper>
  </>;
};

export default Stores;
