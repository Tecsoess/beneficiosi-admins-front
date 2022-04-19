import { Box, Button, Grid, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useAxios from "../../../hooks/useAxios";

const BrandsCreate = () => {

    const { setLoading, setCustomAlert } = useAuth();

    const [{ data, loading, error }, createBrand] = useAxios({ url: "/brands", method: "POST" }, { manual: true, useCache: false });

    const [brandsFormData, setBrandsFormData] = useState("");

    useEffect(() => {
        if (data) {
            setCustomAlert?.({ show: true, message: "Se ha creado la marca exitosamente.", severity: "success" });
            setBrandsFormData("");
        }
    }, [data])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }
    }, [error]);

    const handleChange = (e: any) => {
        setBrandsFormData(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!brandsFormData) {
            alert("El nombre es obligatorio.");
            return;
        }

        setLoading?.({ show: true, message: "Creando Marca" });

        await createBrand({ data: { name: brandsFormData } });

        setLoading?.({ show: false, message: "" });
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Crear Marca
            </Box>

            <Box bgcolor="white" borderRadius="5px" p={5}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleChange}
                                value={brandsFormData}
                                name="name"
                                fullWidth
                                label="Nombre"
                                variant="outlined" />
                        </Grid>
                    </Grid>

                    <Box textAlign="right" mt={5}>
                        <Button variant="contained" color="primary" type="submit">
                            Crear Marca
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default BrandsCreate;
