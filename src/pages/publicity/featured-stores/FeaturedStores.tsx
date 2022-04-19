import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";

import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import StoreIcon from '@material-ui/icons/Store';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import SearchIcon from '@material-ui/icons/Search';

import Pagination from "../../../components/Pagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import useStoreAds from "../../../hooks/useStoreAds";
import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { useAuth } from "../../../contexts/AuthContext";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

const FeaturedStores = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({
        id: "",
        storeName: "",
        minPrice: "",
        maxPrice: "",
        minDate: "",
        maxDate: "",
        page: 1,
        priority: ""
    });


    const [{ storeAds, size, total, numberOfPages, error, loading }, getStoreAds] = useStoreAds({ options: { useCache: false }, axiosConfig: { params: { ...filters } } });

    const [storeAdsToDelete, setStoreAdsToDelete] = useState<any>();


    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteStoreAds] = useAxios({ url: `/store-ads/${storeAdsToDelete?.id}`, method: "DELETE" }, { useCache: false, manual: true });

    const [show, setShow] = useState(false);

    useEffect(() => {
        setLoading?.({ show: loading, message: "Cargando publicidades" });
    }, [loading]);

    useEffect(() => {
        getStoreAds({
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
            getStoreAds().then(() => {
                setCustomAlert?.({ show: true, message: "La publicidad ha sido eliminada correctamente.", severity: "success" })
            });
        }
    }, [deleteData]);

    useEffect(() => {
        console.log(storeAds);
    }, [storeAds]);


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
            id: "",
            storeName: "",
            minPrice: "",
            maxPrice: "",
            minDate: "",
            maxDate: "",
            page: 1,
            priority: ""
        })
    }

    const handleDelete = (storeAds: any) => {
        setStoreAdsToDelete(storeAds);
        setShow(true);
    }

    const handleClose = async (e: any) => {
        setShow(false);
        if (e) {
            setLoading?.({ show: true, message: "Eliminando publicidad de tienda" });
            await deleteStoreAds();
            setLoading?.({ show: false, message: "" });
        }

        setStoreAdsToDelete(null);
    }

    return (
        <Box>
            <Box mb={2} color="gray" display="flex" alignItems="center">
                <StoreIcon style={{ fontSize: '40px' }} />
                <h1>Publicidades de tiendas</h1>
            </Box>

            <Box mb={4} style={{ textAlign: 'right' }}>
                <Link style={{ textDecoration: "none" }} to={`/ads-management/featured-stores/create`}>
                    <Button variant="contained" color="primary">
                        Añadir Publicidad
                    </Button>
                </Link>
            </Box>

            <Paper elevation={0}>
                <Box bgcolor="red" height={50}>

                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Box textAlign="center">
                                        Prioridad
                                    </Box>
                                </TableCell>
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
                                        Precio
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Fecha de Inicio
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    <Box textAlign="center">
                                        Fecha final
                                    </Box>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <TextField name="priority" value={filters.priority} onChange={handleChange} variant="outlined" size="small" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="id" value={filters.id} onChange={handleChange} variant="outlined" size="small" />
                                </TableCell>
                                <TableCell>
                                    <TextField name="storeName" value={filters.storeName} onChange={handleChange} variant="outlined" size="small" />
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        <TextField
                                            margin="dense"
                                            type="number"
                                            name="minPrice"
                                            value={filters.minPrice}
                                            onChange={handleChange}
                                            variant="outlined"
                                            size="small" />

                                        <TextField
                                            margin="dense"
                                            type="number"
                                            name="maxPrice"
                                            value={filters.maxPrice}
                                            onChange={handleChange}
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
                                    <Button startIcon={<CloseIcon />} onClick={handleClearFilters}>
                                        Limpiar filtros
                                    </Button>
                                </TableCell>
                            </TableRow>
                            {
                                storeAds.length > 0 ?
                                    storeAds.map((storeAd, i) => <TableRow key={i}>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {storeAd.priority}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {storeAd.id}
                                            </Box>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Box textAlign="center" color="gray">
                                                <Link style={{ textDecoration: "none", color: "gray" }} to={`/users-management/stores/${storeAd?.store.storeId}/edit`}>
                                                    {
                                                        storeAd.store?.storeProfile?.logo ?
                                                            <img style={{ height: 80, width: 80 }} src={`${process.env.REACT_APP_API_URL}/${storeAd.store?.storeProfile?.logo}`} alt="" />
                                                            :
                                                            <StoreMallDirectoryIcon style={{ fontSize: 80 }} />
                                                    }
                                                    <p>{storeAd.store?.name}</p>
                                                </Link>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                $ {storeAd.price}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {format(new Date(storeAd.from), "dd/MM/yyyy H:mm:ss")}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {format(new Date(storeAd.until), "dd/MM/yyyy H:mm:ss")}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box display="flex" justifyContent="center" alignItems="center">
                                                <IconButton onClick={() => { handleDelete(storeAd) }} color="primary" size="small">
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>
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

                <Box p={"20px 20%"}>
                    <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
                </Box>
                <ConfirmAlert title={`¿Desea eliminar la publicidad de ${storeAdsToDelete?.store?.name}?`} show={show} onClose={handleClose} />
            </Paper>
        </Box>
    )
}

export default FeaturedStores;