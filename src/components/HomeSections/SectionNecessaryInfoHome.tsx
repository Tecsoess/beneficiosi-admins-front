import {
  Button,
  TextField,
  Grid,
  IconButton,
  Box
} from "@material-ui/core";

import CreateIcon from '@material-ui/icons/Create';
import CheckIcon from '@material-ui/icons/Check';

import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

type necessaryInfoHomeData = {
  leftSectionImage: any;
  leftSectionTitle: string;
  leftSectionDescription: string;

  middleSectionImage: any;
  middleSectionTitle: string;
  middleSectionDescription: string;

  rightSectionImage: any;
  rightSectionTitle: string;
  rightSectionDescription: string;
}

type canEditNecessaryInfoHomeData = {

  leftSectionTitle: boolean;
  leftSectionDescription: boolean;

  middleSectionTitle: boolean;
  middleSectionDescription: boolean;

  rightSectionTitle: boolean;
  rightSectionDescription: boolean;
}

const SectionNecessaryInfoHome = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [{ data, loading, error }, getNecessaryInfoData] = useAxios({ url: "/settings/needed-info" }, { useCache: false });

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateNecessaryInfoData] = useAxios({ url: "/settings/needed-info", method: "PUT" }, { useCache: false, manual: true });

  const [necessaryInfoData, setNecessaryInfoData] = useState<necessaryInfoHomeData>(
    {
      leftSectionImage: null,
      leftSectionTitle: "",
      leftSectionDescription: "",

      middleSectionImage: null,
      middleSectionTitle: "",
      middleSectionDescription: "",

      rightSectionImage: null,
      rightSectionTitle: "",
      rightSectionDescription: "",
    }
  )

  const [canEdit, setCanEdit] = useState<canEditNecessaryInfoHomeData>({
    leftSectionTitle: false,
    leftSectionDescription: false,
    middleSectionTitle: false,
    middleSectionDescription: false,
    rightSectionTitle: false,
    rightSectionDescription: false,
  });

  const [imagesPreview, setImagesPreview] = useState<any>({
    leftSectionImage: null,
    middleSectionImage: null,
    rightSectionImage: null
  })

  useEffect(() => {
    console.log(data);
    if (data) {
      setNecessaryInfoData({
        ...data,
        leftSectionImage: null,
        middleSectionImage: null,
        rightSectionImage: null
      });

      setImagesPreview({
        leftSectionImage: "http://api.tubeneficiosi.com/" + data.leftSectionImage,
        middleSectionImage: "http://api.tubeneficiosi.com/" + data.middleSectionImage,
        rightSectionImage: "http://api.tubeneficiosi.com/" + data.rightSectionImage
      });
    }
  }, [data]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Información" });
  }, [loading]);

  useEffect(() => {
    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
    }
  }, [updateError])

  useEffect(() => {
    if (updateData) {
      setCustomAlert?.({ show: true, message: "La informacion ha sido actualizada exitosamente.", severity: "success" });
    }
  }, [updateData])

  const handleChange = (e: any) => {
    setNecessaryInfoData({
      ...necessaryInfoData,
      [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
    });

    if (e.target.type === "file") {
      setImagesPreview({
        ...imagesPreview,
        [e.target.name]: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  const toggleEdit = (name: keyof canEditNecessaryInfoHomeData) => {
    setCanEdit({
      ...canEdit,
      [name]: !canEdit[name]
    });
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in necessaryInfoData) {
      if (key === "leftSectionImage" || key === "middleSectionImage" || key === "rightSectionImage") {
        if (necessaryInfoData[key as keyof typeof necessaryInfoData]) {
          formData.append(key, necessaryInfoData[key as keyof typeof necessaryInfoData], necessaryInfoData[key as keyof typeof necessaryInfoData].name)
        }
      } else {
        formData.append(key, necessaryInfoData[key as keyof typeof necessaryInfoData])
      }
    }
    setLoading?.({ show: true, message: "Actualizando Información" });
    await updateNecessaryInfoData({ data: formData });
    setLoading?.({ show: false, message: "" });
  }

  return (
    <Box mt={5} bgcolor="white" p={5}>
      <h1>Sección de información necesaria:</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img style={{ maxWidth: '30%' }} src={imagesPreview.leftSectionImage} alt="" />
                <Button color="primary">
                  <label htmlFor="leftSectionImage">Añadir Imagen</label>
                  <input onChange={handleChange} type="file" name="leftSectionImage" id="leftSectionImage" accept="images/*" hidden />
                </Button>
              </Box>
              {
                canEdit.leftSectionTitle ?
                  <Box textAlign="center">
                    <TextField
                      value={necessaryInfoData.leftSectionTitle}
                      name="leftSectionTitle"
                      label="Titulo"
                      onChange={handleChange}></TextField>
                    <IconButton color="primary" onClick={() => { toggleEdit("leftSectionTitle") }}>
                      <CheckIcon></CheckIcon>
                    </IconButton>
                  </Box>
                  :
                  <Box component="h2" textAlign="center">
                    {necessaryInfoData.leftSectionTitle}
                    <IconButton onClick={() => { toggleEdit("leftSectionTitle") }}>
                      <CreateIcon></CreateIcon>
                    </IconButton>
                  </Box>
              }
              {
                canEdit.leftSectionDescription ?
                  <Box mb={2}>
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <TextField
                          value={necessaryInfoData.leftSectionDescription}
                          name="leftSectionDescription"
                          label="Descripción"
                          multiline
                          fullWidth
                          rows={4}
                          onChange={handleChange}></TextField>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton color="primary" onClick={() => { toggleEdit("leftSectionDescription") }}>
                          <CheckIcon></CheckIcon>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  :
                  <Box component="p" display="flex" alignItems="center" textAlign="center">
                    {necessaryInfoData.leftSectionDescription}
                    <IconButton onClick={() => { toggleEdit("leftSectionDescription") }}>
                      <CreateIcon></CreateIcon>
                    </IconButton>
                  </Box>
              }
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img style={{ maxWidth: '30%' }} src={imagesPreview.middleSectionImage} alt="" />
                <Button color="primary">
                  <label htmlFor="middleSectionImage">Añadir Imagen</label>
                  <input onChange={handleChange} type="file" name="middleSectionImage" id="middleSectionImage" accept="images/*" hidden />
                </Button>
              </Box>
              {
                canEdit.middleSectionTitle ?
                  <Box textAlign="center">
                    <TextField
                      value={necessaryInfoData.middleSectionTitle}
                      name="middleSectionTitle"
                      label="Titulo"
                      onChange={handleChange}></TextField>
                    <IconButton color="primary" onClick={() => { toggleEdit("middleSectionTitle") }}>
                      <CheckIcon></CheckIcon>
                    </IconButton>
                  </Box>
                  :
                  <Box component="h2" textAlign="center">
                    {necessaryInfoData.middleSectionTitle}
                    <IconButton onClick={() => { toggleEdit("middleSectionTitle") }}>
                      <CreateIcon></CreateIcon>
                    </IconButton>
                  </Box>
              }
              {
                canEdit.middleSectionDescription ?
                  <Box mb={2}>
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <TextField
                          value={necessaryInfoData.middleSectionDescription}
                          name="middleSectionDescription"
                          label="Descripción"
                          multiline
                          fullWidth
                          rows={4}
                          onChange={handleChange}></TextField>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton color="primary" onClick={() => { toggleEdit("middleSectionDescription") }}>
                          <CheckIcon></CheckIcon>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  :
                  <Box component="p" display="flex" alignItems="center" textAlign="center">
                    {necessaryInfoData.middleSectionDescription}
                    <IconButton onClick={() => { toggleEdit("middleSectionDescription") }}>
                      <CreateIcon></CreateIcon>
                    </IconButton>
                  </Box>
              }
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img style={{ maxWidth: '30%' }} src={imagesPreview.rightSectionImage} alt="" />
                <Button color="primary">
                  <label htmlFor="rightSectionImage">Añadir Imagen</label>
                  <input onChange={handleChange} type="file" name="rightSectionImage" id="rightSectionImage" accept="images/*" hidden />
                </Button>
              </Box>
              {
                canEdit.rightSectionTitle ?
                  <Box textAlign="center">
                    <TextField
                      value={necessaryInfoData.rightSectionTitle}
                      name="rightSectionTitle"
                      label="Titulo"
                      onChange={handleChange}></TextField>
                    <IconButton color="primary" onClick={() => { toggleEdit("rightSectionTitle") }}>
                      <CheckIcon></CheckIcon>
                    </IconButton>
                  </Box>
                  :
                  <Box component="h2" textAlign="center">
                    {necessaryInfoData.rightSectionTitle}
                    <IconButton onClick={() => { toggleEdit("rightSectionTitle") }}>
                      <CreateIcon></CreateIcon>
                    </IconButton>
                  </Box>
              }
              {
                canEdit.rightSectionDescription ?
                  <Box mb={2}>
                    <Grid container alignItems="center">
                      <Grid item xs={10}>
                        <TextField
                          value={necessaryInfoData.rightSectionDescription}
                          name="rightSectionDescription"
                          label="Descripción"
                          multiline
                          fullWidth
                          rows={4}
                          onChange={handleChange}></TextField>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton color="primary" onClick={() => { toggleEdit("rightSectionDescription") }}>
                          <CheckIcon></CheckIcon>
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  :
                  <Box component="p" display="flex" alignItems="center" textAlign="center">
                    {necessaryInfoData.rightSectionDescription}
                    <IconButton onClick={() => { toggleEdit("rightSectionDescription") }}>
                      <CreateIcon></CreateIcon>
                    </IconButton>
                  </Box>
              }
            </Box>
          </Grid>
        </Grid>

        <Box textAlign="right" mt={5}>
          <Button type="submit" color="primary" variant="contained">
            Guardar
          </Button>
        </Box>
      </form>

    </Box>
  )
}

export default SectionNecessaryInfoHome;
