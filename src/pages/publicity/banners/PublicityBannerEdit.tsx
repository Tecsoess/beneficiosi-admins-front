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
import { useHistory, useParams } from "react-router-dom";

type errorsFormType = {
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
    percentage: number | string;
}


const PublicityBannerEdit = () => {

    const params = useParams<any>();

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [{ data: banner, error: errorBanner, loading: loadingBanner }, getBanner] = useAxios({ url: `/main-banner-ads/${params?.id}` }, { useCache: false });

    const [imagePreview, setImagePreview] = useState<any>(null);

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

    const [{ data: dataEdit, error: errorEdit, loading: loadingEdit }, editBanner] = useAxios({ url: `/main-banner-ads/${params?.id}`, method: "PUT" }, { manual: true, useCache: false });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({
        url: null,
        dateStart: null,
        dateEnd: null,
        storeId: null,
        priority: null,
        price: null,
        percentage: null
    });

    useEffect(() => {
        if (errorEdit) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorEdit?.response?.status === 400 ? errorEdit?.response?.data.message[0] : errorEdit?.response?.data.message}.`, severity: "error" });
        }

        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (errorBanner) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorBanner?.response?.status === 400 ? errorBanner?.response?.data.message[0] : errorBanner?.response?.data.message}.`, severity: "error" });
        }
    }, [errorEdit, error, errorBanner]);

    useEffect(() => {
        if (dataEdit) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Se ha actualizado el banner exitosamente.`, severity: "success" });
            history.push("/ads-management/publicity-banner");
        }
    }, [dataEdit]);

    useEffect(() => {
        setLoading?.({ show: loadingBanner, message: "Obteniendo información" });
    }, [loadingBanner]);

    useEffect(() => {
        if (banner) {
            setImagePreview(`${process.env.REACT_APP_API_URL}/${banner.imgPath}`);

            setBannerData((oldBannerData) => {
                return {
                    ...oldBannerData,
                    url: banner?.url,
                    dateStart: new Date(banner.from),
                    dateEnd: new Date(banner.until),
                    storeId: banner?.store,
                    priority: Number(banner?.priority),
                    price: Number(banner?.price)
                }
            });
            console.log(banner);
        }
    }, [banner]);

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
            percentage: validate(bannerData.price, [
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

        if (bannerData?.image) {
            data.append("image", bannerData?.image, bannerData?.image.name);
        }

        setLoading?.({ show: true, message: "Actualizando banner publicitario" });
        await editBanner({ data: data });
        setLoading?.({ show: false, message: "" });
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Editar Banner
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <Box mb={4}>
                        <ImgUploadInput previewImage={imagePreview} name="image" change={handleChange} previewFor="banner" height="300px" width="100%" />
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
                                    onInputChange={(e) => { if (e?.target?.value?.length > 2) setfilters((oldFilters) => { return { ...oldFilters, [e.target.name]: e.target.value } }) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    type="number"
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
                            Actualizar Banner
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default PublicityBannerEdit;