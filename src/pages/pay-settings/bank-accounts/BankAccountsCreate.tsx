import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import useBankAccountsTypes from "../../../hooks/useBankAccountsTypes";
import useCardsIssuers from "../../../hooks/useCardsIssuers";
import usePaymentMethods from "../../../hooks/usePaymentMethods";

type errorsFormType = {
    alias: string | null,
    accountNumber: string | null,
    bankAccountTypeId: string | null,
    cardIssuerId: string | null,
    branchOffice: string | null,
    cbu: string | null,
    paymentMethodCode: string | null,
}

const BankAccountsCreate = () => {

    const history = useHistory()

    const { setLoading, setCustomAlert } = useAuth();

    const [{ cardsIssuers, error: cardsIssuersError }, getCardsIssuers] = useCardsIssuers({ axiosConfig: { params: { cardIssuerTypeId: 1, perPage: 200 } }, options: { manual: true, useCache: false } });

    const [{ paymentMethods, error: paymentMethodsError }, getPaymentMethods] = usePaymentMethods({ axiosConfig: { params: { perPage: 200 } }, options: { manual: true, useCache: false } });

    const [{ bankAccountsTypes, error: bankAccountsTypesError }, getBankAccountsTypes] = useBankAccountsTypes({ axiosConfig: { params: { perPage: 200 } }, options: { manual: true, useCache: false } });

    const [{ data: createData, error: createError }, createBankAccount] = useAxios({ url: "/bank-accounts", method: "POST" }, { useCache: false, manual: true });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({
        alias: null,
        accountNumber: null,
        bankAccountTypeId: null,
        cardIssuerId: null,
        branchOffice: null,
        cbu: null,
        paymentMethodCode: null,
    });

    const [bankAccountData, setBankAccountData] = useState({
        alias: "",
        accountNumber: "",
        bankAccountTypeId: "",
        cardIssuerId: "",
        branchOffice: "",
        cbu: "",
        paymentMethodCode: "pym-002"
    });

    useEffect(() => {
        setLoading?.({ show: true, message: "Cargando datos" });
        Promise.all([getCardsIssuers(), getBankAccountsTypes(), getPaymentMethods()]).then((values) => {
            setLoading?.({ show: false, message: "" });
        })
    }, [])

    useEffect(() => {
        if (createData) {
            setLoading?.({ show: false, message: "" })
            setCustomAlert?.({ show: true, message: "La cuenta bancaria ha sido creada.", severity: "success" });
            history.push("/pay-settings/bank-accounts")
        }
    }, [createData])

    useEffect(() => {
        if (cardsIssuersError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsIssuersError?.response?.status === 400 ? cardsIssuersError?.response?.data.message[0] : cardsIssuersError?.response?.data.message}.`, severity: "error" });
        }

        if (bankAccountsTypesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${bankAccountsTypesError?.response?.status === 400 ? bankAccountsTypesError?.response?.data.message[0] : bankAccountsTypesError?.response?.data.message}.`, severity: "error" });
        }

        if (paymentMethodsError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${paymentMethodsError?.response?.status === 400 ? paymentMethodsError?.response?.data.message[0] : paymentMethodsError?.response?.data.message}.`, severity: "error" });
        }

        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [cardsIssuersError, bankAccountsTypesError, paymentMethodsError, createError]);

    useEffect(() => {
        setErrorsForm({
            alias: validate(bankAccountData.alias, [
                { validator: isRequired, errorMessage: "El alias no puede estar vacio." },
            ]),
            accountNumber: validate(bankAccountData.accountNumber, [
                { validator: isRequired, errorMessage: "El numero de cuenta no puede estar vacio." },
                { validator: isNumber, errorMessage: "El numero de cuenta tiene que ser solo numeros." },
            ]),
            bankAccountTypeId: validate(bankAccountData.bankAccountTypeId, [
                { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
                { validator: isNumber, errorMessage: "El tipo de cuenta tiene que ser una opcion valida." },
            ]),
            cardIssuerId: validate(bankAccountData.cardIssuerId, [
                { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
                { validator: isNumber, errorMessage: "El banco tiene que ser una opcion valida." },
            ]),
            branchOffice: validate(bankAccountData.branchOffice, [
                { validator: isRequired, errorMessage: "La sucursal no puede estar vacia." },
            ]),
            cbu: validate(bankAccountData.cbu, [
                { validator: isRequired, errorMessage: "El cbu no puede estar vacio." },
            ]),
            paymentMethodCode: validate(bankAccountData.paymentMethodCode, [
                { validator: isRequired, errorMessage: "El proposito no puede estar vacio." },
            ]),
        })
    }, [bankAccountData]);

    const handleChange = (e: any) => {
        setBankAccountData((oldBankAccountData) => {
            return {
                ...oldBankAccountData,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors as keyof typeof errorsForm] != null) {
                alert(errorsForm[errors as keyof typeof errorsForm]);
                return;
            }
        }

        setLoading?.({ show: true, message: "Creando cuenta bancaria." })
        await createBankAccount({ data: bankAccountData });
        setLoading?.({ show: false, message: "" })
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <ChromeReaderModeIcon />
                Crear Cuenta de Banco
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.alias}
                                error={errorsForm.alias ? true : false}
                                value={bankAccountData.alias}
                                onChange={handleChange}
                                label="Alias"
                                name="alias"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.accountNumber}
                                error={errorsForm.accountNumber ? true : false}
                                value={bankAccountData.accountNumber}
                                onChange={handleChange}
                                label="Numero de cuenta"
                                name="accountNumber"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.bankAccountTypeId}
                                error={errorsForm.bankAccountTypeId ? true : false}
                                value={bankAccountData.bankAccountTypeId}
                                onChange={handleChange}
                                label="Tipo de cuenta"
                                name="bankAccountTypeId"
                                variant="outlined"
                                fullWidth
                                select
                            >
                                {
                                    bankAccountsTypes.map((bankAccountsType, i) => {
                                        return (
                                            <MenuItem key={i} value={bankAccountsType.id}>
                                                {bankAccountsType.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.cardIssuerId}
                                error={errorsForm.cardIssuerId ? true : false}
                                value={bankAccountData.cardIssuerId}
                                onChange={handleChange}
                                label="Banco"
                                name="cardIssuerId"
                                variant="outlined"
                                fullWidth
                                select
                            >
                                {
                                    cardsIssuers.map((cardsIssuer, i) => {
                                        return (
                                            <MenuItem key={i} value={cardsIssuer.id}>
                                                {cardsIssuer.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.branchOffice}
                                error={errorsForm.branchOffice ? true : false}
                                value={bankAccountData.branchOffice}
                                onChange={handleChange}
                                label="Sucursal"
                                name="branchOffice"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.cbu}
                                error={errorsForm.cbu ? true : false}
                                value={bankAccountData.cbu}
                                onChange={handleChange}
                                label="CBU"
                                name="cbu"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        {/* <Grid xs={12} md={6} item>
                            <TextField
                                helperText={errorsForm.paymentMethodCode}
                                error={errorsForm.paymentMethodCode ? true : false}
                                value={bankAccountData.paymentMethodCode}
                                onChange={handleChange}
                                label="Proposito"
                                name="paymentMethodCode"
                                variant="outlined"
                                fullWidth
                                select
                                style={{ textTransform: "capitalize" }}
                            >
                                {
                                    paymentMethods.map((paymentMethod, i) => {
                                        return (
                                            <MenuItem style={{ textTransform: "capitalize" }} key={i} value={paymentMethod.code}>
                                                {paymentMethod.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid> */}
                    </Grid>

                    <Box textAlign="right">
                        <Button type="submit" color="primary" variant="contained">
                            Crear Cuenta Bancaria
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default BankAccountsCreate;