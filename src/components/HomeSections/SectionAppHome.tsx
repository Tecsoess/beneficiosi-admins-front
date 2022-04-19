import {
  Button,
  IconButton,
  Box,
  Grid,
  TextField
} from "@material-ui/core";

import smartPhone from '../assets/images/smartphone.png';
import app from '../assets/images/app-bg.jpg';
import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

type appSectionDataType = {
  title: string;
  titleColor: string;
  description: string;
  descriptionColor: string;
  backgroundColor: string;
  leftSideImage: any;
  rightSideImage: any;
}

const SectionAppHome = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [{ data, loading, error }, getAppSectionData] = useAxios({ url: "settings/app-section" }, { useCache: false });

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateAppSectionData] = useAxios({ url: "settings/app-section", method: "PUT" }, { manual: true, useCache: false });

  const [appSectionData, setAppSectionData] = useState<appSectionDataType>(
    {
      title: "",
      titleColor: "",
      description: "",
      descriptionColor: "",
      backgroundColor: "",
      leftSideImage: null,
      rightSideImage: null
    }
  )

  const [imagesPreview, setImagesPreview] = useState<any>({ leftSideImage: null, rightSideImage: null })

  const handleChange = (e: any) => {
    setAppSectionData({
      ...appSectionData,
      [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
    });

    if (e.target.type === "file") {
      setImagesPreview({
        ...imagesPreview,
        [e.target.name]: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Información" });
  }, [loading])

  useEffect(() => {
    if (data) {
      setAppSectionData(
        {
          ...data,
          leftSideImage: null,
          rightSideImage: null
        }
      )
      setImagesPreview({ leftSideImage: "http://api.tubeneficiosi.com/" + data.leftSideImage, rightSideImage: "http://api.tubeneficiosi.com/" + data.rightSideImage })
    }
  }, [data]);

  useEffect(() => {
    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
    }
  }, [updateError]);

  useEffect(() => {
    if (updateData) {
      setCustomAlert?.({ show: true, message: "La informacion ha sido actualizada exitosamente.", severity: "success" });
    }
  }, [updateData])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in appSectionData) {
      if (key === "leftSideImage" || key === "rightSideImage") {
        if (appSectionData[key as keyof typeof appSectionData]) {
          formData.append(key, appSectionData[key as keyof typeof appSectionData], appSectionData[key as keyof typeof appSectionData].name)
        }
      } else {
        formData.append(key, appSectionData[key as keyof typeof appSectionData])
      }
    }
    setLoading?.({ show: true, message: "Actualizando datos" });
    await updateAppSectionData({ data: formData });
    setLoading?.({ show: false, message: "" });
  }

  return (
    <Box bgcolor="white" p={4}>
      <h1>
        Sección de la app:
      </h1>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={7}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12}>
                <Box component="h2" margin={0}>
                  Titulo de la sección:
                </Box>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  onChange={handleChange}
                  fullWidth
                  name="title"
                  value={appSectionData.title}
                  variant="outlined"
                ></TextField>
              </Grid>
              <Grid item xs={4}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Box height='40px' width='40px' boxShadow="5px 5px 10px 1px rgba(0,0,0,0.2)" bgcolor={appSectionData.titleColor} borderRadius='5px' />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      onChange={handleChange}
                      fullWidth
                      name="titleColor"
                      value={appSectionData.titleColor}
                      variant="outlined"
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12}>
                <Box component="h2" margin={0}>
                  Descripción de la seccion:
                </Box>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  onChange={handleChange}
                  fullWidth
                  name="description"
                  value={appSectionData.description}
                  variant="outlined"></TextField>
              </Grid>
              <Grid item xs={4}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Box height='40px' width='40px' boxShadow="5px 5px 10px 1px rgba(0,0,0,0.2)" bgcolor={appSectionData.descriptionColor} borderRadius='5px' />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      onChange={handleChange}
                      fullWidth
                      name="descriptionColor"
                      value={appSectionData.descriptionColor}
                      variant="outlined"></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={8}>
                <Box component="h2">Color de fondo:</Box>
              </Grid>
              <Grid item xs={4}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <Box height='40px' boxShadow="5px 5px 10px 1px rgba(0,0,0,0.2)" width='40px' bgcolor={appSectionData.backgroundColor} borderRadius='5px' />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      onChange={handleChange}
                      value={appSectionData.backgroundColor}
                      name="backgroundColor"
                      fullWidth
                      variant="outlined"></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </Grid>
          <Grid item xs={5}>
            <Box mb={5} display="flex" alignItems="center" justifyContent="center">
              <img style={{ maxWidth: "25%" }} src={imagesPreview.leftSideImage} alt="" />
              <Button color="primary">
                <label htmlFor="leftImage">Añadir Imagen</label>
                <input onChange={handleChange} type="file" name="leftSideImage" id="leftImage" accept="images/*" hidden />
              </Button>
            </Box>

            <Box textAlign="center">
              <Box mb={1}>
                <Button color="primary">
                  <label htmlFor="rightImage">Añadir Imagen</label>
                  <input onChange={handleChange} type="file" name="rightSideImage" id="rightImage" accept="images/*" hidden />
                </Button>
              </Box>
              <img style={{ maxWidth: "60%" }} src={imagesPreview.rightSideImage} alt="" />
            </Box>
          </Grid>
        </Grid>

        <Box m={0} p={0} component="h2">Vista previa:</Box>
        <Box bgcolor={appSectionData.backgroundColor} p={4} minHeight="40vh" mt={2}>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Box textAlign="center">
                <img style={{ maxWidth: "25%" }} src={imagesPreview.leftSideImage} alt="" />
                <Box component="h1" color={appSectionData.titleColor}>{appSectionData.title}</Box>
                <Box component="p" m={0} color={appSectionData.descriptionColor}>{appSectionData.description}</Box>
              </Box>
            </Grid>
            <Grid xs={4}>
              <img style={{ maxWidth: "100%" }} src={imagesPreview.rightSideImage} alt="" />
            </Grid>
          </Grid>
        </Box>

        <Box textAlign="right" mt={5}>
          <Button type="submit" color="primary" variant="contained">
            Guardar
          </Button>
        </Box>
      </form>
    </Box >
  )
}

export default SectionAppHome;
