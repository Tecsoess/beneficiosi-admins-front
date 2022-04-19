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
    makeStyles,
    Button
} from "@material-ui/core";
import { useEffect, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";
import useBrands from "../../../hooks/useBrands";

import CategoryIcon from '@material-ui/icons/Category';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';
import Pagination from "../../../components/Pagination";
import ConfirmAlert from "../../../components/ConfirmAlert";

import useAxios from "../../../hooks/useAxios";
import { Link } from "react-router-dom";

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

const Brands = () => {

    const classes = useStyles();
    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({
        page: 1,
        id: "",
        name: "",
        sort: "createdAt,DESC"
    });


    const [{ brands, total, numberOfPages, size, error, loading }, getBrands] = useBrands({ options: { useCache: false }, axiosConfig: { params: { ...filters } } });

    const [brandToDelete, setBrandToDelete] = useState<any>(null);

    const [show, setShow] = useState(false);

    const [{ data: deleteData, error: deleteError }, deleteBrand] = useAxios({ url: `/brands/${brandToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: loading, message: "Obteniendo marcas" });
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
            getBrands().then(() => {
                setCustomAlert?.({ show: true, message: "Se ha eliminado la marca exitosamente.", severity: "success" });
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

    const handleDelete = (Brand: any) => {
        setBrandToDelete(Brand);
        setShow(true);
    }

    const handleClose = async (e: any) => {
        setShow(false);
        if (e) {
            setLoading?.({ show: true, message: "Eliminando marca" });
            await deleteBrand();
            setLoading?.({ show: false, message: "" });
        }

        setBrandToDelete(null);
    }



    return (
        <div>
            <Box mb={4}>
                <div className={classes.pageTilte}>
                    <CategoryIcon style={{ fontSize: '40px' }} />
                    <h1>Marcas</h1>
                </div>
            </Box>

            <Box mb={4} style={{ textAlign: 'right' }}>
                <Link style={{ textDecoration: "none" }} to={'/catalog/brands/create'}>
                    <Button variant="contained" color="primary">
                        Añadir marca
                    </Button>
                </Link>
            </Box>

            <Paper elevation={0}>
                <div className={classes.redBar} />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ textAlign: "center" }}>
                                    <Box textAlign="center">
                                        ID
                                    </Box>
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <Box textAlign="center">
                                        Nombre
                                    </Box>
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ textAlign: "center" }}>
                                    <TextField
                                        name="id"
                                        value={filters.id}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small" />
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <TextField
                                        name="name"
                                        value={filters.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small" />
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                </TableCell>
                            </TableRow>
                            {brands.map((brand, i) => <TableRow key={i}>
                                <TableCell style={{ textAlign: "center" }}>
                                    <Box textAlign="center">
                                        {brand.id}
                                    </Box>
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                    <Box textAlign="center">
                                        <a href={`/brands/${brand.id}`} target="_blank" >
                                            {brand.name}
                                        </a>
                                    </Box>
                                </TableCell>
                                <TableCell align="right" className={classes.actionCell}>
                                    <a href={`${process.env.REACT_APP_HOST}Brands/${brand.id}`} target="_blank" >
                                        <IconButton size="small">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </a>
                                    <IconButton onClick={() => { handleDelete(brand) }} color="primary" size="small">
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
                <ConfirmAlert title={`¿Desea Eliminar ${brandToDelete?.name}?`} show={show} onClose={handleClose} />
            </Paper>
        </div>
    )
}

export default Brands;
