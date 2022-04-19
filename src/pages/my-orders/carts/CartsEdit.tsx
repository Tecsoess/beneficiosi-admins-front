import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';


const CartsEdit = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const { id } = useParams<any>();

    const [{ data: cart, error: cartError, loading: cartLoading }, getCart] = useAxios({ url: `carts/${id}` }, { useCache: false });

    useEffect(() => {
        if (cartError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cartError?.response?.status === 400 ? cartError?.response?.data.message[0] : cartError?.response?.data.message}.`, severity: "error" });
        }
    }, [cartError]);

    useEffect(() => {
        console.log(cart);
    }, [cart])

    useEffect(() => {
        setLoading?.({ show: cartLoading, message: "Obteniendo Información" });
    }, [cartLoading])

    return (
        <Box p={4}>
            <Box bgcolor="white" p={2}>
                <Box component="h2" color="gray">
                    Detalle del Carrito:
                </Box>
                <Box color="gray" mb={4}>
                    Fecha: {cart?.createdAt}
                </Box>
                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <Box color="gray">
                            Comprador: <Link style={{ textDecoration: "none" }} to={`/users-management/clients/${cart?.user?.id}/edit`}>
                                <Box component="h2" color="gray">
                                    {cart?.user?.name}
                                </Box>
                            </Link>
                        </Box>
                        <Box color="gray">
                            Tienda:
                            <Link style={{ textDecoration: "none" }} to={`/users-management/stores/${cart?.store?.storeId}/edit`}>
                                <Box component="h2" color="gray">
                                    {cart?.store?.name}
                                </Box>
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item md={6}>
                        <Box p={2}>
                            <Box color="gray" component="h3">
                                Estado del carrito:
                            </Box>
                            <Box color="white" component="h3" bgcolor={cart?.isProcessed ? "green" : "red"} textAlign="center" p={1} style={{ borderRadius: 5 }}>
                                {cart?.isProcessed ? "Procesado" : "No procesado"}
                            </Box>
                            <Box color="white" component="h3" bgcolor={cart?.isExpired ? "red" : "green"} textAlign="center" p={1} style={{ borderRadius: 5 }}>
                                {cart?.isExpired ? "Vencido" : "Activo"}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
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
                                cart?.cartItems?.map((product: any, i: number) => {
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
                                        <b>Total:</b> <Box color="green" component="span">${cart?.subTotal}</Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}

export default CartsEdit;