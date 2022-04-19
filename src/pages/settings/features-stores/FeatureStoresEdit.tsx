import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";


type errorsFormType = {
    name: null | string;
    storeCategoryId: null | string;
}

type featureStoreFormDataType = {
    name: string;
    storeCategoryId: any;
}

const FeatureStoresEdit = () => {

    const { id } = useParams<any>();

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [featureStoreFormData, setFeatureStoreFormData] = useState<featureStoreFormDataType>({ name: "", storeCategoryId: "" });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({ name: null, storeCategoryId: null });

    const [{ data: storeFeature, error: storeFeatureError }, getStoreFeature] = useAxios({ url: `/store-features/${id}` }, { manual: true, useCache: false });

    const [{ categories, error: categoriesError }, getCategories] = useCategories({ options: { manual: true } });

    const [{ data, loading, error }, updateStoreFeature] = useAxios({ url: `/store-features/${id}`, method: "PUT" }, { manual: true, useCache: false });


    useEffect(() => {
        setLoading?.({ show: true, message: "Cargando datos" });
        Promise.all([getCategories(), getStoreFeature()]).then((values) => {
            setLoading?.({ show: false, message: "" });
        })
    }, []);

    useEffect(() => {
        if (storeFeature) {
            setFeatureStoreFormData({ name: storeFeature?.name, storeCategoryId: storeFeature?.storeCategory?.id })
        }
    }, [storeFeature])

    useEffect(() => {
        if (data) {
            setCustomAlert?.({ show: true, message: "Se han guardado los cambios.", severity: "success" });
            history.push('/settings/feature-stores');
        }
    }, [data])

    useEffect(() => {
        if (storeFeatureError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${storeFeatureError?.response?.status === 400 ? storeFeatureError?.response?.data.message[0] : storeFeatureError?.response?.data.message}.`, severity: "error" });
        }

        if (categoriesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesError?.response?.status === 400 ? categoriesError?.response?.data.message[0] : categoriesError?.response?.data.message}.`, severity: "error" });
        }

        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }
    }, [categoriesError, error, storeFeatureError]);

    useEffect(() => {
        setErrorsForm({
            name: validate(featureStoreFormData.name, [
                { validator: isRequired, errorMessage: "el nombre no puede estar vacio." },
            ]),
            storeCategoryId: validate(featureStoreFormData.storeCategoryId, [
                { validator: isRequired, errorMessage: "La categoria es obligatoria." },
                { validator: isNumber, errorMessage: "tiene que ser un numero." }
            ]),
        })
    }, [featureStoreFormData])


    const handleChange = (e: any) => {
        setFeatureStoreFormData((oldFeatureStoreFormData) => {
            return {
                ...oldFeatureStoreFormData,
                [e.target.name]: e.target.value
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

        setLoading?.({ show: true, message: "Creando Caracteristica" });

        await updateStoreFeature({ data: { ...featureStoreFormData } });

        setLoading?.({ show: false, message: "" });
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Crear Etiqueta
            </Box>

            <Box bgcolor="white" borderRadius="5px" p={5}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                onChange={handleChange}
                                helperText={errorsForm.name ? <Box component="span" color="red">{errorsForm.name}</Box> : null}
                                error={errorsForm.name ? true : false}
                                value={featureStoreFormData.name}
                                name="name"
                                fullWidth
                                label="Nombre"
                                variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                disabled={!categories || categories.length < 1 ? true : false}
                                onChange={handleChange}
                                helperText={errorsForm.storeCategoryId ? <Box component="span">{errorsForm.storeCategoryId}</Box> : null}
                                error={errorsForm.storeCategoryId ? true : false}
                                value={featureStoreFormData.storeCategoryId}
                                name="storeCategoryId"
                                fullWidth
                                label="Categoria"
                                variant="outlined"
                                style={{ textTransform: "capitalize" }}
                                select>
                                {
                                    categories?.map((category, i) => {
                                        return (
                                            <MenuItem style={{ textTransform: "capitalize" }} value={category.id} key={i}>
                                                {category.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box textAlign="right" mt={5}>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default FeatureStoresEdit;
