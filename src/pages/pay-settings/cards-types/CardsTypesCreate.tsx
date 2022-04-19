import { Box, Button, TextField } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";

const CardsTypesCreate = () => {

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [name, setName] = useState("");

    const [errorsForm, setErrorsForm] = useState<string | null>(null);

    const [{ data: createData, loading: createLoading, error: createError }, createCardsType] = useAxios({ url: "/card-types", method: "POST" }, { useCache: false, manual: true });

    useEffect(() => {
        if (createData) {
            setCustomAlert?.({ show: true, message: "Se ha creado exitosamente", severity: "success" });
            history.push("/pay-settings/cards-types");
        }
    }, [createData])

    useEffect(() => {
        setLoading?.({ show: createLoading, message: "Creando tipo de tarjeta" });
    }, [createLoading])

    useEffect(() => {
        setErrorsForm(validate(name, [
            { validator: isRequired, errorMessage: "El nombre no puede estar vacio." },
        ]));
    }, [name]);

    useEffect(() => {
        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [createError]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (errorsForm) {
            return alert(errorsForm);
        }

        createCardsType({ data: { name } });
    }

    return (
        <Box>
            <Box my={4} fontSize="30px" color="gray">
                Crear Tipo de Tarjeta
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
                            Crear Tipo de Tarjetas
                        </Button>
                    </Box>
                </form>
            </Box>

        </Box>
    )
}


export default CardsTypesCreate;