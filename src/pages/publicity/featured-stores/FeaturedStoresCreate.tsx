import { Box, Button, Checkbox, CircularProgress, Grid, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import StoreIcon from '@material-ui/icons/Store';
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useCategories from "../../../hooks/useCategories";
import useStores from "../../../hooks/useStores";
import imageNotFound from '../../../assets/images/image-not-found.png';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import useAxios from "../../../hooks/useAxios";
import { useHistory } from "react-router-dom";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";


type errorsFormType = {

    from: string | null;
    until: string | null;
    storeId: string | null;
    priority: string | null;
    price: string | null;
}

type storeAdsDataType = {
    from: any,
    until: any,
    storeId: any,
    priority: number | string,
    price: number | string,
}
const FeaturedStoresCreate = () => {

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({ name: "", storeCategoryId: "", page: 1 });

    const [storeAdsData, setStoreAdsData] = useState<storeAdsDataType>({
        storeId: "",
        price: 0,
        priority: 1,
        from: new Date(),
        until: new Date()
    });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({
        from: null,
        until: null,
        storeId: null,
        priority: null,
        price: null
    });

    const [{ categories, error: errorCategories, loading: loadingCategories }, getCategories] = useCategories();

    const [{ stores, total, size, numberOfPages, error: errorStores, loading }, getStores] = useStores({ axiosConfig: { params: { ...filters } }, options: { manual: true, useCache: false } });

    const [{ data: createData, error: createError, loading: createLoading }, createStoreAds] = useAxios({ url: "/store-ads", method: "POST" }, { useCache: false, manual: true });

    const [storeOptions, setstoreOptions] = useState<any[]>([]);

    const observer = useRef<any>();

    useEffect(() => {
        setErrorsForm({
            from: validate(storeAdsData.from, [
                { validator: isRequired, errorMessage: "La fecha de inicio es obligatoria." },
            ]),
            until: validate(storeAdsData.until, [
                { validator: isRequired, errorMessage: "La fecha final es obligatoria." },
            ]),
            storeId: validate(storeAdsData.storeId, [
                { validator: isRequired, errorMessage: "La tienda es obligatoria." },
            ]),
            priority: validate(storeAdsData.priority, [
                { validator: isRequired, errorMessage: "La prioridad es obligatoria." },
            ]),
            price: validate(storeAdsData.price, [
                { validator: isNumber, errorMessage: "El precio tiene que ser un numero." },
            ])
        })
    }, [storeAdsData]);

    const lastStoreRef = useCallback((store: any) => {
        if (loading) return
        if (observer?.current) observer?.current?.disconnect?.();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && numberOfPages > filters.page) {
                setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        page: oldFilters.page + 1
                    }
                })
            }
        })
        if (store) observer?.current?.observe?.(store)
    }, [loading, numberOfPages, filters])

    useEffect(() => {
        setLoading?.({ show: loadingCategories, message: "Cargando Categorias" });
    }, [loadingCategories]);

    useEffect(() => {
        setLoading?.({ show: createLoading, message: "Creando publicidad" });
    }, [createLoading]);

    useEffect(() => {
        if (errorCategories) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${errorCategories?.response?.status === 400 ? errorCategories?.response?.data.message[0] : errorCategories?.response?.data.message}.`, severity: "error" });
        }

        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [errorCategories, createError]);

    useEffect(() => {
        if (createData) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Se ha creado la publicidad exitosamente.`, severity: "success" });
            history.push("/ads-management/featured-stores");
        }
    }, [createData]);

    useEffect(() => {
        getStores({ params: { ...filters } });
    }, [filters])

    useEffect(() => {
        setstoreOptions([]);
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                page: 1
            }
        });
    }, [filters.name, filters.storeCategoryId])

    useEffect(() => {
        setstoreOptions((oldStoresOptions) => {
            return [...oldStoresOptions, ...stores]
        });
    }, [stores]);

    const handleFiltersChange = (e: any) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleChange = (e: any) => {
        setStoreAdsData((oldStoreAdsData) => {
            return {
                ...oldStoreAdsData,
                [e.target.name]: e.target.type === "checkbox" ? Number(e.target.value) : e.target.value
            }
        });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log(storeAdsData);

        for (let errors in errorsForm) {
            if (errorsForm[errors as keyof typeof errorsForm] != null) {
                alert(errorsForm[errors as keyof typeof errorsForm]);
                return;
            }
        }

        createStoreAds({ data: { ...storeAdsData, from: format(storeAdsData.from, "yyyy-MM-dd H:mm:ss"), until: format(storeAdsData.until, "yyyy-MM-dd H:mm:ss") } })
    }

    return (
        <Box>
            <Box mb={4} color="gray" display="flex" alignItems="center">
                <StoreIcon style={{ fontSize: '40px' }} />
                <h1>Crear Tienda Destacada</h1>
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <Box mb={4}>
                        <Grid container spacing={4}>
                            <Grid xs={12} md={6} item>
                                <TextField
                                    name="name"
                                    value={filters.name}
                                    fullWidth
                                    variant="outlined"
                                    label="Nombre de la tienda"
                                    placeholder="Buscar Tienda..."
                                    onChange={handleFiltersChange} />
                            </Grid>
                            <Grid xs={12} md={6} item>
                                <TextField
                                    name="storeCategoryId"
                                    value={filters.storeCategoryId}
                                    fullWidth
                                    variant="outlined"
                                    label="Categoria de la tienda"
                                    placeholder="Buscar Tienda..."
                                    onChange={handleFiltersChange}
                                    select >
                                    {
                                        categories.map((category, i) => {
                                            return (
                                                <MenuItem key={i} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>

                    <TableContainer className="table-stores" style={{ maxHeight: 500 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Box textAlign="center" component="h3">
                                            Por favor Seleccione una tienda
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Imagen</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Correo</TableCell>
                                    <TableCell>Teléfono</TableCell>
                                    <TableCell>Categoría</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {

                                    storeOptions.map((store, i) => <TableRow ref={i + 1 === storeOptions.length ? lastStoreRef : null} key={i}>
                                        <TableCell>
                                            <Checkbox
                                                value={store.storeId}
                                                checked={storeAdsData.storeId === store.storeId}
                                                onChange={handleChange}
                                                name="storeId"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell>{store.id}</TableCell>
                                        <TableCell>
                                            {
                                                store?.storeProfile?.logo ?
                                                    <img style={{ borderRadius: "100%", height: 80, width: 80, boxShadow: "5px 5px 10px -3px rgba(0,0,0,0.5)" }} src={process.env.REACT_APP_API_URL + "/" + store?.storeProfile?.logo} alt="" />
                                                    :
                                                    <Box color="gray">
                                                        <img style={{ height: 70, width: 70 }} src={imageNotFound} alt="" />
                                                    </Box>
                                            }
                                        </TableCell>
                                        <TableCell>{store.name}</TableCell>
                                        <TableCell>{store.email}</TableCell>
                                        <TableCell>{store?.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Box textAlign="center" style={{ textTransform: "capitalize" }}>
                                                {store.storeCategory.name}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                    )

                                }
                                {

                                }
                                {
                                    loading ?
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <Box textAlign="center">
                                                    <CircularProgress />
                                                    <p>
                                                        Cargando
                                                    </p>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                        :
                                        storeOptions.length > 0 ?
                                            null
                                            :
                                            <TableRow>
                                                <TableCell colSpan={7}>
                                                    <Box textAlign="center" color="red">
                                                        No hay tiendas :(
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box mt={3}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        fullWidth
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Fecha inicio"
                                        format="dd/MM/yyyy H:mm:ss"
                                        value={storeAdsData.from}
                                        inputVariant="outlined"
                                        invalidDateMessage="La fecha no es correcta."
                                        minDate={new Date()}
                                        onChange={date => { handleChange({ target: { name: "from", value: date, type: "date" } }) }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DateTimePicker
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                        margin="normal"
                                        id="date-picker-dialog"
                                        label="Fecha Final"
                                        format="dd/MM/yyyy H:mm:ss"
                                        invalidDateMessage="La fecha no es correcta."
                                        minDate={storeAdsData.from}
                                        value={storeAdsData.until}
                                        inputVariant="outlined"
                                        onChange={date => { handleChange({ target: { name: "until", value: date, type: "date" } }) }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    type="number"
                                    error={errorsForm.priority ? true : false}
                                    helperText={errorsForm.priority}
                                    variant="outlined"
                                    label="Prioridad"
                                    name="priority"
                                    value={storeAdsData.priority}
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
                                    value={storeAdsData.price}
                                    onChange={handleChange}
                                    fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box textAlign="right">
                        <Button type="submit" variant="contained" color="primary">
                            Crear Publicidad
                        </Button>
                    </Box>
                </form>

            </Box>

        </Box>
    )
}

export default FeaturedStoresCreate;