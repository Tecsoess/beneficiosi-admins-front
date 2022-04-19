import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import useCardsTypes from "../../../hooks/useCardsTypes";
import Pagination from "../../../components/Pagination";

const CardsTypes = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({ id: "", name: "", page: 1 });

    const [show, setShow] = useState(false);

    const [cardsTypeToDelete, setCardsTypeToDelete] = useState<any>(null);

    const [{ cardsTypes, numberOfPages, error, loading }, getCardsTypes] = useCardsTypes({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ data: deleteData, error: deleteError }, deleteCardsType] = useAxios({ url: `/card-types/${cardsTypeToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: loading, message: "Cargando" });
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
    }, [deleteError, error]);

    useEffect(() => {
        if (deleteData !== undefined) {
            getCardsTypes().then(() => {
                setCustomAlert?.({ show: true, message: "Se ha eliminado el tipo exitosamente.", severity: "success" });
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

    const handleDelete = (cardsType: any) => {
        setCardsTypeToDelete(cardsType);
        setShow(true);
    }

    const handleClose = async (e: any) => {
        setShow(false);
        if (e) {
            setLoading?.({ show: true, message: "Eliminando Tipo de cuenta" });
            await deleteCardsType();
            setLoading?.({ show: false, message: "" });
        }

        setCardsTypeToDelete(null);
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <DynamicFeedIcon />
                Tipos de Tarjetas
            </Box>

            <Box textAlign="right" my={4}>
                <Link style={{ textDecoration: "none" }} to={"/pay-settings/cards-types/create"}>
                    <Button variant="contained" color="primary">
                        Crear tipo de Tarjeta
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
                                </TableCell>
                            </TableRow>
                            {
                                cardsTypes.length > 0 ?
                                    cardsTypes.map((cardType: any, i: number) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {cardType?.id}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {cardType?.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-around">
                                                        <Link to={`/pay-settings/cards-types/${cardType.id}/edit`}>
                                                            <IconButton size="small">
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Link>
                                                        <IconButton onClick={() => { handleDelete(cardType) }} color="primary" size="small">
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={3}>
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
                <ConfirmAlert title={`¿Desea Eliminar el tipo ${cardsTypeToDelete?.name}?`} show={show} onClose={handleClose} />
            </Paper>
        </Box >
    )
}


export default CardsTypes;