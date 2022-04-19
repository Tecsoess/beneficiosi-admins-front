import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useAuth } from "../../../contexts/AuthContext";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import useCardsIssuers from "../../../hooks/useCardsIssuers";
import useCardsTypes from "../../../hooks/useCardsTypes";

type errorsFormType = {
    name: string | null,
    cardIssuerId: string | null,
    cardTypeId: string | null
}


type cardDataType = {
    name: string,
    image: any,
    cardIssuerId: number | string,
    cardTypeId: number | string
}

const CardsEdit = () => {

    const params = useParams<any>();

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [imagePreview, setImagePreview] = useState("");

    const [cardData, setCardData] = useState<cardDataType>({
        name: "",
        image: null,
        cardIssuerId: "",
        cardTypeId: ""
    })

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({
        name: null,
        cardIssuerId: null,
        cardTypeId: null
    });

    const [{ data: card, error: cardError }, getCard] = useAxios({ url: `/cards/${params?.id}` }, { useCache: false, manual: true });
    const [{ cardsIssuers, error: cardsIssuersError }, getCardsIssuers] = useCardsIssuers({ axiosConfig: { params: { perPage: 200 } }, options: { manual: true, useCache: false } });
    const [{ cardsTypes, error: cardsTypesError }, getCardsTypes] = useCardsTypes({ axiosConfig: { params: { perPage: 200 } }, options: { manual: true, useCache: false } });
    const [{ data: updateData, error: updateError }, updateCard] = useAxios({ url: `/cards/${params?.id}`, method: "PUT" }, { useCache: false, manual: true });

    useEffect(() => {
        setLoading?.({ show: true, message: "Cargando datos" });
        Promise.all([getCardsIssuers(), getCardsTypes(), getCard()]).then((values) => {
            setLoading?.({ show: false, message: "" });
        })
    }, [])

    useEffect(() => {
        if (card) {
            console.log(card);
            const { cardIssuer, cardType, id, imgPath, name } = card;
            setCardData((oldCardData) => {
                return {
                    ...oldCardData,
                    name: name,
                    cardIssuerId: cardIssuer?.id,
                    cardTypeId: cardType?.id
                }
            });

            setImagePreview(`${process.env.REACT_APP_API_URL}/${imgPath}`);
        }
    }, [card])

    useEffect(() => {
        if (updateData) {
            setLoading?.({ show: false, message: "" })
            setCustomAlert?.({ show: true, message: "La tarjeta ha sido actualizada.", severity: "success" });
            history.push("/pay-settings/cards")
        }
    }, [updateData])

    useEffect(() => {
        if (cardError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardError?.response?.status === 400 ? cardError?.response?.data.message[0] : cardError?.response?.data.message}.`, severity: "error" });
        }

        if (cardsIssuersError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsIssuersError?.response?.status === 400 ? cardsIssuersError?.response?.data.message[0] : cardsIssuersError?.response?.data.message}.`, severity: "error" });
        }

        if (cardsTypesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsTypesError?.response?.status === 400 ? cardsTypesError?.response?.data.message[0] : cardsTypesError?.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [cardError, cardsIssuersError, cardsTypesError, updateError]);

    useEffect(() => {
        setErrorsForm({
            name: validate(cardData.name, [
                { validator: isRequired, errorMessage: "El nombre es obligatorio." },
            ]),
            cardIssuerId: validate(cardData.cardIssuerId, [
                { validator: isRequired, errorMessage: "El emisor es obligatorio." },
                { validator: isNumber, errorMessage: "El emisor tiene que ser uno valido." },
            ]),
            cardTypeId: validate(cardData.cardTypeId, [
                { validator: isRequired, errorMessage: "El tipo es obligatorio." },
                { validator: isNumber, errorMessage: "El tipo tiene que ser uno valido." },
            ])
        })
    }, [cardData]);

    const handleChange = (e: any) => {
        setCardData((oldCardData) => {
            return {
                ...oldCardData,
                [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
            }
        });
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors as keyof typeof errorsForm] != null) {
                alert(errorsForm[errors as keyof typeof errorsForm]);
                return;
            }
        }

        const data = new FormData();

        if (cardData.image) {
            data.append("image", cardData.image, cardData.image.name);
        }

        data.append("name", cardData.name);
        data.append("cardIssuerId", cardData.cardIssuerId.toString());
        data.append("cardTypeId", cardData.cardTypeId.toString());

        setLoading?.({ show: true, message: "Actualizando tarjeta" });
        await updateCard({ data });
        setLoading?.({ show: false, message: "" });
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray" display="flex" alignItems="center">
                <CreditCardIcon />
                Actualizar Tarjeta
            </Box>

            <Box bgcolor="white" p={3}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={cardData.name}
                                onChange={handleChange}
                                error={errorsForm.name ? true : false}
                                helperText={errorsForm.name}
                                name="name"
                                label="Nombre"
                                variant="outlined"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ImgUploadInput
                                previewImage={imagePreview}
                                change={handleChange}
                                height="200px"
                                width="375px"
                                name="image"
                                previewFor="banner"
                                description="Imagen de la tarjeta"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={cardData.cardIssuerId}
                                onChange={handleChange}
                                error={errorsForm.cardIssuerId ? true : false}
                                helperText={errorsForm.cardIssuerId}
                                name="cardIssuerId"
                                label="Emisor de la tarjeta"
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={cardData.cardTypeId}
                                onChange={handleChange}
                                error={errorsForm.cardTypeId ? true : false}
                                helperText={errorsForm.cardTypeId}
                                name="cardTypeId"
                                label="Tipo de tarjeta"
                                variant="outlined"
                                fullWidth
                                select
                            >
                                {
                                    cardsTypes.map((cardsType, i) => {
                                        return (
                                            <MenuItem key={i} value={cardsType.id}>
                                                {cardsType.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                    </Grid>
                    <Box textAlign="right" mt={4}>
                        <Button variant="contained" color="primary" type="submit">
                            Actualizar tarjeta
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default CardsEdit;