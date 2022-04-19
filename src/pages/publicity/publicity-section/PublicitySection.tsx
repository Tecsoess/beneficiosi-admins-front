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

import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import SearchIcon from '@material-ui/icons/Search';

import Pagination from '../../../components/Pagination';


import useAds from "../../../hooks/useAds";
import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

import useAdsPositions from "../../../hooks/useAdsPositons";
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
}));

const PublicitySection = () => {

  const classes = useStyles();

  const [adsToDelete, setAdsToDelete] = useState<any>(null);

  const [show, setShow] = useState(false);

  const { setLoading, setCustomAlert } = useAuth();

  const [filters, setFilters] = useState({
    page: 1,
    id: "",
    title: "",
    description: "",
    storeName: "",
    minDate: "",
    maxDate: "",
    minPrice: "",
    maxPrice: "",
    url: "",
    adsPositionId: "",
  });

  const [{ ads, total, numberOfPages, size, error, loading }, getAds] = useAds({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

  const [{ adsPositions, error: adsPositionError, loading: adsPositionLoading }, getAdsPositions] = useAdsPositions();

  const [{ data: deleteData, error: deleteError }, deleteAds] = useAxios({ url: `/ads/${adsToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

  useEffect(() => {
    getAds({
      params: {
        ...filters,
        minDate: filters.minDate ? format(new Date(filters.minDate), "yyyy-MM-dd H:mm:ss") : "",
        maxDate: filters.maxDate ? format(new Date(filters.maxDate), "yyyy-MM-dd H:mm:ss") : ""
      }
    })
  }, [filters])

  useEffect(() => {
    if (deleteData !== undefined) {
      getAds().then(() => {
        setCustomAlert?.({ show: true, message: "La publicidad ha sido eliminada correctamente.", severity: "success" })
      });
    }
  }, [deleteData]);

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }

    if (adsPositionError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${adsPositionError?.response?.status === 400 ? adsPositionError?.response?.data.message[0] : adsPositionError?.response?.data.message}.`, severity: "error" });
    }
  }, [adsPositionError, error, deleteError]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Cargando datos" });
  }, [loading]);

  useEffect(() => {
    setLoading?.({ show: adsPositionLoading, message: "Cargando datos" });
  }, [adsPositionLoading]);

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

  const handleClose = async (e: any) => {
    setShow(false);
    if (e) {
      setLoading?.({ show: true, message: "Eliminando publicidad" });
      await deleteAds();
      setLoading?.({ show: false, message: "" });
    }

    setAdsToDelete(null);
  }


  const handleClearFilters = () => {
    setFilters({
      page: 1,
      id: "",
      title: "",
      description: "",
      storeName: "",
      minDate: "",
      maxDate: "",
      minPrice: "",
      maxPrice: "",
      url: "",
      adsPositionId: "",
    })
  }

  const handleDelete = (ads: any) => {
    setAdsToDelete(ads);
    setShow(true);
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <BallotOutlinedIcon style={{ fontSize: '40px' }} />
          <h1>Sección publicitaria</h1>
        </div>
      </Box>

      <Box mb={4} style={{ textAlign: 'right' }}>
        <Link style={{ textDecoration: "none" }} to={`/ads-management/publicity-section/create`}>
          <Button variant="contained" color="primary">
            Añadir publicidad
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
                <TableCell style={{ textAlign: 'center' }}>Titulo</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Descripcion</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Imagen</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Tienda</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha de inicio</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha final</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Costo</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Url</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Posicion</TableCell>
                <TableCell style={{ textAlign: 'center' }}>

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
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    name="title"
                    value={filters.title}
                    onChange={handleChange}
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    name="description"
                    value={filters.description}
                    onChange={handleChange}
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell>

                </TableCell>
                <TableCell>
                  <TextField
                    name="storeName"
                    value={filters.storeName}
                    onChange={handleChange}
                    variant="outlined"
                    size="small" />
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
                  </TableCell>
                </MuiPickersUtilsProvider>
                <TableCell>
                  <TextField
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    placeholder="desde..."
                    margin="dense" />
                  <TextField
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    placeholder="hasta..."
                    margin="dense" />
                </TableCell>
                <TableCell>
                  <TextField
                    name="url"
                    value={filters.url}
                    onChange={handleChange}
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    name="adsPositionId"
                    value={filters.adsPositionId}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    select>
                    {
                      adsPositions.map((adsPosition, i) => {
                        return (
                          <MenuItem key={i} value={adsPosition.id}>
                            {adsPosition.name}
                          </MenuItem>
                        )
                      })
                    }
                  </TextField>
                </TableCell>
                <TableCell>
                  <Button startIcon={<CloseIcon />} onClick={handleClearFilters}>
                    Limpiar filtros
                  </Button>
                </TableCell>
              </TableRow>
              {ads.length > 0 ?
                ads.map((ad, i) => <TableRow key={i}>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    <Box textAlign="center">
                      {ad.id}
                    </Box>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Box textAlign="center">
                      {ad.title}
                    </Box>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Box textAlign="center">
                      {ad.description}
                    </Box>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <img style={{ width: 80, height: 80, borderRadius: 5 }} src={`${process.env.REACT_APP_API_URL}/${ad.imgPath}`} alt="" />
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      <Link to={`/users-management/stores/${ad.store?.storeId}/edit`}>
                        {
                          ad.store?.storeProfile?.logo ?
                            <img style={{ height: 80, width: 80 }} src={`${process.env.REACT_APP_API_URL}/${ad.store?.storeProfile?.logo}`} alt="" />
                            :
                            <StoreMallDirectoryIcon style={{ fontSize: 80 }} />
                        }
                        <p>{ad?.store?.name}</p>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      {format(new Date(ad.from), "dd/MM/yyyy H:mm:ss")}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      {format(new Date(ad.until), "dd/MM/yyyy H:mm:ss")}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      $ {ad.price}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      <a href={ad.url}>
                        {ad.url}
                      </a>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box textAlign="center">
                      {ad?.adsPosition?.name}
                    </Box>
                  </TableCell>
                  <TableCell align="right" className={classes.actionCell}>
                    <IconButton size="small" component={Link} to={`/ads-management/publicity-section/${ad?.id}/edit`}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => { handleDelete(ad) }} color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
                :
                <TableRow>
                  <TableCell colSpan={11}>
                    <Box py={4} textAlign="center" color="red">
                      No se encontraron resultados.
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
        <ConfirmAlert title={`¿Desea Eliminar la publicidad de ${adsToDelete?.store?.name}?`} show={show} onClose={handleClose} />
      </Paper>
    </div>
  )
}

export default PublicitySection;
