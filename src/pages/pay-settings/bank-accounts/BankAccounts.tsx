import { Box, Button, IconButton, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";

import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';

import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Pagination from "../../../components/Pagination";
import ConfirmAlert from "../../../components/ConfirmAlert";
import useBankAccounts from "../../../hooks/useBankAccounts";

const BankAccounts = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({
        id: "",
        accountNumber: "",
        cbu: "",
        alias: "",
        branchOffice: "",
        bankId: "",
        bankAccountTypeName: "",
        cardIssuerName: "",
        page: 1
    });

    const [show, setShow] = useState(false);

    const [bankAccountToDelete, setBankAccountToDelete] = useState<any>(null);

    const [{ bankAccounts, numberOfPages, error, loading }, getBankAccounts] = useBankAccounts({ axiosConfig: { params: { ...filters } }, options: { useCache: false } });

    const [{ data: deleteData, error: deleteError }, deleteBankAccount] = useAxios({ url: `/bank-accounts/${bankAccountToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

    useEffect(() => {
        console.log(bankAccounts);
    }, [bankAccounts])

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

    const handleDelete = (bankAccount: any) => {
        setBankAccountToDelete(bankAccount);
        setShow(true);
    }

    const handleClose = async (e: any) => {
        setShow(false);
        if (e) {
            setLoading?.({ show: true, message: "Eliminando cuenta" });
            await deleteBankAccount().then(() => {
                getBankAccounts().then(() => {
                    setCustomAlert?.({ show: true, message: "la cuenta se ha eliminado exitosamente.", severity: "success" });
                });
            });
            setLoading?.({ show: false, message: "" });
        }

        setBankAccountToDelete(null);
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <ChromeReaderModeIcon />
                Cuentas de Bancos
            </Box>

            <Box textAlign="right" my={4}>
                <Link style={{ textDecoration: "none" }} to={"/pay-settings/bank-accounts/create"}>
                    <Button variant="contained" color="primary">
                        Crear Cuenta Bancaria
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
                                        Alias
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Numero de cuenta
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Tipo de cuenta
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        CBU
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Banco
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box textAlign="center">
                                        Oficina
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
                                        name="alias"
                                        value={filters.alias}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="accountNumber"
                                        value={filters.accountNumber}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="bankAccountTypeName"
                                        value={filters.bankAccountTypeName}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        name="cbu"
                                        value={filters.cbu}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth />
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
                                    <TextField
                                        name="branchOffice"
                                        value={filters.branchOffice}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        fullWidth />
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                            {
                                bankAccounts.length > 0 ?
                                    bankAccounts.map((bankAccount: any, i: number) => {
                                        return (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {bankAccount?.id}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {bankAccount?.alias}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {bankAccount?.accountNumber}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {bankAccount?.bankAccountType?.name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {bankAccount?.cbu}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {
                                                            bankAccount?.cardIssuer ?
                                                                <>
                                                                    <img
                                                                        style={{ height: 80, width: 80, borderRadius: 10 }}
                                                                        src={`${process.env.REACT_APP_API_URL}/${bankAccount?.cardIssuer?.imgPath}`}
                                                                        alt={bankAccount?.cardIssuer?.name} />
                                                                    <p>
                                                                        {bankAccount?.cardIssuer?.name}
                                                                    </p>
                                                                </>
                                                                :
                                                                "No tiene"
                                                        }
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box textAlign="center">
                                                        {bankAccount?.branchOffice}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box width="100%" display="flex" alignItems="center" justifyContent="space-around">
                                                        <Link to={`/pay-settings/bank-accounts/${bankAccount?.id}/edit`}>
                                                            <IconButton size="small">
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Link>
                                                        <IconButton onClick={() => { handleDelete(bankAccount) }} color="primary" size="small">
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
                <ConfirmAlert title={`¿Desea Eliminar la cuenta ${bankAccountToDelete?.alias}?`} show={show} onClose={handleClose} />
            </Paper>
        </Box >
    )
}

export default BankAccounts;