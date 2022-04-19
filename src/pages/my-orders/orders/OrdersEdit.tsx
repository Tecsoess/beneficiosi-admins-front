import { Box, Button, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import AirportShuttleOutlinedIcon from '@material-ui/icons/AirportShuttleOutlined';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import MoneyIcon from '@material-ui/icons/Money';
import PaymentIcon from '@material-ui/icons/Payment';
import PrintIcon from '@material-ui/icons/Print';
import 'date-fns';
import { format } from 'date-fns';
import OptionsModal from "../../../components/OptionsModal";
import useOrdersStatuses from "../../../hooks/useOrdersStatuses";
import PrintOrdersComponent from "../../../components/PrintOrdersComponent";
import SubjectErrorModal from "../../../components/SubjectErrorModal";
import VouchersModal from "../../../components/VouchersModal";


const OrdersEdit = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const { id } = useParams<any>();

    const [order, setOrder] = useState<any>(null);

    const [print, setPrint] = useState(false);

    const [open, setOpen] = useState(false);

    const [voucher, setVoucher] = useState('');

    const [payError, setPayError] = useState<any>({ status: null, open: false });

    const [{ data: orderData, error: orderError, loading: orderLoading }, getOrder] = useAxios({ url: `orders/${id}` }, { useCache: false });

    const [{ data: updateData, error: updateError }, updateOrder] = useAxios({ url: `/orders/${id}/status`, method: "PUT" }, { manual: true, useCache: false });

    const [{ ordersStatuses, error: ordersStatusesError, loading: orderStatusesLoading }, getOrdersStatuses] = useOrdersStatuses({ axiosConfig: { params: { allowedByCodeAndRole: `${order?.orderStatus?.code},ADMIN` } }, options: { manual: true, useCache: false } });

    useEffect(() => {
        if (order) {
            getOrdersStatuses({ params: { allowedByCodeAndRole: `${order?.orderStatus?.code},ADMIN` } })
        }
        console.log(order);
    }, [order])

    useEffect(() => {
        console.log(ordersStatuses);
    }, [ordersStatuses])

    useEffect(() => {
        if (orderData) {
            setOrder(orderData);
        }
    }, [orderData]);

    useEffect(() => {
        if (updateData) {
            setLoading?.({ show: false, message: "" });
            setOrder(updateData);
            setCustomAlert?.({ show: true, message: "El estado ha sido actualizado exitosamente.", severity: "success" });
            setPayError({ status: null, open: false })
        }
    }, [updateData])

    useEffect(() => {
        if (orderError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${orderError?.response?.status === 400 ? orderError?.response?.data.message[0] : orderError?.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }

        if (ordersStatusesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${ordersStatusesError?.response?.status === 400 ? ordersStatusesError?.response?.data.message[0] : ordersStatusesError?.response?.data.message}.`, severity: "error" });
        }
    }, [orderError, updateError, ordersStatusesError]);

    useEffect(() => {
        setLoading?.({ show: orderLoading, message: "Obteniendo información" });
    }, [orderLoading]);

    const handleClose = async (e: any) => {
        setOpen(false);
        if (e?.code === "ors-003") {
            setPayError({ status: e, open: true });
            return;
        }

        if (e) {
            setLoading?.({ show: true, message: "Actualizando orden" });
            await updateOrder({ data: { orderStatusCode: e.code } })
            setLoading?.({ show: false, message: "" });
        }
    }

    const handlePrint = () => {
        setPrint((oldPrint) => !oldPrint);
    }

    const handleCloseSubjectModal = async (e: any) => {
        setPayError((oldPayError: any) => {
            return {
                ...oldPayError,
                open: false
            }
        });

        if (e) {
            setLoading?.({ show: true, message: "Actualizando orden" });
            await updateOrder({ data: { orderStatusCode: payError?.status?.code, reason: e } })
            setLoading?.({ show: false, message: "" });
        }
    }

    return (
        <Box p={4}>
            <Box bgcolor="white" p={4}>
                <Box textAlign="right">
                    <IconButton onClick={handlePrint} color="primary">
                        <PrintIcon />
                    </IconButton>
                </Box>
                <Grid container spacing={4} alignItems="center">
                    <Grid item md={6}>
                        <Box component="h2" color="gray">
                            Detalle de orden{`: ${order?.orderNumber ? order?.orderNumber : ""}`}
                        </Box>
                        <Box color="gray" mb={4}>
                            Fecha: {order?.createdAt}
                        </Box>
                        <Box color="gray">
                            Comprador: <Link style={{ textDecoration: "none" }} to={`/users-management/clients/${order?.user?.id}/edit`}>
                                <Box component="h2" color="gray">
                                    {order?.user?.name}
                                </Box>
                            </Link>
                        </Box>
                        <Box color="gray">
                            Tienda:
                            <Link style={{ textDecoration: "none" }} to={`/users-management/stores/${order?.store?.storeId}/edit`}>
                                <Box component="h2" color="gray">
                                    {order?.store?.name}
                                </Box>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item md={6}>
                        <Box p={2}>
                            <Box color="gray" component="h3">
                                Historial de la orden:
                            </Box>
                            <Box height="200px" className="custom-scrollbar" mb={2} style={{ overflowY: "auto" }}>
                                {
                                    order?.orderStatusHistory?.map((status: any, i: number) => {
                                        return (
                                            <Box p={0} key={i} display="flex" justifyContent="space-around" alignItems="center">
                                                <Box
                                                    color="gray"
                                                    component="h4"
                                                    textAlign="center"
                                                >
                                                    {format(new Date(order?.createdAt), "EEEE d")} de {format(new Date(order?.createdAt), "MMMM")} de {format(new Date(order?.createdAt), "y")} a las {format(new Date(order?.createdAt), "H:mm:ss")}
                                                </Box>
                                                <Box
                                                    color="white"
                                                    style={{ textTransform: "capitalize", borderRadius: 5 }}
                                                    textAlign="center"
                                                    px={4}
                                                    py={1}
                                                    bgcolor={status?.newOrderStatus?.color}>
                                                    {status?.newOrderStatus?.name}
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                            <Box textAlign="right">
                                {
                                    orderStatusesLoading ?
                                        "Cargando..."
                                        :
                                        ordersStatuses.length > 0 &&
                                        <Button variant="contained" color="primary" onClick={() => { setOpen(true) }}>
                                            Cambiar estado
                                        </Button>
                                }
                            </Box>
                            {
                                order?.orderRejectionReason &&
                                <Box>
                                    <Box component="h3" color="gray">
                                        Motivo del rechazo:
                                    </Box>
                                    <Box color="red">
                                        {order?.orderRejectionReason?.reason}
                                    </Box>
                                </Box>
                            }
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box px={4}>
                            <Box borderTop="1px solid gray" />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box textAlign="center" display="flex" alignItems="center" color="gray" component="h3">
                            <AttachMoneyIcon /> Información de pago:
                        </Box>
                        <Grid container>
                            <Grid item>
                                <Box style={{ textTransform: "capitalize" }} p={2} display="flex" alignItems="center" color="gray">
                                    <PaymentIcon style={{ marginRight: 4 }} />
                                    Forma de pago: {order?.paymentMethod?.name}
                                </Box>
                            </Grid>
                        </Grid>
                        <Box component="h3" textAlign="center" color="gray">
                            Transacciones
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Box textAlign="center" color="gray">
                                                Referencia
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center" color="gray">
                                                <AttachMoneyIcon />
                                                <Box>Monto</Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center" color="gray">
                                                <AccountBalanceIcon />
                                                <Box>Banco</Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center" color="gray">
                                                <MoneyIcon />
                                                <Box>Cuenta</Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center" color="gray">
                                                <Box>Comprobante</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        order?.bankTransfers?.length > 0 ?
                                            order?.bankTransfers?.map((transfer: any, i: number) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>
                                                            <Box textAlign="center">
                                                                {transfer.reference}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box textAlign="center">
                                                                ${transfer.amount}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box textAlign="center">
                                                                {
                                                                    transfer?.bankAccount?.cardIssuer?.imgPath &&
                                                                    <img style={{ height: 50, width: 50, borderRadius: 5 }} src={`${process.env.REACT_APP_API_URL}/${transfer?.bankAccount?.cardIssuer?.imgPath}`} alt="" />
                                                                }
                                                                <Box>{transfer?.bankAccount?.cardIssuer?.name}</Box>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box textAlign="center">
                                                                <b>{transfer.bankAccount?.alias}</b>
                                                                <p>{transfer?.bankAccount?.accountNumber}</p>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box textAlign="center" color="gray">
                                                                {
                                                                    transfer?.imgPath ?
                                                                        <Button color="primary" onClick={() => { setVoucher(`${process.env.REACT_APP_API_URL}/${transfer?.imgPath}`) }}>
                                                                            Ver Comprobante
                                                                        </Button>
                                                                        :
                                                                        'No tiene'
                                                                }


                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                            :
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <Box color="red" textAlign="center">
                                                        No hay Pagos relacionados a esta Orden
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                    }
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <Box textAlign="right">
                                                <b>Total:</b> <Box color="green" component="span">${order?.bankTransfers?.reduce((acum: number, transfer: any) => acum + Number(transfer.amount), 0)}</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Box component="h3" display="flex" alignItems="center" color="gray">
                            <LocalMallOutlinedIcon /> Productos
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Nombre
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Imagen
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Precio
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Cantidad
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Total
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        order?.cart?.cartItems?.map((product: any, i: number) => {
                                            return (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <Box textAlign="center">
                                                            {product.productName}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box textAlign="center">
                                                            <img style={{ width: 80, height: 80 }} src={`${process.env.REACT_APP_API_URL}/${product.productImage}`} alt="" />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box color="green" textAlign="center">
                                                            ${product.productPrice}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box textAlign="center">
                                                            {product.quantity}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box color="green" textAlign="center">
                                                            ${product.total}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Box textAlign="right">
                                                <b>Total:</b> <Box color="green" component="span">${order?.cart?.subTotal}</Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" alignItems="center" color="gray" component="h3">
                            <AirportShuttleOutlinedIcon /> Información de Envio:
                        </Box>
                        {
                            order?.deliveryMethod ?
                                <TableContainer>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        <b>Empresa</b>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {
                                                            order?.deliveryMethod?.imgPath &&
                                                            <img style={{ height: 50, width: 50, borderRadius: 5 }} src={`${process.env.REACT_APP_API_URL}/${order?.deliveryMethod?.imgPath}`} alt="" />
                                                        }
                                                        <Box>{order?.deliveryMethod?.name}</Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Box display="flex" justifyContent="center" alignItems="center">
                                                        <LocationOnOutlinedIcon />
                                                        <b>Dirección:</b>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {order?.delivery?.profileAddress?.address}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        <b>Costo:</b>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {order?.delivery?.total > 0 ? `$${order?.delivery?.total}` : "Gratis"}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                :
                                <Box textAlign="center" component="h3" color="gray">
                                    Retira en tienda.
                                </Box>
                        }
                    </Grid>
                </Grid>
            </Box>
            <PrintOrdersComponent print={print} onFinalizePrint={() => { setPrint(false) }} order={order} />
            <OptionsModal
                onClose={handleClose}
                open={open}
                values={ordersStatuses}
                title="Por favor asigne un estado a la orden"
            />
            <VouchersModal voucherImgPath={voucher} onClose={() => { setVoucher('') }} />
            <SubjectErrorModal open={payError.open} onClose={handleCloseSubjectModal} title={"Por favor coloque el motivo del error."} />
        </Box>
    )
}

export default OrdersEdit;