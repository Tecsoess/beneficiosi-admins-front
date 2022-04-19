import { Box, Checkbox, Grid, MenuItem, Table, TableContainer, TableHead, TableRow, TableCell, TextField, TableBody, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import findPortraitImg from "../../../helpers/findPortraitImage";
import useCategories from "../../../hooks/useCategories";
import useProducts from "../../../hooks/useProducts";
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import 'date-fns';
import { format } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DateTimePicker,
} from '@material-ui/pickers';
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import { useHistory } from "react-router-dom";


type errorsFormType = {
    productId: string | null;
    storeCategoryId: string | null;
    priority: string | null;
    price: string | null;
    dateStart: string | null;
    dateEnd: string | null
}

const FeaturedProductsCreate = () => {

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [filters, setFilters] = useState({ name: "", storeName: "", perPage: 99999999999 });

    const [featuredProductData, setFeaturedProductData] = useState({ storeCategoryId: "", productId: "", priority: 1, price: 0, dateStart: new Date(), dateEnd: new Date() });

    const [errorsForm, setErrorsForm] = useState<errorsFormType>({ storeCategoryId: null, priority: null, price: null, dateStart: null, dateEnd: null, productId: null });

    const [{ categories, error: categoriesError, loading }, getCategories] = useCategories();

    const [{ products, error, loading: productsLoading, size, numberOfPages, total }, getProducts] = useProducts({ options: { useCache: false, manual: true }, axiosConfig: { params: { ...filters, storeCategoryId: featuredProductData.storeCategoryId } } });

    const [{ data, loading: createLoading, error: createError }, createFeaturedProduct] = useAxios({ url: "/featured-ads", method: "POST" }, { manual: true, useCache: false });


    useEffect(() => {
        setLoading?.({ show: loading, message: "Obteniendo datos" })
    }, [loading])

    useEffect(() => {
        setLoading?.({ show: createLoading, message: "Creando producto favorito" })
    }, [createLoading])

    useEffect(() => {
        if (data) {
            setCustomAlert?.({ show: true, message: "El producto se ha añadido a destacados exitosamente.", severity: "success" });
            history.push("/ads-management/featured-products");
        }
    }, [createLoading])

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
        }

        if (categoriesError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesError?.response?.status === 400 ? categoriesError?.response?.data.message[0] : categoriesError?.response?.data.message}.`, severity: "error" });
        }

        if (createError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError?.response?.status === 400 ? createError?.response?.data.message[0] : createError?.response?.data.message}.`, severity: "error" });
        }
    }, [error, categoriesError, createError]);

    useEffect(() => {
        setErrorsForm({
            storeCategoryId: validate(featuredProductData.storeCategoryId, [
                { validator: isRequired, errorMessage: "La Categoria es obligatoria." },
            ]),
            price: validate(featuredProductData.price, [
                { validator: isNumber, errorMessage: "El costo tiene que ser un numero." },
            ]),
            dateEnd: validate(featuredProductData.dateEnd, [
                { validator: isRequired, errorMessage: "La fecha final es obligatoria." },
            ]),
            dateStart: validate(featuredProductData.dateStart, [
                { validator: isRequired, errorMessage: "La fecha de inicio es obligatoria." },
            ]),
            priority: validate(featuredProductData.priority, [
                { validator: isRequired, errorMessage: "La prioridad es obligatoria." },
                { validator: isNumber, errorMessage: "Tiene que ser un numero." },
            ]),
            productId: validate(featuredProductData.productId, [
                { validator: isRequired, errorMessage: "Por favor seleccione un producto." },
            ]),
        });
    }, [featuredProductData])

    useEffect(() => {
        setFeaturedProductData((oldFeaturedProductData) => {
            return {
                ...oldFeaturedProductData,
                productId: ""
            }
        })
        getProducts();
    }, [filters, featuredProductData.storeCategoryId])

    const handleFiltersChange = (e: any) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        for (let errors in errorsForm) {
            if (errorsForm[errors as keyof typeof errorsForm] != null) {
                alert(errorsForm[errors as keyof typeof errorsForm]);
                return;
            }
        }

        const { dateStart, dateEnd, ...rest } = featuredProductData;

        createFeaturedProduct({ data: { ...rest, from: format(dateStart, "yyyy-MM-dd H:mm:ss"), until: format(dateEnd, "yyyy-MM-dd H:mm:ss") } });
    }

    const handleChange = (e: any) => {
        console.log(e.target.value);
        setFeaturedProductData((oldFeaturedProductData) => {
            return {
                ...oldFeaturedProductData,
                [e.target.name]: e.target.type === "checkbox" ? Number(e.target.value) : e.target.value
            }
        })
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Crear Producto Destacado
            </Box>

            <Box mt={5} bgcolor="white" p={5}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                helperText={errorsForm.storeCategoryId}
                                error={errorsForm.storeCategoryId ? true : false}
                                style={{ textTransform: "capitalize" }}
                                fullWidth
                                value={featuredProductData.storeCategoryId}
                                onChange={handleChange}
                                name="storeCategoryId"
                                variant="outlined"
                                label="Categoria"
                                select>
                                <MenuItem style={{ textTransform: "capitalize" }} value="" >
                                    Seleccione una opcion
                                </MenuItem>
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <MenuItem style={{ textTransform: "capitalize" }} value={category.id} key={i}>
                                                {category.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                helperText={errorsForm.priority}
                                error={errorsForm.priority ? true : false}
                                fullWidth
                                value={featuredProductData.priority}
                                onChange={handleChange}
                                name="priority"
                                variant="outlined"
                                type="number"
                                label="Prioridad"
                            />
                        </Grid>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid item xs={12} md={6}>
                                <DateTimePicker
                                    helperText={errorsForm.dateStart}
                                    error={errorsForm.dateStart ? true : false}
                                    fullWidth
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Fecha inicio"
                                    format="dd/MM/yyyy H:mm:ss"
                                    value={featuredProductData.dateStart}
                                    invalidDateMessage="La fecha no es correcta."
                                    minDate={new Date()}
                                    onChange={date => { handleChange({ target: { name: "dateStart", value: date, type: "date" } }) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <DateTimePicker
                                    helperText={errorsForm.dateEnd}
                                    error={errorsForm.dateEnd ? true : false}
                                    fullWidth
                                    InputProps={{ readOnly: true }}
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Fecha Final"
                                    format="dd/MM/yyyy H:mm:ss"
                                    invalidDateMessage="La fecha no es correcta."
                                    minDate={featuredProductData.dateStart}
                                    value={featuredProductData.dateEnd}
                                    onChange={date => { handleChange({ target: { name: "dateEnd", value: date, type: "date" } }) }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <Grid item xs={12}>
                            <TextField
                                helperText={errorsForm.price}
                                error={errorsForm.price ? true : false}
                                fullWidth
                                value={featuredProductData.price}
                                onChange={handleChange}
                                name="price"
                                type="number"
                                variant="outlined"
                                label="Costo"
                            />
                        </Grid>
                    </Grid>

                    <Box mt={5}>
                        <Box component="h3">Filtros</Box>
                        <Grid container spacing={10}>
                            <Grid item xs={12} md={6}>
                                <TextField variant="outlined" name="name" color="primary" placeholder="Buscar Producto..." onChange={handleFiltersChange} value={filters.name} fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField variant="outlined" label="Tienda" name="storeName" color="primary" placeholder="Buscar por tienda..." onChange={handleFiltersChange} value={filters.storeName} fullWidth />
                            </Grid>
                        </Grid>
                        <TableContainer style={{ height: 400, marginTop: 30 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Box textAlign="center">

                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Nro.
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                imagen
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Nombre
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Tienda
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box textAlign="center">
                                                Categoria
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        productsLoading ?
                                            <TableRow>
                                                <TableCell colSpan={6}>
                                                    <Box py={3} textAlign="center">
                                                        Cargando Productos...
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            :
                                            products.length > 0 ?
                                                products.map((product, i) => {
                                                    return (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <Box textAlign="center">
                                                                    <Checkbox
                                                                        name="productId"
                                                                        value={product.id}
                                                                        checked={product.id === featuredProductData.productId}
                                                                        onChange={handleChange}
                                                                    />
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box textAlign="center">
                                                                    {i + 1}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box textAlign="center">
                                                                    <img style={{ height: 60, width: 60, borderRadius: 10 }} src={`${process.env.REACT_APP_API_URL}/${findPortraitImg(product.productImages).path}`} alt="" />
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box textAlign="center">
                                                                    {product.name}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box textAlign="center">
                                                                    {
                                                                        product.store?.storeProfile?.logo ?
                                                                            <img style={{ height: 60, width: 60 }} src={`${process.env.REACT_APP_API_URL}/${product.store?.storeProfile?.logo}`} alt="" />
                                                                            :
                                                                            <StoreMallDirectoryIcon style={{ fontSize: 60 }} />
                                                                    }
                                                                    <Box component="p" m={0}>{product.store.name}</Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box textAlign="center">
                                                                    {product.store?.category?.name}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                :
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <Box py={3} textAlign="center" color="red">
                                                            No se encontraron productos.
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>
                        {
                            errorsForm.productId ?
                                <Box color="red">{errorsForm.productId}</Box>
                                :
                                null
                        }
                    </Box>
                    <Box textAlign="right" mt={5}>
                        <Button type="submit" color="primary" variant="contained">
                            Guardar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box >
    )
}

export default FeaturedProductsCreate;