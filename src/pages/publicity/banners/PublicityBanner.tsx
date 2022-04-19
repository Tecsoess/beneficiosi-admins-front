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
  makeStyles
} from "@material-ui/core";

import { Link } from "react-router-dom";

import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';

import Pagination from '../../../components/Pagination';
import clsx from "clsx";

import useBanners from "../../../hooks/useBanners";
import { useEffect, useState } from "react";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useAuth } from "../../../contexts/AuthContext";
import imageNotFound from '../../../assets/images/image-not-found.png';
import ConfirmAlert from "../../../components/ConfirmAlert";
import useAxios from "../../../hooks/useAxios";

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

const PublicityBanner = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [bannerToDelete, setBannerToDelete] = useState<any>(null);

  const [show, setShow] = useState(false);

  const classes = useStyles();

  const [filters, setFilters] = useState({
    page: 1,
    priority: "",
    id: "",
    storeName: "",
    minDate: "",
    maxDate: "",
    minPrice: "",
    maxPrice: "",
    url: "",
    isActive: ""
  });


  const [{ banners, numberOfPages, error, loading: loadingBanners }, getBanners] = useBanners({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

  const [{ data: deleteData, error: deleteError }, deleteBanner] = useAxios({ url: `/main-banner-ads/${bannerToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

  useEffect(() => {
    setLoading?.({ show: loadingBanners, message: "Cargando banners" });
  }, [loadingBanners]);


  useEffect(() => {
    getBanners({
      params: {
        ...filters,
        minDate: filters.minDate ? format(new Date(filters.minDate), "yyyy-MM-dd H:mm:ss") : "",
        maxDate: filters.maxDate ? format(new Date(filters.maxDate), "yyyy-MM-dd H:mm:ss") : ""
      }
    })
  }, [filters])

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
      getBanners().then(() => {
        setCustomAlert?.({ show: true, message: "El banner ha sido eliminado correctamente.", severity: "success" })
      });
    }
  }, [deleteData]);

  useEffect(() => {
    console.log(banners);
  }, [banners]);

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
      priority: "",
      id: "",
      storeName: "",
      minDate: "",
      maxDate: "",
      minPrice: "",
      maxPrice: "",
      url: "",
      isActive: ""
    })
  }

  const handleDelete = (banner: any) => {
    setBannerToDelete(banner);
    setShow(true);
  }

  const handleClose = async (e: any) => {
    setShow(false);
    if (e) {
      setLoading?.({ show: true, message: "Eliminando Banner" });
      await deleteBanner();
      setLoading?.({ show: false, message: "" });
    }

    setBannerToDelete(null);
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <AddPhotoAlternateOutlinedIcon style={{ fontSize: '40px' }} />
          <h1>Banner Publicitario</h1>
        </div>
      </Box>

      <Box mb={4} style={{ textAlign: 'right' }}>
        <Link style={{ textDecoration: "none" }} to={`/ads-management/publicity-banner/create`}>
          <Button variant="contained" color="primary">
            Añadir nuevo banner
          </Button>
        </Link>
      </Box>

      <Paper elevation={0}>
        <div className={classes.redBar} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>Prioridad</TableCell>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Imagen</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Tienda</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha de inicio</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha final</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Costo</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Url</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Estado</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>
                  <Box textAlign="center">
                    <TextField
                      onChange={handleChange}
                      name="priority"
                      value={filters.priority}
                      placeholder="prioridad..."
                      variant="outlined"
                      size="small" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    <TextField
                      onChange={handleChange}
                      name="id"
                      value={filters.id}
                      placeholder="id"
                      variant="outlined"
                      size="small" />
                  </Box>
                </TableCell>
                <TableCell>

                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    <TextField
                      onChange={handleChange}
                      name="storeName"
                      value={filters.storeName}
                      placeholder="Nombre de la tienda"
                      variant="outlined"
                      size="small" />
                  </Box>
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
                  <Box textAlign="center">
                    <TextField
                      margin="dense"
                      onChange={handleChange}
                      name="minPrice"
                      placeholder="min"
                      value={filters.minPrice
                      } variant="outlined" size="small" />
                    <TextField
                      margin="dense"
                      onChange={handleChange}
                      name="maxPrice"
                      placeholder="max"
                      value={filters.maxPrice
                      } variant="outlined" size="small" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    <TextField
                      onChange={handleChange}
                      name="url"
                      value={filters.url}
                      placeholder="url"
                      variant="outlined"
                      size="small" />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box textAlign="center">
                    <TextField
                      onChange={handleChange}
                      name="isActive"
                      value={filters.isActive}
                      variant="outlined"
                      size="small" select>
                      <MenuItem value={"true"}>Activo</MenuItem>
                      <MenuItem value={"false"}>Inactivo</MenuItem>
                    </TextField>
                  </Box>
                </TableCell>
                <TableCell>
                  <Button startIcon={<CloseIcon />} onClick={handleClearFilters}>
                    Limpiar filtros
                  </Button>
                </TableCell>
              </TableRow>
              {
                banners.length > 0 ?
                  banners.map((banner, i) => <TableRow key={i}>
                    <TableCell>
                      <Box textAlign="center">
                        {banner.priority}
                      </Box>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Box textAlign="center">
                        {banner.id}
                      </Box>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <Box textAlign="center">
                        <img style={{ width: 150, height: 80 }} src={`${process.env.REACT_APP_API_URL}/${banner.imgPath}`} alt="" />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        <Link to={`/users-management/stores/${banner?.store?.id}/edit`}>
                          {
                            banner.store?.storeProfile?.logo ?
                              <img style={{ width: 60, height: 60 }} src={`${process.env.REACT_APP_API_URL}/${banner.store?.storeProfile?.logo}`} alt="" />
                              :
                              <img style={{ height: 60, width: 60 }} src={imageNotFound} alt="" />
                          }
                          <p>
                            {banner.store?.name}
                          </p>
                        </Link>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        {banner.from}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        {banner.until}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        $ {banner.price}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        <a href={banner.url} target="_blank">
                          {banner.url}
                        </a>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box textAlign="center">
                        <span className={clsx({
                          [classes.textSuccess]: banner.status?.id === 1,
                          [classes.textPrimary]: banner.status?.id === 2,
                          [classes.textWarning]: banner.status?.id === 3,
                        })}>
                          {banner.status?.name}
                        </span>
                      </Box>
                    </TableCell>
                    <TableCell align="right" className={classes.actionCell}>
                      <IconButton size="small" component={Link} to={`/ads-management/publicity-banner/${banner.id}/edit`}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => { handleDelete(banner) }} color="primary" size="small">
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>)
                  :
                  <TableRow>
                    <TableCell colSpan={10}>
                      <Box textAlign="center" py={2} color="red">
                        No hay resultados.
                      </Box>
                    </TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
        {
          numberOfPages > 0 ?
            <Box p={"20px 20%"}>
              <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
            </Box>
            :
            null
        }
        <ConfirmAlert title={`¿Desea Eliminar el banner de ${bannerToDelete?.store?.name}?`} show={show} onClose={handleClose} />
      </Paper>
    </div>
  )
}

export default PublicityBanner;
