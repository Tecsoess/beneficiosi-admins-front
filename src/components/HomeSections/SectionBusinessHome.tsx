import {
  Button,
  IconButton,
  Box,
  Grid,
  TextField
} from "@material-ui/core";

import partners from '../assets/images/partner.jpg';
import clients from '../assets/images/clients.jpg';

import CreateIcon from '@material-ui/icons/Create';
import CheckIcon from '@material-ui/icons/Check';

import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

type businessInfoSectionType = {
  leftSectionImage: any;
  sectionTitle: string;
  leftSectionTitle: string;
  leftSectionText: string;
  leftSectionBtnColor: string;
  leftSectionBtnText: string;
  leftSectionBtnUrl: string;

  rightSectionImage: any;
  rightSectionTitle: string;
  rightSectionText: string;
  rightSectionBtnColor: string;
  rightSectionBtnText: string;
  rightSectionBtnUrl: string;
}

type canEditbusinessInfoSectionType = {
  leftSectionImage: boolean;
  sectionTitle: boolean;
  leftSectionTitle: boolean;
  leftSectionText: boolean;
  leftSectionBtn: boolean;

  rightSectionImage: boolean;
  rightSectionTitle: boolean;
  rightSectionText: boolean;
  rightSectionBtn: boolean;
}

const SectionBusinessHome = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [{ data, loading, error }, getBusinessInfo] = useAxios({ url: "/settings/business-info" }, { useCache: false });

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateBusinessInfo] = useAxios({ url: "/settings/business-info", method: "PUT" }, { useCache: false, manual: true });

  const [imagesPreview, setImagesPreview] = useState<any>({ leftImagePreview: null, rightImagePreview: null });

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Informción" });
  }, [loading]);

  useEffect(() => {
    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
    }
  }, [updateError])

  useEffect(() => {
    if (data) {
      setBusinessSectionData({
        ...data,
        leftSectionImage: null,
        rightSectionImage: null
      });
      setImagesPreview(
        {
          leftSectionImage: `http://api.tubeneficiosi.com/${data.leftSectionImage}`,
          rightSectionImage: `http://api.tubeneficiosi.com/${data.rightSectionImage}`,
        }
      );
    }

  }, [data]);

  useEffect(() => {
    if (updateData) {
      setCustomAlert?.({ show: true, message: "La informacion ha sido actualizada exitosamente.", severity: "success" });
    }
  }, [updateData])

  const [businessSectionData, setBusinessSectionData] = useState<businessInfoSectionType>({
    leftSectionImage: null,
    sectionTitle: "",
    leftSectionTitle: "",
    leftSectionText: "",
    leftSectionBtnColor: "",
    leftSectionBtnText: "",
    leftSectionBtnUrl: "",
    rightSectionImage: null,
    rightSectionTitle: "",
    rightSectionText: "",
    rightSectionBtnColor: "",
    rightSectionBtnText: "",
    rightSectionBtnUrl: ""
  });

  const [canEdit, setCanEdit] = useState<canEditbusinessInfoSectionType>({
    leftSectionImage: false,
    sectionTitle: false,
    leftSectionTitle: false,
    leftSectionText: false,
    leftSectionBtn: false,
    rightSectionImage: false,
    rightSectionTitle: false,
    rightSectionText: false,
    rightSectionBtn: false,
  });

  const handleChange = (e: any) => {
    setBusinessSectionData({
      ...businessSectionData,
      [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
    });

    if (e.target.type === "file") {
      setImagesPreview({
        ...imagesPreview,
        [e.target.name]: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  const toggleEdit = (name: keyof canEditbusinessInfoSectionType) => {
    setCanEdit({
      ...canEdit,
      [name]: !canEdit[name]
    });
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in businessSectionData) {
      if (key === "leftSectionImage" || key === "rightSectionImage") {
        if (businessSectionData[key as keyof typeof businessSectionData]) {
          formData.append(key, businessSectionData[key as keyof typeof businessSectionData], businessSectionData[key as keyof typeof businessSectionData].name)
        }
      } else {
        formData.append(key, businessSectionData[key as keyof typeof businessSectionData])
      }
    }
    setLoading?.({ show: true, message: "Actualizando los datos" });
    await updateBusinessInfo({ data: formData });
    setLoading?.({ show: false, message: "" });
  }

  return (
    <Box bgcolor="white" p={4} mb={5}>
      <h1>
        Sección de Informacion del Negocio:
      </h1>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            {
              canEdit.sectionTitle ?
                <Box textAlign="center">
                  <TextField
                    value={businessSectionData.sectionTitle}
                    name="sectionTitle"
                    label="Titulo"
                    onChange={handleChange}></TextField>
                  <IconButton color="primary" onClick={() => { toggleEdit("sectionTitle") }}>
                    <CheckIcon></CheckIcon>
                  </IconButton>
                </Box>
                :
                <Box component="h2" textAlign="center">
                  {businessSectionData.sectionTitle}
                  <IconButton onClick={() => { toggleEdit("sectionTitle") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }
          </Grid>
          <Grid item xs={6}>
            <Box textAlign="center" display="flex" width="100%" justifyContent="center" alignItems="center">
              <img style={{ borderRadius: '100%', height: "200px", width: "200px" }} src={imagesPreview.leftSectionImage} alt="" />
              <Button style={{ height: "fit-content", marginLeft: '10px' }} color="primary">
                <label htmlFor="leftSideImage">Añadir Imagen</label>
                <input onChange={handleChange} type="file" name="leftSectionImage" id="leftSideImage" accept="images/*" hidden />
              </Button>
            </Box>
            {
              canEdit.leftSectionTitle ?
                <Box textAlign="center" my={2}>
                  <TextField
                    value={businessSectionData.leftSectionTitle}
                    name="leftSectionTitle"
                    label="Titulo"
                    onChange={handleChange}></TextField>
                  <IconButton color="primary" onClick={() => { toggleEdit("leftSectionTitle") }}>
                    <CheckIcon></CheckIcon>
                  </IconButton>
                </Box>
                :
                <Box component="h3" textAlign="center">
                  {businessSectionData.leftSectionTitle}
                  <IconButton onClick={() => { toggleEdit("leftSectionTitle") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }

            {
              canEdit.leftSectionText ?
                <Box mb={2}>
                  <Grid container>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={businessSectionData.leftSectionText}
                        name="leftSectionText"
                        label="descripción"
                        onChange={handleChange}></TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton color="primary" onClick={() => { toggleEdit("leftSectionText") }}>
                        <CheckIcon></CheckIcon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                :
                <Box component="p" display="flex" alignItems="center" textAlign="center">
                  {businessSectionData.leftSectionText}
                  <IconButton onClick={() => { toggleEdit("leftSectionText") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }

            {
              canEdit.leftSectionBtn ?
                <Grid container>
                  <Grid item xs={10}>
                    <Grid container spacing={1}>
                      <Grid md={6}>
                        <TextField
                          value={businessSectionData.leftSectionBtnText}
                          name="leftSectionBtnText"
                          label="Texto del boton"
                          onChange={handleChange}></TextField>
                      </Grid>
                      <Grid md={6}>
                        <Box display="flex" alignItems="center">
                          <Box height="40px" boxShadow="5px 5px 10px 1px rgba(0,0,0,0.2)" width="40px" mr={2} bgcolor={businessSectionData.leftSectionBtnColor} borderRadius="10px"></Box>
                          <TextField
                            value={businessSectionData.leftSectionBtnColor}
                            name="leftSectionBtnColor"
                            label="Color"
                            onChange={handleChange}></TextField>
                        </Box>
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          value={businessSectionData.leftSectionBtnUrl}
                          name="leftSectionBtnUrl"
                          label="Url"
                          onChange={handleChange}
                          fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="primary" onClick={() => { toggleEdit("leftSectionBtn") }}>
                      <CheckIcon></CheckIcon>
                    </IconButton>
                  </Grid>
                </Grid>
                :
                <Box textAlign="center" justifyContent="center" display="flex" alignItems="center">
                  <Button variant="contained" style={{ background: businessSectionData.leftSectionBtnColor, color: "white" }}>
                    {businessSectionData.leftSectionBtnText}
                  </Button>
                  <IconButton onClick={() => { toggleEdit("leftSectionBtn") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }
          </Grid>
          <Grid item xs={6}>
            <Box textAlign="center" display="flex" width="100%" justifyContent="center" alignItems="center">
              <img style={{ borderRadius: '100%', height: "200px", width: "200px" }} src={imagesPreview.rightSectionImage} alt="" />
              <Button style={{ height: "fit-content", marginLeft: '10px' }} color="primary">
                <label htmlFor="rightSideImage">Añadir Imagen</label>
                <input onChange={handleChange} type="file" name="rightSectionImage" id="rightSideImage" accept="images/*" hidden />
              </Button>
            </Box>
            {
              canEdit.rightSectionTitle ?
                <Box textAlign="center" my={2}>
                  <TextField
                    value={businessSectionData.rightSectionTitle}
                    name="rightSectionTitle"
                    label="Titulo"
                    onChange={handleChange}></TextField>
                  <IconButton color="primary" onClick={() => { toggleEdit("rightSectionTitle") }}>
                    <CheckIcon></CheckIcon>
                  </IconButton>
                </Box>
                :
                <Box component="h3" textAlign="center">
                  {businessSectionData.rightSectionTitle}
                  <IconButton onClick={() => { toggleEdit("rightSectionTitle") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }

            {
              canEdit.rightSectionText ?
                <Box mb={2}>
                  <Grid container>
                    <Grid item xs={10}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={businessSectionData.rightSectionText}
                        name="rightSectionText"
                        label="descripción"
                        onChange={handleChange}></TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton color="primary" onClick={() => { toggleEdit("rightSectionText") }}>
                        <CheckIcon></CheckIcon>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
                :
                <Box component="p" display="flex" alignItems="center" textAlign="center">
                  {businessSectionData.rightSectionText}
                  <IconButton onClick={() => { toggleEdit("rightSectionText") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }

            {
              canEdit.rightSectionBtn ?
                <Grid container>
                  <Grid item xs={10}>
                    <Grid container spacing={1}>
                      <Grid md={6}>
                        <TextField
                          value={businessSectionData.rightSectionBtnText}
                          name="rightSectionBtnText"
                          label="Texto del boton"
                          onChange={handleChange} />
                      </Grid>
                      <Grid md={6}>
                        <Box display="flex" alignItems="center">
                          <Box height="40px" width="40px" boxShadow="5px 5px 10px 1px rgba(0,0,0,0.2)" mr={2} bgcolor={businessSectionData.rightSectionBtnColor} borderRadius="10px"></Box>
                          <TextField
                            value={businessSectionData.rightSectionBtnColor}
                            name="rightSectionBtnColor"
                            label="Color"
                            onChange={handleChange} />
                        </Box>
                      </Grid>
                      <Grid xs={12}>
                        <TextField
                          value={businessSectionData.rightSectionBtnUrl}
                          name="rightSectionBtnUrl"
                          label="Url"
                          onChange={handleChange}
                          fullWidth />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton color="primary" onClick={() => { toggleEdit("rightSectionBtn") }}>
                      <CheckIcon></CheckIcon>
                    </IconButton>
                  </Grid>
                </Grid>
                :
                <Box textAlign="center" justifyContent="center" display="flex" alignItems="center">
                  <Button variant="contained" style={{ background: businessSectionData.rightSectionBtnColor, color: "white" }}>
                    {businessSectionData.rightSectionBtnText}
                  </Button>
                  <IconButton onClick={() => { toggleEdit("rightSectionBtn") }}>
                    <CreateIcon></CreateIcon>
                  </IconButton>
                </Box>
            }
          </Grid>
        </Grid>
        <Box mt={5} textAlign="right">
          <Button type="submit" variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </form>

    </Box >
  )
}

export default SectionBusinessHome;
