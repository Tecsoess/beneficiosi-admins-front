import {
    Box,
    Button,
    IconButton,
    makeStyles,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";

import SearchIcon from '@material-ui/icons/Search';
import DescriptionIcon from '@material-ui/icons/Description';
import ClearIcon from '@material-ui/icons/Clear';
import { useEffect, useRef, useState } from "react";
import useOrders from "../hooks/useOrders";
import useOrdersStatuses from "../hooks/useOrdersStatuses";
import usePaymentMethods from "../hooks/usePaymentMethods";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import Card from "./Card";
import ListAltIcon from '@material-ui/icons/ListAlt';

const useStyles = makeStyles(theme => ({

    marginB: {
        marginBottom: theme.spacing(3),
    },
    purpleText: {
        color: '#B400C3',
    },
    cardTitle: {
        display: 'flex',
        '& > span': {
            marginLeft: theme.spacing(1),
        },
    },
    actionsCell: {
        whiteSpace: 'nowrap',
        '& > *:not(:last-child)': {
            marginRight: theme.spacing(1)
        }
    },
}));

const StoreOrdersTable = ({ storeId, clientId }: any) => {

    const classes = useStyles();

    const tableInitRef = useRef<any>();

    const [filters, setFilters] = useState({
        page: 1,
        id: "",
        storeId: storeId,
        clientName: "",
        orderNumber: "",
        address: "",
        minTotal: "",
        maxTotal: "",
        from: "",
        until: "",
        orderStatusCode: "",
        paymentMethodCode: "",
        sort: "createdAt,DESC",
        clientId: clientId
    });

    const [{ orders, error: ordersError, loading: ordersLoading, numberOfPages }, getOrders] = useOrders({ axiosConfig: { params: { ...filters } }, options: { useCache: false, manual: true } });

    const [{ paymentMethods, error: payMethodsError, loading: payMethodsLoading }, getPayMethods] = usePaymentMethods();

    const [{ ordersStatuses, error: ordersStatusesError, loading: ordersStatusesLoading }, getOrdersStatuses] = useOrdersStatuses();


    useEffect(() => {
        getOrders({
            params: {
                ...filters
            }
        })
    }, [filters]);

    useEffect(() => {
        getOrders({
            params: {
                ...filters,
                storeId: storeId
            }
        })
    }, [storeId]);

    const handleChange = (e: any) => {
        tableInitRef.current?.scrollIntoView();
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
            storeId: storeId,
            clientName: "",
            orderNumber: "",
            address: "",
            minTotal: "",
            maxTotal: "",
            from: "",
            until: "",
            orderStatusCode: "",
            paymentMethodCode: "",
            sort: "createdAt,DESC",
            clientId: clientId
        })
    }

    return (
        <Card titleWithBorder className={classes.marginB} title={<div className={classes.cardTitle}>
            <ListAltIcon ref={tableInitRef} color="primary" />
            <span>Historial de Ordenes</span>
        </div>}>
            <div />
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
                                    Numero de orden
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    Entrega
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    Cliente
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    Total
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    Fecha
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    Estado
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    PDF
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    Pago
                                </Box>
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    name="id"
                                    onChange={handleChange}
                                    value={filters.id}
                                    placeholder="id"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="orderNumber"
                                    onChange={handleChange}
                                    value={filters.orderNumber}
                                    placeholder="Numero de orden"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="address"
                                    onChange={handleChange}
                                    value={filters.address}
                                    placeholder="Dirección de entrega"
                                    variant="outlined"
                                    size="small"
                                    fullWidth>
                                </TextField>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="clientName"
                                    onChange={handleChange}
                                    value={filters.clientName}
                                    placeholder="Nombre de cliente"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="minTotal"
                                    onChange={handleChange}
                                    value={filters.minTotal}
                                    placeholder="min"
                                    margin="dense"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                                <TextField
                                    name="maxTotal"
                                    onChange={handleChange}
                                    value={filters.maxTotal}
                                    placeholder="max"
                                    margin="dense"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="from"
                                    onChange={handleChange}
                                    value={filters.from}
                                    placeholder="desde"
                                    margin="dense"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                                <TextField
                                    name="until"
                                    onChange={handleChange}
                                    value={filters.until}
                                    placeholder="hasta"
                                    margin="dense"
                                    variant="outlined"
                                    size="small"
                                    fullWidth />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="orderStatusCode"
                                    onChange={handleChange}
                                    value={filters.orderStatusCode}
                                    variant="outlined"
                                    size="small"
                                    fullWidth select>
                                    {
                                        ordersStatuses?.map((orderStatus, i) => {
                                            return (
                                                <MenuItem style={{ textTransform: "capitalize" }} key={i} value={orderStatus?.code}>{orderStatus?.name}</MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </TableCell>
                            <TableCell>
                                <Box textAlign="center">
                                    ---
                                </Box>
                            </TableCell>
                            <TableCell>
                                <TextField
                                    name="paymentMethodCode"
                                    onChange={handleChange}
                                    value={filters.paymentMethodCode}
                                    variant="outlined"
                                    size="small"
                                    style={{ textTransform: "capitalize" }}
                                    fullWidth
                                    select>
                                    {
                                        paymentMethods?.map((paymentMethod, i) => {
                                            return (
                                                <MenuItem style={{ textTransform: "capitalize" }} key={i} value={paymentMethod?.code}>{paymentMethod?.name}</MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </TableCell>
                            <TableCell>
                                <Button onClick={handleClearFilters} startIcon={<ClearIcon />} size="small">
                                    Limpiar Filtros
                                </Button>
                            </TableCell>
                        </TableRow>
                        {
                            ordersLoading ?
                                <TableRow>
                                    <TableCell colSpan={10} style={{ minHeight: "100vh" }}>
                                        <Box component="h1" textAlign="center">
                                            Obteniendo ordenes
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                :
                                orders.length > 0 ?
                                    orders.map((order, i) => <TableRow style={{ padding: 0 }} key={i}>
                                        <TableCell>
                                            <Box textAlign="center">
                                                <b>{order?.id}</b>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                <b>{order?.orderNumber}</b>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {order?.delivery?.profileAddress?.address}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                <Link to={`/users-management/clients/${order?.user?.id}/edit`}>
                                                    {
                                                        order?.user?.imgPath ?
                                                            <img style={{ height: 50, width: 50, borderRadius: "100%" }}
                                                                src={`${process.env.REACT_APP_API_URL}/${order?.user?.imgPath}`} alt={order?.user?.name} />
                                                            :
                                                            null
                                                    }
                                                    <p>{order?.user?.name}</p>
                                                </Link>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                $ {order?.total?.toLocaleString()}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {order?.createdAt}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box bgcolor={order?.orderStatus?.color} px={2} py={1} borderRadius={5} color="white" style={{ textTransform: "capitalize" }}>
                                                {order?.orderStatus?.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                {
                                                    order?.invoice ?
                                                        <DescriptionIcon />
                                                        :
                                                        '--'
                                                }
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center" style={{ textTransform: "capitalize" }}>
                                                {order?.paymentMethod?.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" className={classes.actionsCell}>
                                            <IconButton size="small" component={Link} to={`/orders-management/orders/${order?.id}/edit`}>
                                                <SearchIcon />  Ver
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>)
                                    :
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <Box component="p" color="red" textAlign="center">No hay Ordenes</Box>
                                        </TableCell>
                                    </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Box p={"20px 20%"}>
                <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
            </Box>
        </Card>
    )
}

export default StoreOrdersTable;
