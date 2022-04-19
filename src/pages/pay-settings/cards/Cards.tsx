import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";

import CreditCardIcon from '@material-ui/icons/CreditCard';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Pagination from "../../../components/Pagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import useCards from "../../../hooks/useCards";

const Cards = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({
        id: "",
        name: "",
        cardTypeName: "",
        cardIssuerName: "",
        page: 1
    });

    const [show, setShow] = useState(false);

    const [cardToDelete, setCardToDelete] = useState<any>(null);

    const [{ cards, numberOfPages, error, loading }, getCards] = useCards({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ error: deleteError }, deleteCard] = useAxios({ url: `/cards/${cardToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        console.log(cards);
    }, [cards])

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

    const handleDelete = (card: any) => {
        setCardToDelete(card);
        setShow(true);
    }

    const handleClose = async (e: any) => {
        setShow(false);
        if (e) {
            setLoading?.({ show: true, message: "Eliminando Tarjeta" });
            await deleteCard().then(() => {
                getCards().then(() => {
                    setCustomAlert?.({ show: true, message: "Se ha eliminado la tarjeta exitosamente.", severity: "success" });
                });
            });
            setLoading?.({ show: false, message: "" });
        }

        setCardToDelete(null);
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <CreditCardIcon />
                Tarjetas
            </Box>

            <Box textAlign="right" my={4}>
                <Link style={{ textDecoration: "none" }} to={"/pay-settings/cards/create"}>
                    <Button variant="contained" color="primary">
                        Crear Tarjeta
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
                                        Tipo de tarjeta
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Emisor
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
                                        name="cardTypeName"
                                        value={filters.cardTypeName}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="cardIssuerName"
                                        value={filters.cardIssuerName}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth />
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                            {
                                cards.length > 0 ?
                                    cards.map((card: any, i: number) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {card?.id}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {
                                                            card?.imgPath ?
                                                                <img
                                                                    style={{ height: 80, width: 120, borderRadius: 10 }}
                                                                    src={`${process.env.REACT_APP_API_URL}/${card?.imgPath}`}
                                                                    alt={card?.name} />
                                                                :
                                                                "No tiene"
                                                        }
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {card?.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {card?.cardType?.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {
                                                            card?.cardIssuer ?
                                                                <>
                                                                    <img
                                                                        style={{ height: 80, width: 80, borderRadius: 10 }}
                                                                        src={`${process.env.REACT_APP_API_URL}/${card?.cardIssuer?.imgPath}`}
                                                                        alt={card?.cardIssuer?.name} />
                                                                    <p>
                                                                        {card?.cardIssuer?.name}
                                                                    </p>
                                                                </>
                                                                :
                                                                "No tiene"
                                                        }
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-around">
                                                        <Link to={`/pay-settings/cards/${card?.id}/edit`}>
                                                            <IconButton size="small">
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Link>
                                                        <IconButton onClick={() => { handleDelete(card) }} color="primary" size="small">
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={8}>
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
                <ConfirmAlert title={`¿Desea Eliminar la tarjeta ${cardToDelete?.name}?`} show={show} onClose={handleClose} />
            </Paper>
        </Box >
    )
}

export default Cards;