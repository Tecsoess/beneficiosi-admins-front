import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core"
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useState } from "react";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import ImgUploadInput from "../../../components/ImgUploadInput";
import useStores from "../../../hooks/useStores";
import { format } from 'date-fns';
import { useAuth } from "../../../contexts/AuthContext";
import DateFnsUtils from '@date-io/date-fns';
import useAdsPositions from "../../../hooks/useAdsPositons";
import { useEffect } from "react";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import { useHistory, useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";


type errorsFormType = {
    url: string | null;
    from: string | null;
    until: string | null;
    storeId: string | null;
    price: string | null;
    title: string | null;
    description: string | null;
    adsPositionId: string | null;
    priority: string | null;
    percentage: string | null;
}

type PublicityFormDataType = {
    title: string;
    description: string;
    image: any,
    url: string,
    from: any,
    until: any,
    storeId: any,
    price: number | string,
    adsPositionId: any;
    priority: number;
    percentage: number;
}

const PublicitySectionEdit = () => {

    const history = useHistory();

    const { id } = useParams<any>();

    const { setLoading, setCustomAlert } = useAuth();



    const [open, setOpen] = useState(false);


    const [filters, setfilters] = useState({ name: "", perPage: 200, page: 1 });

    const [imgPreview, setImagePreview] = useState<any>(null);

    const [publicityData, setPublicityData] = useState<PublicityFormDataType>({
        title: "",
        description: "",
        image: null,
        url: "",
        from: new Date(),
        until: new Date(),
        storeId: null,
        price: 0,
        adsPositionId: "",
        priority: 1,
        percentage: 0
    });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({
        title: null,
        description: null,
        url: null,
        from: null,
        until: null,
        storeId: null,
        price: null,
        adsPositionId: null,
        priority: null,
        percentage: null
    });

    const [options, setOptions] = useState<any[]>([]);

    const [{ data: publicity, loading: publicityLoading, error: publicityError }, getPublicity] = useAxios({ url: `/ads/${id}` }, { useCache: false, manual: true });

    const [{ adsPositions, error: adsPositionError }, getAdsPositions] = useAdsPositions({ options: { manual: true, useCache: false } });

    const [{ stores, error, loading: loadingStores }, getStores] = useStores({ options: { manual: true, useCache: false }, axiosConfig: { params: { ...filters } } });

    const [{ data: dataUpdate, error: errorUpdate, loading: loadingUpdate }, updatePublicity] = useAxios({ url: `/ads/${id}`, method: "PUT" }, { manual: true, useCache: false });

    useEffect(() => {
        setPublicityData((oldPublicityData) => {
            return {
                ...oldPublicityData
            }
        })
    }, [loadingStores]);

    useEffect(() => {
        getStores({ params: { ...filters } });
    }, [filters])

    useEffect(() => {
        setLoading?.({ show: true, message: "Cargando datos" });
        Promise.all([getAdsPositions(), getPublicity()]).then((values) => {
            setLoading?.({ show: false, message: "" });
        })
    }, []);

    useEffect(() => {
        if (publicity) {
            console.log(publicity)
            const { id, imgPath, isActive, from, until, store, price, adsPosition, ...rest } = publicity;

            setfilters((oldFilters) => {
                return {
                    ...oldFilters,
                    name: store?.name ? store?.name : ""
                }
            })

            setPublicityData((oldPublicityData) => {
                return {
                    ...oldPublicityData,
                    ...rest,
                    from: new Date(from),
                    until: new Date(until),
                    price: Number(price),
                    storeId: store ? store : "",
                    adsPositionId: adsPosition?.id ? adsPosition?.id : ""
                }
            });

            if (imgPath) {
                setImagePreview(`${process.env.REACT_APP_API_URL}/${imgPath}`)
            }
        }
    }, [publicity])

    useEffect(() => {
        setLoading?.({ show: loadingUpdate, message: "Actualizando sección publicitaria" });
    }, [loadingUpdate])

    useEffect(() => {
        if (errorUpdate) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorUpdate?.response?.status === 400 ? errorUpdate?.response?.data.message[0] : errorUpdate?.response?.data.message}.`, severity: "error" });
        }

        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (adsPositionError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${adsPositionError?.response?.status === 400 ? adsPositionError?.response?.data.message[0] : adsPositionError?.response?.data.message}.`, severity: "error" });
        }

        if (publicityError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${publicityError?.response?.status === 400 ? publicityError?.response?.data.message[0] : publicityError?.response?.data.message}.`, severity: "error" });
        }
    }, [errorUpdate, error, adsPositionError, publicityError]);

    useEffect(() => {
        if (dataUpdate) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Se ha actualizado la publicidad exitosamente.`, severity: "success" });
            history.push("/ads-management/publicity-section");
        }
    }, [dataUpdate]);


    useEffect(() => {
        setOptions(stores);
    }, [stores])

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        setErrorsForm({
            url: validate(publicityData.url, [
                { validator: isRequired, errorMessage: "La url es obligatoria." },
            ]),
            from: validate(publicityData.from, [
                { validator: isRequired, errorMessage: "La fecha de inicio es obligatoria." },
            ]),
            until: validate(publicityData.until, [
                { validator: isRequired, errorMessage: "La fecha final es obligatoria." },
            ]),
            storeId: validate(publicityData.storeId, [
                { validator: isRequired, errorMessage: "La tienda es obligatoria." },
            ]),
            price: validate(publicityData.price, [
                { validator: isNumber, errorMessage: "El precio tiene que ser un numero." },
            ]),
            adsPositionId: validate(publicityData.adsPositionId, [
                { validator: isRequired, errorMessage: "La posición es obligatoria." },
                { validator: isNumber, errorMessage: "Selecione una posición valida." },
            ]),
            title: validate(publicityData.title, [
                { validator: isRequired, errorMessage: "El titulo es obligatorio." },
            ]),
            description: validate(publicityData.description, [
                { validator: isRequired, errorMessage: "La descripcion es obligatoria." },
            ]),
            priority: validate(publicityData.priority, [
                { validator: isNumber, errorMessage: "La prioridad tiene que ser un numero." },
            ]),
            percentage: validate(publicityData.percentage, [
                { validator: isNumber, errorMessage: "El porcentaje tiene que ser un numero." }
            ])
        })
    }, [publicityData]);

    const handleChange = (e: any) => {
        console.log(e);
        setPublicityData((oldPublicityData) => {
            return {
                ...oldPublicityData,
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
        if (publicityData?.image) {
            data.append("image", publicityData?.image, publicityData?.image.name);
        }

        data.append("title", publicityData.title);
        data.append("description", publicityData.description);
        data.append("url", publicityData.url);
        data.append("from", format(publicityData.from, "yyyy-MM-dd H:mm:ss"));
        data.append("until", format(publicityData.until, "yyyy-MM-dd H:mm:ss"));
        data.append("price", publicityData.price.toString());
        data.append("priority", publicityData.priority.toString());
        data.append("storeId", publicityData?.storeId?.storeId?.toString());
        data.append("adsPositionId", publicityData?.adsPositionId);
        data.append("percentage", publicityData?.percentage.toString());
        await updatePublicity({ data: data });
    }

    const handleAutoComplete = (e: any, value: any) => {
        console.log(e, value);
        handleChange({ target: { name: "storeId", value: value, type: "number" } });
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Editar Publicidad
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <Box mb={4}>
                        <ImgUploadInput previewImage={imgPreview} name="image" change={handleChange} previewFor="banner" height="300px" width="100%" />
                    </Box>
                    <Box mt={4}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={errorsForm.title ? true : false}
                                    helperText={errorsForm.title}
                                    variant="outlined"
                                    label="Titulo"
                                    name="title"
                                    value={publicityData.title}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={errorsForm.description ? true : false}
                                    helperText={errorsForm.description}
                                    variant="outlined"
                                    label="Descripcion"
                                    name="description"
                                    value={publicityData.description}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    error={errorsForm.url ? true : false}
                                    helperText={errorsForm.url}
                                    variant="outlined"
                                    label="Url"
                                    name="url"
                                    value={publicityData.url}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        fullWidth
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Fecha inicio"
                                        format="dd/MM/yyyy H:mm:ss"
                                        value={publicityData.from}
                                        inputVariant="outlined"
                                        invalidDateMessage="La fecha no es correcta."
                                        onChange={date => { handleChange({ target: { name: "from", value: date, type: "date" } }) }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Fecha Final"
                                        format="dd/MM/yyyy H:mm:ss"
                                        invalidDateMessage="La fecha no es correcta."
                                        minDate={publicityData.from}
                                        value={publicityData.until}
                                        inputVariant="outlined"
                                        onChange={date => { handleChange({ target: { name: "until", value: date, type: "date" } }) }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <CustomAutoComplete
                                    options={options}
                                    getOptionLabel={(option) => option?.name ? option?.name : ""}
                                    value={publicityData.storeId}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    open={open}
                                    onOpen={() => {
                                        setOpen(true);
                                    }}
                                    onClose={() => {
                                        setOpen(false);
                                    }}
                                    onChange={handleAutoComplete}
                                    loading={loadingStores}
                                    textFieldInputProps={{
                                        label: "Tienda",
                                        name: "name",
                                        variant: "outlined",
                                        error: errorsForm.storeId ? true : false,
                                        helperText: errorsForm.storeId,
                                        value: filters?.name
                                    }}
                                    onInputChange={(e) => { setfilters((oldFilters) => { return { ...oldFilters, [e?.target?.name]: e?.target?.value } }) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={errorsForm.adsPositionId ? true : false}
                                    helperText={errorsForm.adsPositionId}
                                    variant="outlined"
                                    label="Ubicacion"
                                    name="adsPositionId"
                                    value={publicityData.adsPositionId}
                                    onChange={handleChange}
                                    fullWidth select >
                                    {
                                        adsPositions.map((adsPosition, i) => {
                                            return (
                                                <MenuItem key={i} value={adsPosition.id}>
                                                    {adsPosition.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={errorsForm.priority ? true : false}
                                    helperText={errorsForm.priority}
                                    type="number"
                                    variant="outlined"
                                    label="Prioridad"
                                    name="priority"
                                    value={publicityData.priority}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={errorsForm.price ? true : false}
                                    helperText={errorsForm.price}
                                    type="number"
                                    variant="outlined"
                                    label="Precio"
                                    name="price"
                                    value={publicityData.price}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={errorsForm.percentage ? true : false}
                                    helperText={errorsForm.percentage}
                                    type="number"
                                    variant="outlined"
                                    label="Porcentaje de descuento (%)"
                                    name="percentage"
                                    value={publicityData.percentage}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box textAlign="right" mt={5}>
                        <Button type="submit" color="primary" variant="contained">
                            Actualizar Publicidad
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default PublicitySectionEdit;