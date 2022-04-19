import { Box, Button, Grid, IconButton, makeStyles, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import useFeatureStores from "../../../hooks/useFeatureStores";

import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import SearchIcon from '@material-ui/icons/Search';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import CloseIcon from '@material-ui/icons/Close';

import { Link } from "react-router-dom";
import useCategories from "../../../hooks/useCategories";
import { useEffect, useState } from "react";
import Pagination from "../../../components/Pagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useAuth } from "../../../contexts/AuthContext";
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
}));

const FeatureStores = () => {

    const classes = useStyles();

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({ id: null, name: "", storeCategoryId: null, page: 1 });
    const [show, setShow] = useState(false);
    const [featureStoreToDelete, setFeatureStoreToDelete] = useState<any>(null);

    const [{ featureStores, loading, error, total, numberOfPages }, getFeatureStores] = useFeatureStores({ options: { useCache: false } });

    const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteFeatureStore] = useAxios({ url: `/store-features/${featureStoreToDelete?.id}`, method: "DELETE" }, { useCache: false, manual: true });

    const [{ categories, error: categoriesError }, getCategories] = useCategories({ options: { useCache: false } });

    useEffect(() => {
        setLoading?.({ show: loading, message: 'Obteniendo Caracteristicas' })
    }, [loading])

    useEffect(() => {
        getFeatureStores({
            params: {
                ...filters
            }
        });
    }, [filters])

    useEffect(() => {
        if (deleteData !== undefined) {
            getFeatureStores().then(() => {
                setCustomAlert?.({ show: true, message: "Se ha eliminado la caracteristica exitosamente.", severity: "success" });
            });
        }
    }, [deleteData])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (deleteError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
        }

        if (categoriesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesError?.response?.status === 400 ? categoriesError?.response?.data.message[0] : categoriesError?.response?.data.message}.`, severity: "error" });
        }
    }, [deleteError, error, categoriesError]);

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

    const handleDelete = (tag: any) => {
        setShow(true);
        setFeatureStoreToDelete(tag);
    }

    const closeAlert = () => {
        setShow(false);
        setFeatureStoreToDelete(null);
    }

    const handleConfirmDelete = async () => {
        setShow(false);
        setLoading?.({ show: true, message: "Eliminando Caracteristica" });
        await deleteFeatureStore();
        setLoading?.({ show: false, message: "" });
    }

    return (
        <div>
            <Box mb={4}>
                <div className={classes.pageTilte}>
                    <LocalOfferOutlinedIcon style={{ fontSize: '40px' }} />
                    <h1>Caracteristicas de tiendas</h1>
                </div>
            </Box>

            <Box mb={4} style={{ textAlign: 'right' }}>
                <Link style={{ textDecoration: "none" }} to={'/settings/feature-stores/create'}>
                    <Button variant="contained" color="primary">
                        Crear Caracteristica
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
                                <TableCell style={{ textAlign: 'center' }}>Nombre</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Categoria</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <TextField onChange={handleChange} name="id" value={filters.id} variant="outlined" size="small" />
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <TextField onChange={handleChange} name="name" value={filters.name} variant="outlined" size="small" />
                                </TableCell>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <TextField
                                        disabled={!categories || categories.length < 1 ? true : false}
                                        onChange={handleChange}
                                        value={filters.storeCategoryId}
                                        name="storeCategoryId"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        select>
                                        {
                                            categories?.map((category, i) => {
                                                return (
                                                    <MenuItem value={category.id} key={i}>
                                                        {category.name}
                                                    </MenuItem>
                                                )
                                            })
                                        }
                                    </TextField>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            {
                                featureStores?.length > 0 ?
                                    featureStores.map((featureStore, i) => <TableRow key={i}>
                                        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            {featureStore.id}
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Link to={`/settings/feature-stores/${featureStore?.id}/edit`}>
                                                {featureStore.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center', textTransform: "capitalize" }}>
                                            {featureStore.storeCategory.name}
                                        </TableCell>
                                        <TableCell align="right" className={classes.actionCell}>
                                            <IconButton size="small" component={Link} to={`/settings/feature-stores/${featureStore?.id}/edit`}>
                                                <CreateOutlinedIcon />
                                            </IconButton>
                                            <IconButton onClick={() => { handleDelete(featureStore) }} color="primary" size="small">
                                                <CloseIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>)
                                    :
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Box textAlign="center" color="red">
                                                No hay categorias
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
            </Paper>

            <ConfirmAlert
                show={show}
                title={"¿Deseas eliminar la caracteristica?"}
                description={featureStoreToDelete?.name}
                onCancel={closeAlert}
                onConfirm={handleConfirmDelete} />
        </div>
    )
}

export default FeatureStores;