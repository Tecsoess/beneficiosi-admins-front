import { Box, Grid, IconButton, Table, TableHead, TableRow, TableCell, Button, TableBody } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { useAuth } from "../contexts/AuthContext";
import PrintIcon from '@material-ui/icons/Print';

const PrintOrdersComponent = ({ order, togglePrintMode, print, onFinalizePrint }: any) => {

    const { setLoading } = useAuth();

    const componentRef = useRef<any>();

    useEffect(() => {
        console.log(print)
        console.log("hi");
        if (print) {
            handlePrint?.();
        }
    }, [print])

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        onBeforeGetContent: () => setLoading?.({ show: true, message: "Generando documento" }),
        onAfterPrint: () => { setLoading?.({ show: false, message: "" }); onFinalizePrint() },
        documentTitle: `Order - ${order?.orderNumber}`,
        pageStyle: `
        
          
          @media print {
            html, body {
              height: initial !important;
              overflow: initial !important;
              -webkit-print-color-adjust: exact;
            }
          }
          
          @media print {
            .page-break {
              margin-top: 1rem;
              display: block;
              page-break-before: auto;
            }
          }
          
          @page {
            size: auto;
            margin: 7mm;
          }
      `
    });

    return (
        <div style={{ display: "none" }} className="animate__animated animate__fadeInUp">
            <div ref={componentRef}>
                <Box bgcolor="white" p={4} color="gray" fontFamily="arial">
                    <Box my={1} textAlign="center" component="h1">
                        Orden de Compra
                    </Box>
                    <Box mb={2} display="flex" justifyContent="space-between">
                        <Box>
                            <img style={{ height: 60, width: 60 }} src={`${process.env.REACT_APP_API_URL}/${order?.store?.storeProfile?.logo}`} alt="" />
                            <p>{order?.store?.name}</p>
                        </Box>
                        <Box>
                            <p>Fecha: {order?.createdAt}</p>
                            <Box color={order?.orderStatus?.color} fontWeight="bold" textAlign="right" style={{ textTransform: "capitalize" }}>{order?.orderStatus?.name}</Box>
                        </Box>
                    </Box>

                    <Grid container>
                        <Grid item xs={6}>
                            <Box mb={1}>
                                <b>Nro de orden:</b> {order?.orderNumber}
                            </Box>
                            <Box mb={1}>
                                <b>Nombre del cliente:</b> {order?.user?.name}
                            </Box>
                            <Box mb={1}>
                                <b>Metodo de pago:</b> <span style={{ textTransform: "capitalize" }}>{order?.paymentMethod?.name}</span>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box mb={1}>
                                <b>Dirección de envio:</b> {order?.delivery?.profileAddress?.address ? order?.delivery?.profileAddress?.address : "Retira en tienda."}
                            </Box>
                            <Box mb={1}>
                                <b>Empresa de envio:</b> {order?.deliveryMethod?.name ? order?.deliveryMethod?.name : "Retiro en tienda."}
                            </Box>
                            <Box mb={1}>
                                <b>Costo de envio:</b> {order?.delivery?.total > 0 ? `$${order?.delivery?.total}` : "Gratis"}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box mt={8}>
                        <Box component="h2" textAlign="center">
                            Detalle de orden
                        </Box>
                        <Table>



                            <TableBody>
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
                                {
                                    order?.cart?.cartItems?.map((product: any, i: number) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Box style={{ padding: i === 3 && order?.cart?.cartItems.length > 4 ? "1.5rem 0 1.5rem" : "0" }} textAlign="center">
                                                        {product.productName}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box style={{ padding: i === 3 && order?.cart?.cartItems.length > 4 ? "1.5rem 0 1.5rem" : "0" }} textAlign="center">
                                                        <img style={{ width: 80, height: 80 }} src={`${process.env.REACT_APP_API_URL}/${product.productImage}`} alt="" />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box style={{ padding: i === 3 && order?.cart?.cartItems.length > 4 ? "1.5rem 0 1.5rem" : "0" }} textAlign="center">
                                                        ${product.productPrice}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box style={{ padding: i === 3 && order?.cart?.cartItems.length > 4 ? "1.5rem 0 1.5rem" : "0" }} textAlign="center">
                                                        {product.quantity}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box style={{ padding: i === 3 && order?.cart?.cartItems.length > 4 ? "1.5rem 0 1.5rem" : "0" }} textAlign="center">
                                                        ${product.total}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Box my={1} textAlign="right">
                                            <b>Subtotal:</b> <Box color="green" component="span">${order?.cart?.subTotal}</Box>
                                        </Box>
                                        <Box my={1} textAlign="right">
                                            <b>Envio:</b> <Box color="green" component="span">{order?.delivery?.total > 0 ? `$${order?.delivery?.total}` : "Gratis"}</Box>
                                        </Box>
                                        <Box my={1} textAlign="right">
                                            <b>Total:</b> <Box color="green" component="span">${order?.total}</Box>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </div>


            <Box textAlign="center" mt={2}>
                <Button style={{ marginRight: 10 }} onClick={togglePrintMode} color="primary" variant="contained">
                    Cancelar
                </Button>
                <Button onClick={handlePrint} style={{ marginLeft: 10 }} startIcon={<PrintIcon />} color="primary" variant="contained">
                    Imprimir
                </Button>
            </Box>
        </div>
    )
}

export default PrintOrdersComponent;