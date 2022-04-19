import {
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
  makeStyles
} from "@material-ui/core";

import { Link } from "react-router-dom";

import FastfoodIcon from '@material-ui/icons/Fastfood';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';

import Pagination from '../../components/Pagination';
import useProducts from "../../hooks/useProducts";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import findPortraitImg from "../../helpers/findPortraitImage";
import ConfirmAlert from "../../components/ConfirmAlert";
import useAxios from "../../hooks/useAxios";

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

const Products = () => {

  const classes = useStyles();

  const [filters, setFilters] = useState({
    page: 1,
    id: "",
    storeName: "",
    name: "",
    reference: "",
    minPrice: "",
    maxPrice: "",
    categoryName: "",
    minQuantity: "",
    maxQuantity: "",
    sort: "createdAt,DESC"
  });


  const [{ products, error, loading, size, numberOfPages, total }, getProducts] = useProducts({ options: { useCache: false }, axiosConfig: { params: { ...filters } } });

  const [productToDelete, setProductToDelete] = useState<any>(null);

  const [show, setShow] = useState(false);

  const [{ data: deleteData, error: deleteError }, deleteProduct] = useAxios({ url: `/products/${productToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

  const { setLoading, setCustomAlert } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0 })
    console.log(products);
  }, [products])

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Productos" });
  }, [loading]);


  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }
  }, [deleteError, error]);


  useEffect(() => {
    if (deleteData !== undefined) {
      getProducts().then(() => {
        setCustomAlert?.({ show: true, message: "Se ha eliminado el producto exitosamente.", severity: "success" });
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

  const handleDelete = (product: any) => {
    setProductToDelete(product);
    setShow(true);
  }

  const handleClose = async (e: any) => {
    setShow(false);
    if (e) {
      setLoading?.({ show: true, message: "Eliminando Producto" });
      await deleteProduct();
      setLoading?.({ show: false, message: "" });
    }

    setProductToDelete(null);
  }



  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <FastfoodIcon style={{ fontSize: '40px' }} />
          <h1>Productos</h1>
        </div>
      </Box>

      <Paper elevation={0}>
        <div className={classes.redBar} />
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
                    Imagen
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Nombre
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Referencia
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Precio
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Categoria
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    Cantidad
                  </Box>
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField name="id" value={filters.id} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField name="storeName" value={filters.storeName} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>

                </TableCell>
                <TableCell>
                  <TextField name="name" value={filters.name} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField name="reference" value={filters.reference} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField margin="dense" placeholder="min..." name="minPrice" value={filters.minPrice} onChange={handleChange} variant="outlined" size="small" />
                  <TextField margin="dense" placeholder="max..." name="maxPrice" value={filters.maxPrice} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField name="categoryName" value={filters.categoryName} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                  <TextField margin="dense" name="minQuantity" value={filters.minQuantity} onChange={handleChange} variant="outlined" size="small" />
                  <TextField margin="dense" name="maxQuantity" value={filters.maxQuantity} onChange={handleChange} variant="outlined" size="small" />
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
              {products.map((product, i) => <TableRow key={i}>
                <TableCell>
                  <Box textAlign="center">
                    {product.id}
                  </Box>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Link to={`/users-management/stores/${product.store?.storeId}/edit`}>
                    {
                      product.store?.storeProfile?.logo ?
                        <img style={{ height: 80, width: 80 }} src={`${process.env.REACT_APP_API_URL}/${product.store?.storeProfile?.logo}`} alt="" />
                        :
                        <StoreMallDirectoryIcon style={{ fontSize: 80 }} />
                    }
                    <p>{product.store.name}</p>
                  </Link>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <img style={{ width: 80, height: 80, borderRadius: 5 }} src={`${process.env.REACT_APP_API_URL}/${findPortraitImg(product.productImages).path}`} alt="" />
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    <a href={`${process.env.REACT_APP_HOST}products/${product.slug}`} target="_blank" >
                      {product.name}
                    </a>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    {
                      product?.productDetails?.reference ? 
                      `${product?.productDetails?.reference}`
                      :
                      null
                    }                                        
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    {
                      product?.productDetails?.price ? 
                      `$${product?.productDetails?.price}`
                      :
                      `Tiene funciones`
                    }                    
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    {product.categories.map((category: any) => category.name).join(", ")}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    {
                      product?.productDetails?.quantity ? 
                      `${product?.productDetails?.quantity}`
                      :
                      `Tiene funciones`
                    }                    
                  </Box>
                </TableCell>
                <TableCell align="right" className={classes.actionCell}>
                  <a href={`${process.env.REACT_APP_HOST}products/${product.slug}`} target="_blank" >
                    <IconButton size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </a>
                  <IconButton onClick={() => { handleDelete(product) }} color="primary" size="small">
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>

        <Box p={"20px 20%"}>
          <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
        </Box>
        <ConfirmAlert title={`¿Desea Eliminar ${productToDelete?.name}?`} show={show} onClose={handleClose} />
      </Paper>
    </div>
  )
}

export default Products;
