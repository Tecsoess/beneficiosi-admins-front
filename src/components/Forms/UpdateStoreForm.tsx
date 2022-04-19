import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core"
import Card from "../Card";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../contexts/AuthContext";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Map from "../googlemaps/Map";
import ImgUploadInput from "../ImgUploadInput";
import { ImageSharp } from "@material-ui/icons";
import { validURL } from "../../helpers/formsValidations";

type UpdateStoreFormProps = {
  storeId: number
}

type errorForm = {
  name: null | string;
  email: null | string;
  phoneNumber: null | string;
  address: null | string;
  latitude: null | null | string;
  longitude: null | null | string;
  shortDescription: null | string;
}

type storeProfileDataType = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  latitude: null | number;
  longitude: null | number;
  instagram: string;
  facebook: string;
  whatsapp: string;
  videoUrl: string;
  shortDescription: string;
  description: string;
  banner: any;
  logo: any;
  frontImage: any;
  isActive: boolean;
  userStatusCode: string;
}

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: '50%',
    boxShadow: theme.shadows[3]
  },

  marginB: {
    marginBottom: theme.spacing(3),
  },
  shortInfo: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
}));

const UpdateStoreForm = ({ storeId }: UpdateStoreFormProps) => {

  const classes = useStyles();

  const { setLoading, setCustomAlert } = useAuth();

  const [{ data, loading, error }, , getStore] = useAxios({ url: `stores/${storeId}` }, { useCache: false });

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateStore] = useAxios({ url: `stores/${storeId}`, method: "PUT" }, { useCache: false, manual: true });

  const [imagesPreview, setImagesPreview] = useState<{ logo: any, banner: any, frontImage: any }>({ logo: null, banner: null, frontImage: null });

  const [videoPreview, setVideoPreview] = useState("");

  const [googleMapsOptions, setGoogleMapsOptions] = useState<any>({ center: { lat: -34.397, lng: 150.644 }, zoom: 8 });

  const [googleMapsMarkers, setGoogleMapsMarkers] = useState<any[]>([]);

  const [storeProfileData, setStoreProfileData] = useState<storeProfileDataType>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    latitude: null,
    longitude: null,
    instagram: "",
    facebook: "",
    whatsapp: "",
    videoUrl: "",
    shortDescription: "",
    description: "",
    banner: null,
    logo: null,
    frontImage: null,
    isActive: true,
    userStatusCode: ""
  });

  const [errorsForm, setErrorsForm] = useState<errorForm>({
    email: null,
    name: null,
    phoneNumber: null,
    address: null,
    latitude: null,
    longitude: null,
    shortDescription: null
  });

  useEffect(() => {
    if (data) {
      const { id, userStatus, storeCategory, storeProfile, ...rest } = data;
      const { banner, logo, frontImage, videoUrl, ...rest2 } = storeProfile;
      setStoreProfileData({
        ...rest,
        videoUrl: videoUrl,
        ...rest2,
        userStatusCode: userStatus.code
      });
      if (videoUrl && validURL(videoUrl)) {
        console.log(videoUrl);
        var url_string = videoUrl; //window.location.href
        var url = new URL(url_string);
        var v = url.searchParams.get("v");
        setVideoPreview(`https://www.youtube.com/embed/${v}`);
      }

      console.log(logo);
      setImagesPreview({
        logo: logo ? `${process.env.REACT_APP_API_URL}/${logo}` : null,
        banner: banner ? `${process.env.REACT_APP_API_URL}/${banner}` : null,
        frontImage: frontImage ? `${process.env.REACT_APP_API_URL}/${frontImage}` : null
      });

    }
    console.log(data)
  }, [data]);

  useEffect(() => {
    setGoogleMapsOptions((oldGoogleMapsOptions: any) => {
      return {
        ...oldGoogleMapsOptions,
        center: { lat: Number(storeProfileData.latitude), lng: Number(storeProfileData.longitude) }
      }
    })
    setGoogleMapsMarkers([{ lat: Number(storeProfileData.latitude), lng: Number(storeProfileData.longitude) }])
  }, [storeProfileData.latitude, storeProfileData.longitude])

  useEffect(() => {
    if (updateData) {
      setCustomAlert?.({ show: true, message: "Los datos han sido actualizados exitosamente.", severity: "success" });
    }
  }, [updateData])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, updateError]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo usuario" });
  }, [loading]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    console.log(storeProfileData.userStatusCode);

    const formData = new FormData();

    for (let key in storeProfileData) {
      if (key === "logo" || key === "frontImage" || key === "banner") {
        if (storeProfileData[key as keyof typeof storeProfileData]) {
          formData.append(key, storeProfileData[key as keyof typeof storeProfileData], storeProfileData[key as keyof typeof storeProfileData].name)
        }
      } else {
        formData.append(key, storeProfileData[key as keyof typeof storeProfileData])
      }
    }

    setLoading?.({ show: true, message: "Actualizando Tienda" });

    await updateStore({ data: formData });

    setLoading?.({ show: false, message: "" });

  }

  const handleChange = (e: any) => {
    setStoreProfileData((oldStoreProfileData) => {
      return {
        ...oldStoreProfileData,
        [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
      }
    });

    if (e.target.name === "videoUrl") {
      var url_string = e.target.value; //window.location.href
      var url = new URL(url_string);
      var v = url.searchParams.get("v");
      console.log(v);
      setVideoPreview(`https://www.youtube.com/embed/${v}`);
    }

    if (e.target.type === "file") {
      setImagesPreview((oldImagesPreview) => {
        return {
          ...oldImagesPreview,
          [e.target.name]: URL.createObjectURL(e.target.files[0])
        }
      });
    }
  }

  const hanleMapClick = (e: any) => {
    setGoogleMapsMarkers([e]);
    setGoogleMapsOptions({ ...googleMapsOptions, center: e });
    setStoreProfileData((oldStoreData) => ({
      ...oldStoreData,
      latitude: e.lat,
      longitude: e.lng
    }));
  }


  return (
    <Card
      title={storeProfileData.name}
      titleColor="primary"
      className={classes.marginB}
    >
      <Grid container className={classes.marginB} spacing={3}>
        <Grid item xs={12} md={6} container justify="center" alignItems="center">
          <label htmlFor="image" style={{ cursor: "pointer" }}>
            {
              imagesPreview.logo ?
                <img
                  src={imagesPreview.logo}
                  alt={storeProfileData.name}
                  className={classes.avatar}
                />
                :
                <AccountCircleIcon className={classes.avatar} color="primary" />
            }
          </label>
          <input onChange={handleChange} type="file" name="logo" id="image" accept="images/*" hidden />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.shortInfo}>
            <Typography variant="h5">
              Total vendido en la aplicación
            </Typography>

            <Box
              textAlign='right'
              fontSize='2.6rem'
              fontWeight="500"
              borderBottom="1px solid gray">
              $ 100
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box borderBottom="1px solid gray">
                  <p style={{ marginBottom: 0 }}>Fecha de creación</p>
                  <p style={{ marginBottom: 0 }}>12/06/2021</p>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box borderBottom="1px solid gray">
                  <Box component="p">
                    Estado
                  </Box>
                  <Box m={0} component="p">
                    {storeProfileData.isActive ? 'Activo' : 'Inactivo'}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              error={errorsForm.name ? true : false}
              helperText={errorsForm.name ? <Box component="p" color="red">{errorsForm.name}</Box> : null}
              name="name"
              onChange={handleChange}
              value={storeProfileData.name}
              label="Nombre de la tienda"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="shortDescription"
              onChange={handleChange}
              value={storeProfileData.shortDescription}
              label="Descripcion corta de la tienda"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={errorsForm.email ? true : false}
              helperText={errorsForm.email ? <Box component="p" color="red">{errorsForm.email}</Box> : null}
              name="email"
              onChange={handleChange}
              value={storeProfileData.email}
              label="Correo electrónico"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={errorsForm.phoneNumber ? true : false}
              helperText={errorsForm.phoneNumber ? <Box component="p" color="red">{errorsForm.phoneNumber}</Box> : null}
              name="phoneNumber"
              onChange={handleChange}
              value={storeProfileData.phoneNumber}
              label="Teléfono"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="facebook"
              onChange={handleChange}
              value={storeProfileData.facebook}
              label="Facebook"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="instagram"
              onChange={handleChange}
              value={storeProfileData.instagram}
              label="Instagram"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="whatsapp"
              onChange={handleChange}
              value={storeProfileData.whatsapp}
              label="Whatsapp"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={4}
              name="description"
              onChange={handleChange}
              value={storeProfileData.description}
              label="Descripcion de la tienda"
              variant="outlined"
              fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="videoUrl"
              onChange={handleChange}
              value={storeProfileData.videoUrl}
              label="Video de la tienda:"
              variant="outlined"
              fullWidth />
            <Box mt={5}>
              <iframe
                style={{ width: "100%", height: 600 }}
                src={videoPreview}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
            </Box>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Map
            searchBox={
              {
                label: "Direccion de la tienda:",
                onChange: handleChange,
                value: storeProfileData.address,
                name: "address",
                error: errorsForm.address
              }
            }
            options={googleMapsOptions}
            onClick={hanleMapClick}
            markers={googleMapsMarkers}
            height="600px"
            width="100%" />
        </Box>

        <Box mt={15}>
          <Box textAlign="center" component="h2" color="gray">
            <ImageSharp />
            Banner
          </Box>
          <ImgUploadInput
            name="banner"
            previewFor="banner"
            icon={<ImageSharp style={{ fontSize: "80px" }} />}
            change={handleChange}
            previewImage={imagesPreview.banner}
            width="100%"
            height="400px" />
        </Box>

        <Box mt={5}>
          <Box textAlign="center" component="h2" color="gray">
            <ImageSharp />
            Imagen del Frente
          </Box>
          <ImgUploadInput
            name="frontImage"
            previewFor="banner"
            icon={<ImageSharp style={{ fontSize: "80px" }} />}
            change={handleChange}
            previewImage={imagesPreview.frontImage}
            width="50%"
            height="400px" />
        </Box>
        <Box mt={15} textAlign="right">
          <Button type="submit" variant="contained" color="primary">Actualizar Tienda</Button>
        </Box>
      </form>
    </Card>
  )
}

export default UpdateStoreForm;
