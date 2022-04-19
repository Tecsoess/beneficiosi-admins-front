import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TextField,
  IconButton,
  Paper,
  Box,
  makeStyles,
  MenuItem
} from "@material-ui/core";

import { Link } from "react-router-dom";

import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

import Pagination from '../../../components/Pagination';
import useFeaturedProducts from "../../../hooks/useFeaturedProducts";
import { useEffect, useState } from "react";
import useCategories from "../../../hooks/useCategories";
import { useAuth } from "../../../contexts/AuthContext";
import findPortraitImg from "../../../helpers/findPortraitImage";
import ConfirmAlert from "../../../components/ConfirmAlert";
import useAxios from "../../../hooks/useAxios";

import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';



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
}))

const FeaturedProducts = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [canFilter, setCanFilter] = useState(false);

  const [featureProductToDelete, setFeatureProductToDelete] = useState<any>(null);

  const [show, setShow] = useState(false);

  const [filters, setFilters] = useState({
    productName: "",
    storeCategoryId: "",
    id: "",
    storeName: "",
    priceMin: "",
    priceMax: "",
    minDate: "",
    maxDate: "",
    page: 1
  });

  const [{ data: deleteData, error: deleteError }, deleteFeatureProduct] = useAxios({ url: `/featured-ads/${featureProductToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

  const [{ featuredProducts, loading, total, numberOfPages, error }, getFeaturedProducts] = useFeaturedProducts({ axiosConfig: { params: { ...filters } }, options: { manual: true } });

  const [{ categories, error: categoriesError, }, getCategories] = useCategories({ options: { manual: true } });

  const classes = useStyles();

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando datos" });
    Promise.all([getFeaturedProducts(), getCategories()]).then((values) => {
      setLoading?.({ show: false, message: "" });
      setCanFilter(true);
    })
  }, []);

  useEffect(() => {
    if (canFilter) {
      setLoading?.({ show: loading, message: "Obteniendo información" })
    }
  }, [loading])

  useEffect(() => {
    if (canFilter) {
      getFeaturedProducts({
        params: {
          ...filters,
          minDate: filters.minDate ? format(new Date(filters.minDate), "yyyy-MM-dd H:mm:ss") : "",
          maxDate: filters.maxDate ? format(new Date(filters.maxDate), "yyyy-MM-dd H:mm:ss") : ""
        }
      })
    }
  }, [filters]);

  useEffect(() => {
    if (deleteData !== undefined) {
      getFeaturedProducts().then(() => {
        setCustomAlert?.({ show: true, message: "Se ha eliminado el producto exitosamente.", severity: "success" });
      });
    }
  }, [deleteData])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (categoriesError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesError?.response?.status === 400 ? categoriesError?.response?.data.message[0] : categoriesError?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, categoriesError, deleteError]);

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
    });
  }

  const handleDelete = (product: any) => {
    setFeatureProductToDelete(product);
    setShow(true);
  }

  const handleClose = async (e: any) => {
    setShow(false);
    if (e) {
      setLoading?.({ show: true, message: "Eliminando producto de destacatos" });
      await deleteFeatureProduct();
      setLoading?.({ show: false, message: "" });
    }

    setFeatureProductToDelete(null);
  }

  const handleClearFilters = () => {
    setFilters({
      productName: "",
      storeCategoryId: "",
      id: "",
      storeName: "",
      priceMin: "",
      priceMax: "",
      minDate: "",
      maxDate: "",
      page: 1
    })
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <StarsOutlinedIcon style={{ fontSize: '40px' }} />
          <h1>Productos Destacados</h1>
        </div>
      </Box>

      <Box mb={4} style={{ textAlign: 'right' }}>
        <Link style={{ textDecoration: "none" }} to={`/ads-management/featured-products/create`}>
          <Button variant="contained" color="primary">
            Añadir destacado
          </Button>
        </Link>
      </Box>

      <Paper elevation={0}>
        <div className={classes.redBar} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Imagen</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Nombre</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Tienda</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Precio</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Categoria</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha de inicio</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha final</TableCell>
                <TableCell style={{ textAlign: 'center' }}>

                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField fullWidth name="id" value={filters.id} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>

                </TableCell>
                <TableCell>
                  <TextField fullWidth name="productName" value={filters.productName} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField fullWidth name="storeName" value={filters.storeName} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField type="number" margin="normal" placeholder="Desde..." fullWidth name="priceMin" value={filters.priceMin} onChange={handleChange} variant="outlined" size="small" />

                  <TextField type="number" margin="normal" placeholder="Hasta..." fullWidth name="priceMax" value={filters.priceMax} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={filters.storeCategoryId}
                    onChange={handleChange}
                    name="storeCategoryId"
                    variant="outlined"
                    size="small"
                    select>
                    <MenuItem value="" >
                      Seleccione una opcion
                    </MenuItem>
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
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <TableCell>
                    <Box textAlign="center">
                      <DateTimePicker
                        inputVariant="outlined"
                        fullWidth
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        value={filters.minDate}
                        invalidDateMessage={null}
                        onChange={date => { handleChange({ target: { name: "minDate", value: date, type: "date" } }) }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      <DateTimePicker
                        inputVariant="outlined"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        margin="normal"
                        id="date-picker-dialog"
                        format="dd/MM/yyyy"
                        invalidDateMessage={null}
                        minDate={filters.minDate}
                        value={filters.maxDate}
                        onChange={date => { handleChange({ target: { name: "maxDate", value: date, type: "date" } }) }}
                      />
                    </Box>
                  </TableCell>
                </MuiPickersUtilsProvider>
                <TableCell>
                  <Button startIcon={<CloseIcon />} onClick={handleClearFilters}>
                    Limpiar filtros
                  </Button>
                </TableCell>
              </TableRow>
              {featuredProducts.length > 0 ?
                featuredProducts.map((featuredProduct, i) => <TableRow key={i}>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <Box textAlign="center">
                      {featuredProduct.id}
                    </Box>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Box textAlign="center">
                      <img style={{ height: 60, width: 60, borderRadius: 10 }} src={`${process.env.REACT_APP_API_URL}/${findPortraitImg(featuredProduct?.product?.productImages).path}`} alt="" />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      <a href={`${process.env.REACT_APP_HOST}products/${featuredProduct.product.slug}`} target="_blank">
                        {featuredProduct.product.name}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      <Link to={`/users-management/stores/${featuredProduct?.product?.store?.storeId}/edit`}>
                        <img
                          style={{ height: 60, width: 60, borderRadius: 10 }}
                          src={`${process.env.REACT_APP_API_URL}/${featuredProduct?.product?.store?.storeProfile?.logo}`}
                          alt={featuredProduct?.product?.store?.name} />
                        <p>{featuredProduct?.product?.store?.name}</p>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      $ {featuredProduct.price}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box style={{ textTransform: "capitalize" }} textAlign="center">
                      {featuredProduct?.storeCategory?.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      {format(new Date(featuredProduct.from), "dd/MM/yyyy H:mm:ss")}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      {format(new Date(featuredProduct.until), "dd/MM/yyyy H:mm:ss")}
                    </Box>
                  </TableCell>
                  <TableCell align="right" className={classes.actionCell}>
                    <IconButton onClick={() => { handleDelete(featuredProduct) }} color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
                :
                <TableRow>
                  <TableCell colSpan={9}>
                    <Box py={4} textAlign="center" color="red">
                      No se Encontraron resulados.
                    </Box>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>

        <Box p={"20px 20%"}>
          <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e, type: "number" } }) }} />
        </Box>
        <ConfirmAlert title={`¿Desea Eliminar de destacados a ${featureProductToDelete?.product?.name}?`} show={show} onClose={handleClose} />
      </Paper>
    </div>
  )
}

export default FeaturedProducts;
