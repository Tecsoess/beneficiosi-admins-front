import { Box, Button, TextField } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";

const CardsTypesEdit = () => {

    const params = useParams<any>();

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [name, setName] = useState("");

    const [errorsForm, setErrorsForm] = useState<string | null>(null);

    const [{ data: cardType, loading: cardsTypeLoading, error: cardsTypeError }, getCardType] = useAxios({ url: `/card-types/${params?.id}` }, { useCache: false });

    const [{ data: updateData, loading: updateLoading, error: updateError }, updateCardType] = useAxios({ url: `card-types/${params?.id}`, method: "PUT" }, { useCache: false, manual: true });

    useEffect(() => {
        if (cardType) {
            setName(cardType.name)
        }
    }, [cardType])

    useEffect(() => {
        if (updateData) {
            setCustomAlert?.({ show: true, message: "Se ha creado exitosamente", severity: "success" });
            history.push("/pay-settings/cards-types");
        }
    }, [updateData])

    useEffect(() => {
        setLoading?.({ show: cardsTypeLoading, message: "Obteniendo tipo de tarjeta" });
    }, [cardsTypeLoading])

    useEffect(() => {
        setErrorsForm(validate(name, [
            { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
        ]));
    }, [name]);

    useEffect(() => {
        if (cardsTypeError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${cardsTypeError?.response?.status === 400 ? cardsTypeError?.response?.data.message[0] : cardsTypeError?.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
        }
    }, [updateError, cardsTypeError]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (errorsForm) {
            return alert(errorsForm);
        }

        updateCardType({ data: { name } });
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray">
                Editar Tipo de Tarjeta
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        name="name"
                        label="Nombre"
                        helperText={errorsForm}
                        error={errorsForm ? true : false}
                        variant="outlined"
                        onChange={(e) => { setName(e.target.value) }}
                        value={name}
                        fullWidth />
                    <Box mt={4} textAlign="right">
                        <Button type="submit" variant="contained" color="primary">
                            Guardar Cambios
                        </Button>
                    </Box>
                </form>
            </Box>

        </Box>
    )
}


export default CardsTypesEdit;