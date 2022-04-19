import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core"
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Map from "../../components/googlemaps/Map";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../hooks/useAxios";
import useLocations from "../../hooks/useLocations";
declare var Terraformer: any;

const LocationsEdit = () => {

    const params = useParams<any>();

    const history = useHistory();

    const { setLoading, setCustomAlert } = useAuth();

    const [locationFormData, setLocationFormData] = useState({ name: "", parentId: "", area: "", address: "" })

    const [polygon, setPolygon] = useState([]);

    const [{ data: updateData, error: updateError }, updateLocation] = useAxios({ url: `/locations/${params.id}`, method: "PUT" }, { manual: true, useCache: false });

    const [{ data, error }, getLocation] = useAxios({ url: `/locations/${params.id}` }, { useCache: false });

    const [{ locations, error: locationsError }, getLocations] = useLocations({ options: { useCache: false } });

    const [errorsForm, setErrorsForm] = useState<{ name: null | string, address: null | string, area: null | string }>({ name: null, address: null, area: null });

    const [googleMapOptions, setGoogleMapsOptions] = useState<any>({
        center: { lat: -34.6036844, lng: -58.3815591 },
        zoom: 8,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
    });

    useEffect(() => {
        setLoading?.({ show: true, message: "Obteniendo Datos" });
        Promise.all([getLocation(), getLocations()]).then((values) => {
            setLoading?.({ show: false, message: "" });
        })
    }, []);

    useEffect(() => {
        if (updateData) {
            setCustomAlert?.({ show: true, message: `La ubicación ha sido actualizada.`, severity: "success" });
            history.push('/locations');
        }
    }, [updateData])

    useEffect(() => {
        if (data) {
            console.log(data)
            const { id, area, parentLocation, ...rest } = data;
            setLocationFormData((oldLocationData) => {
                return {
                    ...oldLocationData,
                    ...rest,
                    parentId: parentLocation?.id
                }
            });
            var realArea: any = [];
            Terraformer?.WKT?.parse?.(area)?.coordinates?.forEach?.((areas: any) => {
                return realArea.push(areas[0].map((points: any) => {
                    return {
                        lat: points[0],
                        lng: points[1]
                    }
                }))
            })
            setPolygon(realArea)
            setGoogleMapsOptions((oldGoogleMapsOpts: any) => {
                return {
                    ...oldGoogleMapsOpts,
                    center: realArea[0][0]
                }
            });
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
        }

        if (updateError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError.response?.status === 400 ? updateError.response?.data.message[0] : updateError.response?.data.message}.`, severity: "error" });
        }

        if (locationsError) {
            setLoading?.({ show: false, message: "" });
            setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${locationsError.response?.status === 400 ? locationsError.response?.data.message[0] : locationsError.response?.data.message}.`, severity: "error" });
        }
    }, [error, updateError, locationsError]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        for (let errors in errorsForm) {
            if (errorsForm[errors as keyof typeof errorsForm] != null) {
                alert(errorsForm[errors as keyof typeof errorsForm]);
                return;
            }
        }

        setLoading?.({ show: true, message: "Actualizando ubicación" });
        await updateLocation({ data: locationFormData });
        setLoading?.({ show: false, message: "" });
    }

    const handleChange = (e: any) => {
        setLocationFormData((oldLocationData) => {
            return {
                ...oldLocationData,
                [e.target.name]: e.target.value
            }
        })
    }

    const hanleMapClick = (e: any) => {

    }

    const handleDrawing = (e: any) => {
        console.log(e);
        let customData = `((${e.map((latLng: any) => {
            return `${latLng.lat} ${latLng.lng}`
        }).join(",")}, ${e[0].lat} ${e[0].lng}))`;
        setLocationFormData((oldLocationData) => {
            return {
                ...oldLocationData,
                area: customData
            }
        });
    }

    return (
        <Box>
            <Box component="h1" color="gray">
                Editar Ubicacion
            </Box>

            <Box bgcolor="white" p={4}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={10}>
                        <Grid item md={6}>
                            <TextField
                                error={errorsForm.name ? true : false}
                                helperText={<Box component="span">{errorsForm.name}</Box>}
                                onChange={handleChange}
                                label="Nombre"
                                name="name"
                                variant="outlined"
                                value={locationFormData.name}
                                fullWidth></TextField>
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                onChange={handleChange}
                                value={locationFormData.parentId}
                                disabled={locations.length > 0 ? false : true}
                                name="parentId"
                                select
                                label="Pertenece a:"
                                variant="outlined"
                                fullWidth>
                                {
                                    locations.length > 0 ?
                                        locations.map((location, i) => {
                                            return (
                                                <MenuItem value={location.id} key={i}>
                                                    {location.name}
                                                </MenuItem>
                                            )
                                        })
                                        :
                                        <MenuItem value={0}>
                                            No hay opciones
                                        </MenuItem>
                                }
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box mt={10}>
                        <Map
                            defaultPolygon={polygon}
                            options={
                                googleMapOptions
                            }
                            onClick={hanleMapClick}
                            searchBox={
                                {
                                    label: "Dirección",
                                    name: "address",
                                    onChange: handleChange,
                                    value: locationFormData.address,
                                    error: errorsForm.address
                                }
                            }
                            drawingEnd={handleDrawing}
                            width="100%"
                            height="500px"
                            withDraw
                        />
                    </Box>

                    {
                        errorsForm.area ?
                            <Box mt={20} component="p" color="red">
                                {errorsForm.area}
                            </Box>
                            :
                            null
                    }

                    <Box textAlign="right" mt={18}>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    )
}

export default LocationsEdit;