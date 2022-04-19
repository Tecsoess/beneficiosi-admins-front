import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core"

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import SearchIcon from '@material-ui/icons/Search';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';

import { useEffect, useState } from "react";

import ConfirmAlert from "../../../components/ConfirmAlert";
import Pagination from "../../../components/Pagination";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import useCardsIssuers from "../../../hooks/useCardsIssuers";
import useCardsIssuersTypes from "../../../hooks/useCardsIssuersTypes";
import { Link } from "react-router-dom";

const CardIssuers = () => {


    const { setCustomAlert, setLoading } = useAuth();

    const [canFilter, setCanFilter] = useState(false);

    const [filters, setFilters] = useState({ id: "", name: "", cardIssuerTypeId: "", page: 1 })

    const [show, setShow] = useState(false);

    const [cardIssuerToDelete, setCardIssuerToDelete] = useState<any>(null);

    const [{ cardsIssuers, numberOfPages, error, loading }, getCardsIssuers] = useCardsIssuers({ axiosConfig: { params: { ...filters } }, options: { useCache: false, manual: true } });

    const [{ cardsIssuersTypes, loading: cardsIssuersTypesLoading, error: cardsIssuersTypesError }, getCardsIssuersTypes] = useCardsIssuersTypes({ options: { useCache: false, manual: true } });

    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteCardIssuer] = useAxios({ url: `/card-issuers/${cardIssuerToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: deleteLoading, message: "Eliminando Emisor" });
    }, [deleteLoading]);

    useEffect(() => {
        setLoading?.({ show: true, message: "Cargando Datos" });
        Promise.all([getCardsIssuersTypes(), getCardsIssuers()]).then((values) => {
            setLoading?.({ show: false, message: "" });
            setCanFilter(true);
        })
    }, []);

    useEffect(() => {
        if (canFilter) {
            getCardsIssuers({ params: { ...filters } })
        }
    }, [filters])

    useEffect(() => {
        if (canFilter) {
            setLoading?.({ show: loading, message: "Obteniendo emisores" })
        }
    }, [loading])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }

        if (cardsIssuersTypesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsIssuersTypesError?.response?.status === 400 ? cardsIssuersTypesError?.response?.data.message[0] : cardsIssuersTypesError?.response?.data.message}.`, severity: "error" });
        }
    }, [deleteError, error, cardsIssuersTypesError]);

    useEffect(() => {
        if (deleteData !== undefined) {
            getCardsIssuers().then(() => {
                setCustomAlert?.({ show: true, message: "Se ha eliminado el emisor exitosamente.", severity: "success" });
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

    const handleDelete = (cardIssuer: any) => {
        setCardIssuerToDelete(cardIssuer);
        setShow(true);
    }

    const handleClose = async (e: any) => {
        setShow(false);
        if (e) {
            setLoading?.({ show: true, message: "Eliminando Emisor" });
            await deleteCardIssuer();
            setLoading?.({ show: false, message: "" });
        }

        setCardIssuerToDelete(null);
    }


    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <AccountBalanceIcon />
                Emisores de Tarjetas
            </Box>

            <Box my={4} textAlign="right">
                <Link style={{ textDecoration: "none" }} to={`/pay-settings/card-issuers/create`}>
                    <Button variant="contained" color="primary">
                        Añadir Emisor
                    </Button>
                </Link>
            </Box>

            <Paper elevation={0}>
                <Box bgcolor="red" p={4}>

                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Box textAlign="center">
                                        Id
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Nombre
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Tipo
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        <Button startIcon={<SearchIcon />}>
                                            Buscar
                                        </Button>
                                    </Box>
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
                                        size="small"
                                        fullWidth />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="name"
                                        value={filters.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="cardIssuerTypeId"
                                        value={filters.cardIssuerTypeId}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        style={{ textTransform: "capitalize" }}
                                        select>
                                        {
                                            cardsIssuersTypes.map((cardsIssuersType, i) => {
                                                return (
                                                    <MenuItem style={{ textTransform: "capitalize" }} key={i} value={cardsIssuersType.id}>
                                                        {cardsIssuersType.name}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                            {
                                cardsIssuers.length > 0 ?
                                    cardsIssuers.map((cardsIssuer, i) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {cardsIssuer?.id}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        <img
                                                            style={{ height: 80, width: 80, borderRadius: 10 }}
                                                            src={`${process.env.REACT_APP_API_URL}/${cardsIssuer?.imgPath}`}
                                                            alt={cardsIssuer?.name} />
                                                        <p>
                                                            {cardsIssuer?.name}
                                                        </p>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        <p style={{ textTransform: "capitalize" }}>{cardsIssuer?.cardIssuerType?.name}</p>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-around">
                                                        <Link to={`/pay-settings/card-issuers/${cardsIssuer?.id}/edit`}>
                                                            <IconButton size="small">
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Link>
                                                        <IconButton onClick={() => { handleDelete(cardsIssuer) }} color="primary" size="small">
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Box component="p" color="red" textAlign="center">No se encontraron resultados.</Box>
                                        </TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box p={"20px 20%"}>
                    <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
                </Box>
                <ConfirmAlert title={`¿Desea Eliminar ${cardIssuerToDelete?.name}?`} show={show} onClose={handleClose} />
            </Paper>
        </Box>
    )
}

export default CardIssuers;