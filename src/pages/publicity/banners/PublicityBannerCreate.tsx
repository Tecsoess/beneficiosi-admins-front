import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core"
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useEffect, useState } from "react";
import ImgUploadInput from "../../../components/ImgUploadInput";
import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import CustomAutoComplete from "../../../components/CustomAutoComplete";
import useStores from "../../../hooks/useStores";
import useAxios from "../../../hooks/useAxios";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

type errorsFormType = {
    image: string | null;
    url: string | null;
    dateStart: string | null;
    dateEnd: string | null;
    storeId: string | null;
    priority: string | null;
    price: string | null;
    percentage: string | null;
}

type BannerFormDataType = {
    image: any,
    url: string,
    dateStart: any,
    dateEnd: any,
    storeId: any,
    priority: number | string,
    price: number | string,
    percentage: number | string,
}


const PublicityBannerCreate = () => {

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [bannerData, setBannerData] = useState<BannerFormDataType>({
        image: null,
        url: "",
        dateStart: new Date(),
        dateEnd: new Date(),
        storeId: null,
        priority: 1,
        price: 0,
        percentage: 0
    });

    const [filters, setfilters] = useState({ name: "", perPage: 200, page: 1 });

    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState<any[]>([]);

    const [{ stores, error, loading: loadingStores, total }, getStores] = useStores({ options: { manual: true, useCache: false }, axiosConfig: { params: { ...filters } } });

    const [{ data: dataCreate, error: errorCreate, loading: loadingCreate }, createBanner] = useAxios({ url: "/main-banner-ads", method: "POST" }, { manual: true, useCache: false });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({
        image: null,
        url: null,
        dateStart: null,
        dateEnd: null,
        storeId: null,
        priority: null,
        price: null,
        percentage: null
    });

    useEffect(() => {
        if (errorCreate) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorCreate?.response?.status === 400 ? errorCreate?.response?.data.message[0] : errorCreate?.response?.data.message}.`, severity: "error" });
        }

        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }
    }, [errorCreate, error]);

    useEffect(() => {
        if (dataCreate) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Se ha creado el banner exitosamente.`, severity: "success" });
            history.push("/ads-management/publicity-banner");
        }
    }, [dataCreate]);

    useEffect(() => {
        setOptions(stores);
    }, [stores])

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    useEffect(() => {
        getStores({ params: { ...filters } });
    }, [filters])



    useEffect(() => {
        setErrorsForm({
            image: validate(bannerData.image, [
                { validator: isRequired, errorMessage: "El banner es obligatorio." },
            ]),
            url: validate(bannerData.url, [
                { validator: isRequired, errorMessage: "La url es obligatoria." },
            ]),
            dateStart: validate(bannerData.dateStart, [
                { validator: isRequired, errorMessage: "La fecha de inicio es obligatoria." },
            ]),
            dateEnd: validate(bannerData.dateEnd, [
                { validator: isRequired, errorMessage: "La fecha final es obligatoria." },
            ]),
            storeId: validate(bannerData.storeId, [
                { validator: isRequired, errorMessage: "La tienda es obligatoria." },
            ]),
            priority: validate(bannerData.priority, [
                { validator: isRequired, errorMessage: "La prioridad es obligatoria." },
            ]),
            price: validate(bannerData.price, [
                { validator: isNumber, errorMessage: "El precio tiene que ser un numero." },
            ]),
            percentage: validate(bannerData.percentage, [
                { validator: isNumber, errorMessage: "El porcentaje tiene que ser un numero." },
            ])
        })
    }, [bannerData]);

    const handleChange = (e: any) => {
        setBannerData((oldBannerData) => {
            return {
                ...oldBannerData,
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

        data.append("url", bannerData.url);
        data.append("from", format(bannerData.dateStart, "yyyy-MM-dd H:mm:ss"));
        data.append("until", format(bannerData.dateEnd, "yyyy-MM-dd H:mm:ss"));
        data.append("priority", bannerData.priority.toString());
        data.append("price", bannerData.price.toString());
        data.append("percentage", bannerData.percentage.toString());
        data.append("storeId", bannerData?.storeId?.storeId?.toString());
        data.append("image", bannerData?.image, bannerData?.image.name);
        setLoading?.({ show: true, message: "Creando banner publicitario" });
        await createBanner({ data: data });
        setLoading?.({ show: false, message: "" });
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Crear Banner
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <Box mb={4}>
                        <ImgUploadInput name="image" change={handleChange} previewFor="banner" height="300px" width="100%" />
                        {
                            errorsForm.image ?
                                <Box mt={2} color="red">
                                    {errorsForm.image}
                                </Box>
                                :
                                null
                        }
                    </Box>
                    <Box mt={4}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    error={errorsForm.url ? true : false}
                                    helperText={errorsForm.url}
                                    variant="outlined"
                                    label="Url"
                                    name="url"
                                    value={bannerData.url}
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
                                        value={bannerData.dateStart}
                                        inputVariant="outlined"
                                        invalidDateMessage="La fecha no es correcta."
                                        minDate={new Date()}
                                        onChange={date => { handleChange({ target: { name: "dateStart", value: date, type: "date" } }) }}
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
                                        minDate={bannerData.dateStart}
                                        value={bannerData.dateEnd}
                                        inputVariant="outlined"
                                        onChange={date => { handleChange({ target: { name: "dateEnd", value: date, type: "date" } }) }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <CustomAutoComplete
                                    options={options}
                                    getOptionLabel={(option) => option?.name ? option?.name : ""}
                                    value={bannerData.storeId}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    open={open}
                                    onOpen={() => {
                                        setOpen(true);
                                    }}
                                    onClose={() => {
                                        setOpen(false);
                                    }}
                                    onChange={(e, value) => { handleChange({ target: { name: "storeId", value: value, type: "number" } }) }}
                                    loading={loadingStores}
                                    textFieldInputProps={{
                                        label: "Tienda",
                                        name: "name",
                                        variant: "outlined",
                                        error: errorsForm.storeId ? true : false,
                                        helperText: errorsForm.storeId
                                    }}
                                    onInputChange={(e) => { if (e.target.value.length > 2) setfilters((oldFilters) => { return { ...oldFilters, [e.target.name]: e.target.value } }) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={errorsForm.priority ? true : false}
                                    helperText={errorsForm.priority}
                                    variant="outlined"
                                    label="Prioridad"
                                    name="priority"
                                    value={bannerData.priority}
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
                                    value={bannerData.price}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={errorsForm.percentage ? true : false}
                                    helperText={errorsForm.percentage}
                                    type="number"
                                    variant="outlined"
                                    label="Porcentaje de descuento"
                                    name="percentage"
                                    value={bannerData.percentage}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box mt={4} textAlign="right">
                        <Button type="submit" color="primary" variant="contained">
                            Crear Banner
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default PublicityBannerCreate;