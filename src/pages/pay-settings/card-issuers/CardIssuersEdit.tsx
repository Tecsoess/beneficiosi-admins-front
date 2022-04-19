import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useAuth } from "../../../contexts/AuthContext";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import useCardsIssuersTypes from "../../../hooks/useCardsIssuersTypes";

type errorsFormType = {
    name: null | string,
    cardIssuerTypeId: null | string,
}

type cardsIssuerDataType = {
    name: string,
    image: any,
    cardIssuerTypeId: number,
}

const CardIssuersEdit = () => {

    const params = useParams<any>();

    const history = useHistory();

    const { setCustomAlert, setLoading } = useAuth();

    const [{ data: cardsIssuer, error: cardsIssuerError, loading: cardsIssuerLoading }, getCardsIssuer] = useAxios({ url: `/card-issuers/${params?.id}` }, { useCache: false });

    const [cardsIssuerData, setCardsIssuerData] = useState<cardsIssuerDataType>({ name: "", image: null, cardIssuerTypeId: 1 });

    const [imagePreview, setImagePreview] = useState("");

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({ name: null, cardIssuerTypeId: null });

    const [{ cardsIssuersTypes, loading: cardsIssuersTypesLoading, error: cardsIssuersTypesError }, getCardsIssuersTypes] = useCardsIssuersTypes();

    const [{ data: editData, error: editError, loading: editLoading }, editCardsIssuer] = useAxios({ url: `/card-issuers/${params?.id}`, method: "PUT" }, { manual: true, useCache: false });

    useEffect(() => {
        if (cardsIssuer) {
            setCardsIssuerData((oldCardsIssuerData) => {
                return {
                    ...oldCardsIssuerData,
                    name: cardsIssuer?.name,
                    cardIssuerTypeId: cardsIssuer?.cardIssuerType?.id
                }
            });

            setImagePreview(`${process.env.REACT_APP_API_URL}/${cardsIssuer?.imgPath}`);
        }
        console.log(cardsIssuer);
    }, [cardsIssuer])

    useEffect(() => {
        setLoading?.({ show: cardsIssuerLoading, message: "Obteniendo Información" })
    }, [cardsIssuerLoading]);

    useEffect(() => {
        setLoading?.({ show: cardsIssuersTypesLoading, message: "Obteniendo tipos de emisores" })
    }, [cardsIssuersTypesLoading]);

    useEffect(() => {
        setLoading?.({ show: editLoading, message: "Creando emisor" })
    }, [editLoading]);

    useEffect(() => {
        if (cardsIssuerError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsIssuerError?.response?.status === 400 ? cardsIssuerError?.response?.data.message[0] : cardsIssuerError?.response?.data.message}.`, severity: "error" });
        }

        if (editError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${editError?.response?.status === 400 ? editError?.response?.data.message[0] : editError?.response?.data.message}.`, severity: "error" });
        }

        if (cardsIssuersTypesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsIssuersTypesError?.response?.status === 400 ? cardsIssuersTypesError?.response?.data.message[0] : cardsIssuersTypesError?.response?.data.message}.`, severity: "error" });
        }
    }, [editError, cardsIssuersTypesError, cardsIssuerError]);

    useEffect(() => {
        if (editData) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: "El emisor se ha creado exitosamente.", severity: "success" });
            history.push("/pay-settings/card-issuers");
        }
    }, [editData]);

    useEffect(() => {
        setErrorsForm({
            name: validate(cardsIssuerData.name, [
                { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
            ]),
            cardIssuerTypeId: validate(cardsIssuerData.cardIssuerTypeId, [
                { validator: isRequired, errorMessage: "El tipo es obligatorio." },
                { validator: isNumber, errorMessage: "Tiene que ser un tipo valido." }
            ])
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

        if (cardsIssuerData.image) {
            data.append("image", cardsIssuerData.image, cardsIssuerData.image.name);
        }
        data.append("name", cardsIssuerData.name);
        data.append("cardIssuerTypeId", cardsIssuerData.cardIssuerTypeId.toString());

        editCardsIssuer({ data });
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <AccountBalanceIcon />
                Editar Emisor de Tarjetas
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
                            <ImgUploadInput previewImage={imagePreview} height="250px" width="50%" name="image" previewFor="banner" change={handleChange} />
                        </Grid>
                    </Grid>
                    <Box textAlign="right">
                        <Button type="submit" color="primary" variant="contained">
                            Guardar Cambios
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default CardIssuersEdit;