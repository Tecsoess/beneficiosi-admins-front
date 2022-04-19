import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useAuth } from "../../../contexts/AuthContext";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import useCardsIssuersTypes from "../../../hooks/useCardsIssuersTypes";

type errorsFormType = {
    name: null | string,
    image: null | string,
    cardIssuerTypeId: null | string,
}

type cardsIssuerDataType = {
    name: string,
    image: any,
    cardIssuerTypeId: number,
}

const CardIssuersCreate = () => {

    const history = useHistory();

    const { setCustomAlert, setLoading } = useAuth();

    const [cardsIssuerData, setCardsIssuerData] = useState<cardsIssuerDataType>({ name: "", image: null, cardIssuerTypeId: 1 });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({ name: null, image: null, cardIssuerTypeId: null });

    const [{ cardsIssuersTypes, loading: cardsIssuersTypesLoading, error: cardsIssuersTypesError }, getCardsIssuersTypes] = useCardsIssuersTypes();

    const [{ data: createData, error: createError, loading: createLoading }, createCardsIssuer] = useAxios({ url: "/card-issuers", method: "POST" }, { manual: true, useCache: false });

    useEffect(() => {
        setLoading?.({ show: cardsIssuersTypesLoading, message: "Obteniendo tipos de emisores" })
    }, [cardsIssuersTypesLoading]);

    useEffect(() => {
        setLoading?.({ show: createLoading, message: "Creando emisor" })
    }, [createLoading]);

    useEffect(() => {
        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }

        if (cardsIssuersTypesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsIssuersTypesError?.response?.status === 400 ? cardsIssuersTypesError?.response?.data.message[0] : cardsIssuersTypesError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError, cardsIssuersTypesError]);

    useEffect(() => {
        if (createData) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: "El emisor se ha creado exitosamente.", severity: "success" });
            history.push("/pay-settings/card-issuers");
        }
    }, [createData]);

    useEffect(() => {
        setErrorsForm({
            name: validate(cardsIssuerData.name, [
                { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
            ]),
            cardIssuerTypeId: validate(cardsIssuerData.cardIssuerTypeId, [
                { validator: isRequired, errorMessage: "El tipo es obligatorio." },
                { validator: isNumber, errorMessage: "Tiene que ser un tipo valido." }
            ]),
            image: validate(cardsIssuerData.image, [
                { validator: isRequired, errorMessage: "La imagen es obligatoria." },
            ]),
        })
    }, [cardsIssuerData])

    const handleChange = (e: any) => {
        setCardsIssuerData((oldCardsIssuerData) => {
            return {
                ...oldCardsIssuerData,
                [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
            }
        });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors as keyof typeof errorsForm] != null) {
                alert(errorsForm[errors as keyof typeof errorsForm]);
                return;
            }
        }
        const data = new FormData();

        data.append("image", cardsIssuerData.image, cardsIssuerData.image.name);
        data.append("name", cardsIssuerData.name);
        data.append("cardIssuerTypeId", cardsIssuerData.cardIssuerTypeId.toString());

        createCardsIssuer({ data });
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <AccountBalanceIcon />
                Crear Emisor de Tarjetas
            </Box>

            <Box p={4} bgcolor="white">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                helperText={errorsForm.name}
                                error={errorsForm.name ? true : false}
                                name="name"
                                value={cardsIssuerData.name}
                                onChange={handleChange}
                                variant="outlined"
                                label="Nombre"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                helperText={errorsForm.cardIssuerTypeId}
                                error={errorsForm.cardIssuerTypeId ? true : false}
                                name="cardIssuerTypeId"
                                value={cardsIssuerData.cardIssuerTypeId}
                                onChange={handleChange}
                                variant="outlined"
                                label="Tipo"
                                select
                                style={{ textTransform: "capitalize" }}
                            >
                                {
                                    cardsIssuersTypes.map((cardsIssuersType, i) => {
                                        return (
                                            <MenuItem style={{ textTransform: "capitalize" }} key={i} value={cardsIssuersType.id}>
                                                {cardsIssuersType.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box component="h3">
                                Imagen:
                            </Box>
                            <ImgUploadInput height="250px" width="50%" name="image" previewFor="banner" change={handleChange} />
                            {
                                errorsForm.image &&
                                <Box mt={2} fontSize={18} textAlign="center" color="red">
                                    {errorsForm.image}
                                </Box>
                            }
                        </Grid>
                    </Grid>
                    <Box textAlign="right">
                        <Button type="submit" color="primary" variant="contained">
                            Crear Emisor
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default CardIssuersCreate;