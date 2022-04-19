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
  Grid
} from "@material-ui/core";

import { Link } from "react-router-dom";

import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import StoreIcon from '@material-ui/icons/Store';
import StarOutlinedIcon from '@material-ui/icons/StarOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';

import Pagination from '../../components/Pagination';
import useDiscounts from "../../hooks/useDiscounts";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import CloseIcon from '@material-ui/icons/Close';
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

  resumeCardTitles: {
    color: theme.palette.primary.main
  },

  resumeCardValues: {
    color: theme.palette.grey[400]
  },

  resumeCardIcons: {
    fontSize: '50px',
    marginRight: '20px'
  },

  resumeCardIconsStar: {
    fontSize: '50px',
    marginRight: '20px',
    color: theme.palette.warning.main
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



const Discounts = () => {

  const classes = useStyles();

  const { setCustomAlert, setLoading } = useAuth();

  const [filters, setFilters] = useState({
    page: 1,
    id: "",
    storeName: "",
    name: "",
    maxValue: "",
    minValue: "",
    minDate: "",
    maxDate: "",
    sort: "createdAt,DESC"
  });

  const [{ discounts, numberOfPages, total: discountsTotal, error: discountsError, loading: discountsLoading }, getDiscounts] = useDiscounts({ options: { useCache: false }, axiosConfig: { params: { ...filters } } });

  const [{data: discountsSummaryData}] = useAxios({url: `/summaries/discounts`}, {useCache: false})

  useEffect(() => {
    console.log(discountsSummaryData);
  }, [discountsSummaryData])

  useEffect(() => {
    setLoading?.({ show: discountsLoading, message: "Obteniendo descuentos" });
  }, [discountsLoading]);

  useEffect(() => {
    if (discountsError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${discountsError?.response?.status === 400 ? discountsError?.response?.data.message[0] : discountsError?.response?.data.message}.`, severity: "error" });
    }
  }, [discountsError]);

  useEffect(() => {
    getDiscounts({
      params: {
        ...filters,
        minDate: filters.minDate ? format(new Date(filters.minDate), "yyyy-MM-dd H:mm:ss") : "",
        maxDate: filters.maxDate ? format(new Date(filters.maxDate), "yyyy-MM-dd H:mm:ss") : ""
      }
    })
  }, [filters])

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
      storeName: "",
      name: "",
      maxValue: "",
      minValue: "",
      minDate: "",
      maxDate: "",
      sort: "createdAt,DESC"
    })
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <ArrowDownwardOutlinedIcon style={{ fontSize: '40px' }} />
          <h1>Descuentos</h1>
        </div>
      </Box>

      <Box bgcolor="white" mb={10} className="bg-white rounded p-4">
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Grid container alignItems="center">
              <Grid item alignItems="center">
                <ArrowDownwardOutlinedIcon color="primary" className={classes.resumeCardIcons} />
              </Grid>
              <Grid item alignItems="center">
                <h3 className={classes.resumeCardTitles}>Numero de descuentos</h3>
                <h1 className={classes.resumeCardValues}>{discountsSummaryData?.discountsCount}</h1>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Grid container alignItems="center">
              <Grid item alignItems="center">
                <StarOutlinedIcon className={classes.resumeCardIconsStar} />
              </Grid>
              <Grid item alignItems="center">
                <h3 className={classes.resumeCardTitles}>Mejor descuento</h3>
                <h1 className={classes.resumeCardValues}>{discountsSummaryData?.bestDiscount?.name ? `${discountsSummaryData?.bestDiscount?.name} - ${discountsSummaryData?.bestDiscount?.value}%` : "No hay descuento."}</h1>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Grid container alignItems="center">
              <Grid item alignItems="center">
                <EqualizerOutlinedIcon color="error" className={classes.resumeCardIcons} />
              </Grid>
              <Grid xs={9} item alignItems="center">
                <h3 className={classes.resumeCardTitles}>Tienda con mas descuentos</h3>
                <h1 className={classes.resumeCardValues}>{discountsSummaryData?.storeWithMoreDiscounts?.name ? discountsSummaryData?.storeWithMoreDiscounts?.name : 'No hay tienda.'}</h1>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Paper elevation={0}>
        <div className={classes.redBar} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Nombre</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Imagen</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Tienda</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Descuento</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha Inicial</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Fecha Final</TableCell>
                <TableCell style={{ textAlign: 'center' }}><Button>Buscar</Button></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="id"
                    label="id"
                    onChange={handleChange}
                    value={filters.id}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="name"
                    label="Nombre"
                    onChange={handleChange}
                    value={filters.name}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="storeName"
                    onChange={handleChange}
                    value={filters.storeName}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    margin="dense"
                    name="minValue"
                    label="min"
                    onChange={handleChange}
                    value={filters.minValue}
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    margin="dense"
                    name="maxValue"
                    label="max"
                    onChange={handleChange}
                    value={filters.maxValue}
                    variant="outlined"
                    size="small"
                  />
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
              {discounts.map((discount, i) => <TableRow key={i}>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {discount.id}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {discount.name}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <img style={{ width: 80, height: 80 }} src={`${process.env.REACT_APP_API_URL}/${discount?.imgPath}`} alt="" />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Link to={`/users-management/stores/${discount?.store?.storeId}/edit`}>
                    <img style={{ width: 50, height: 50 }} src={`${process.env.REACT_APP_API_URL}/${discount?.store?.storeProfile?.logo}`} alt="" />
                    <p>{discount.store.name}</p>
                  </Link>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {discount?.value} %
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>

                  {format(new Date(discount?.from), "dd/MM/yyyy")}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {format(new Date(discount?.until), "dd/MM/yyyy")}
                </TableCell>
                <TableCell align="right" className={classes.actionCell}>
                  <IconButton size="small" component={Link} to={`/users-management/stores/${discount?.store?.storeId}/edit`}>
                    <StoreIcon />
                    <p>Ver tienda</p>
                  </IconButton>
                </TableCell>
              </TableRow>)}
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

export default Discounts;
