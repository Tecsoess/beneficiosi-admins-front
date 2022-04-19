import { Button, Box, Grid, TextField, MenuItem } from "@material-ui/core"
import { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Map from "../../components/googlemaps/Map";
import { useAuth } from "../../contexts/AuthContext";
import { isRequired, validate } from "../../helpers/formsValidations";
import useAxios from "../../hooks/useAxios";
import useLocations from "../../hooks/useLocations";


type errorsFormType = {
  name: null | string,
  address: null | string,
  area: null | string
}

const LocationsCreate = () => {

  const history = useHistory();

  const { setLoading, setCustomAlert } = useAuth();

  const [locationFormData, setLocationFormData] = useState({ name: "", parentId: "", address: "", area: "" })

  const [{ data, error: createError }, createLocation] = useAxios({ url: "/locations", method: "POST" }, { manual: true, useCache: false });

  const [{ locations, total, error, loading }, getLocations] = useLocations({ axiosConfig: { params: { perPage: 200 } }, options: { useCache: false } });

  const [errorsForm, setErrorsForm] = useState<errorsFormType>({ name: null, address: null, area: null });

  const [googleMapOptions, setGoogleMapsOptions] = useState<any>({
    center: { lat: -34.6036844, lng: -58.3815591 },
    zoom: 8,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo datos" });
  }, [loading]);

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: `La Ubicacion ha sido creada Exitosamente.`, severity: "success" });
      history.push("/locations")
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
    }

    if (createError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${createError.response?.status === 400 ? createError.response?.data.message[0] : createError.response?.data.message}.`, severity: "error" });
    }
  }, [error, createError])

  useEffect(() => {
    setErrorsForm({
      name: validate(locationFormData.name, [
        { validator: isRequired, errorMessage: "el nombre es Obligatorio." },
      ]),
      address: validate(locationFormData.address, [
        { validator: isRequired, errorMessage: "La dirección es obligatoria." }
      ]),
      area: validate(locationFormData.area, [
        { validator: isRequired, errorMessage: "La zona es obligatoria." }
      ]),
    })
  }, [locationFormData]);

  const hanleMapClick = (e: any) => {
    setGoogleMapsOptions({ zoom: 10, center: e });
  }

  const handleChange = (e: any) => {
    console.log(e.target.name);
    setLocationFormData({
      ...locationFormData,
      [e.target.name]: e.target.value
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

    setLoading?.({ show: true, message: "Creando ubicación" });
    await createLocation({ data: locationFormData });
    setLoading?.({ show: false, message: "" });
  }

  const handleDrawing = (e: any[]) => {
    let customData = `((${e.map(latLng => {
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
        Agregar Ubicacion
      </Box>

      <Box bgcolor="white" p={4}>
        <form onSubmit={handleSubmit}>
          <Box mb={10}>
            <Map
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
            {
              errorsForm.area ?
                <Box mt={10} component="p" color="red">
                  {errorsForm.area}
                </Box>
                :
                null
            }
          </Box>
          <Grid container spacing={10}>
            <Grid item md={6}>
              <TextField
                error={errorsForm.name ? true : false}
                helperText={<Box component="span">{errorsForm.name}</Box>}
                onChange={handleChange}
                value={locationFormData.name}
                label="Nombre"
                name="name"
                variant="outlined"
                fullWidth></TextField>
            </Grid>
            <Grid item md={6}>
              <TextField
                onChange={handleChange}
                disabled={locations.length > 0 ? false : true}
                name="parentId"
                value={locationFormData.parentId}
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

export default LocationsCreate;
