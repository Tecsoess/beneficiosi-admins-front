import { Button, Box, TextField, Grid } from "@material-ui/core";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../hooks/useAxios";

import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import SubjectOutlinedIcon from '@material-ui/icons/SubjectOutlined';
import LinkOutlinedIcon from '@material-ui/icons/LinkOutlined';


import SelectWidgetType, { SelectWidgetValuesType } from "../../components/widgets/SelectWidgetType";
import WidgetFormModal from "../../components/widgets/WidgetFormModal";

type footerSectionType = {
  id: number | null,
  isActive: boolean,
  name: string,
  widgets: any[]
}

const widgetsTypes: SelectWidgetValuesType[] = [
  {
    icon: <ImageOutlinedIcon />,
    value: "image",
    text: "Imagen"
  },
  {
    icon: <SubjectOutlinedIcon />,
    value: "text",
    text: "Texto"
  },
  {
    icon: <LinkOutlinedIcon />,
    value: "url",
    text: "Enlace"
  },
  {
    icon: <FacebookIcon />,
    value: "socials",
    text: "Redes Sociales"
  }
]

const FooterEdit = () => {

  const params = useParams<any>();

  const { setLoading, setCustomAlert } = useAuth();

  const [show, setShow] = useState(false);

  const [newWidgetType, setNewWidgetType] = useState<any>(null);

  const [{ data, error, loading }, getFooterSection] = useAxios({ url: `/settings/footer-sections/${params.id}` }, { useCache: false });

  const [{ data: updateData, error: updateError, loading: updateLoading }, updateFooterSection] = useAxios({ url: `/settings/footer-sections/${params.id}/widgets`, method: 'POST' }, { useCache: false, manual: true });
  const [{ data: updateNameData, error: updateNameError, loading: updateNameLoading }, updateFooterSectionName] = useAxios({ url: `/settings/footer-sections/${params.id}`, method: 'PUT' }, { useCache: false, manual: true });

  const [{ data: deleteData, error: deleteError }, deleteFooterSection] = useAxios({ method: 'DELETE' }, { useCache: false, manual: true });

  const [footerSectionData, setFooterSectionData] = useState<footerSectionType>({ id: null, isActive: false, name: "", widgets: [] })

  useEffect(() => {
    if (updateData) {
      setFooterSectionData(updateData);
      setLoading?.({ show: false, message: '' });
      setCustomAlert?.({ show: true, message: `Se ha actualizado exitosamente`, severity: "success" });
    }
    if (deleteData) {
      setFooterSectionData(deleteData);
      setLoading?.({ show: false, message: '' });
      setCustomAlert?.({ show: true, message: `Se ha actualizado exitosamente`, severity: "success" });
    }

    if (updateNameData) {
      setLoading?.({ show: false, message: '' });
      setCustomAlert?.({ show: true, message: `Se ha actualizado exitosamente`, severity: "success" });
    }
  }, [updateData, deleteData, updateNameData])

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo información" });
  }, [loading]);

  useEffect(() => {
    if (updateLoading) {
      setNewWidgetType(null);
    }
  }, [updateLoading])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: '' })
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
    }

    if (updateError) {
      setLoading?.({ show: false, message: '' })
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError.response?.status === 400 ? updateError.response?.data.message[0] : updateError.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: '' })
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError.response?.status === 400 ? deleteError.response?.data.message[0] : deleteError.response?.data.message}.`, severity: "error" });
    }

    if (updateNameError) {
      setLoading?.({ show: false, message: '' })
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateNameError.response?.status === 400 ? updateNameError.response?.data.message[0] : updateNameError.response?.data.message}.`, severity: "error" });
    }
  }, [error, updateError, deleteError, updateNameError])


  useEffect(() => {
    if (data) {
      setFooterSectionData(data);
    }
  }, [data]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading?.({ show: true, message: 'Actualizando' });
    await updateFooterSectionName({ data: { name: footerSectionData.name } });
    setLoading?.({ show: false, message: '' });

  }

  const handleChange = (e: any) => {
    setFooterSectionData({
      ...footerSectionData,
      [e.target.name]: e.target.value
    })
  }

  const handleClose = (e: any) => {
    setNewWidgetType(e);
    setShow(false);
  }

  const handleWidgetFormClose = async (e: any) => {
    if (e) {
      setLoading?.({ show: true, message: 'Actualizando' });
      await updateFooterSection({ data: e });
      setLoading?.({ show: false, message: '' });
    }
  }

  const handleDelete = async (i: number) => {
    setLoading?.({ show: true, message: 'Eliminando' });
    await deleteFooterSection({ url: `/settings/footer-sections/${params?.id}/widgets/${i}` });
    setLoading?.({ show: false, message: '' });
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Box mb={4} component="h1" color="gray">
          {footerSectionData.name}
        </Box>

        <Box bgcolor="white" p={5}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <TextField name="name" value={footerSectionData.name} onChange={handleChange} fullWidth variant="outlined" label="Titulo"></TextField>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                Actualizar Nombre
              </Button>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={8}>
              <Box component="h3" mb={5}>
                Widgets:
              </Box>
              {footerSectionData.widgets.map((widget: any, i: number) => {
                return (
                  <Box key={i} mb={5}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Button variant="contained">
                          {widget.type}
                        </Button>
                      </Grid>
                      <Grid item xs={3}>
                        <Button onClick={() => { handleDelete(i) }} startIcon={< DeleteIcon />} color="primary" variant="contained">
                          Eliminar
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )
              })}
              <Box>
                <Button onClick={() => { setShow(!show) }} variant="contained" color="primary">
                  Agregar Widget
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box component="h3">
                Preview:
              </Box>

              <Box bgcolor="#262626" p={3}>
                <Box component="h3" color="white">
                  {footerSectionData.name}
                </Box>
                {
                  footerSectionData.widgets.map((widget, i: number) => {
                    switch (widget.type) {
                      case 'url':
                        return (
                          <Box key={i} color="white">
                            <a style={{ color: "white" }} target="_blank" rel="noreferrer" href={widget.url}>{widget.value}</a>
                          </Box>
                        )
                      case 'text':
                        return (
                          <Box key={i} color="white" component="p">
                            {widget.value}
                          </Box>
                        )
                      case 'image':
                        return (
                          <Box key={i} textAlign="center" my={2}>
                            {
                              widget?.isNew ?
                                <img style={{ maxWidth: "100%" }} src={URL.createObjectURL(widget?.image)} alt="" />
                                :
                                <img style={{ maxWidth: "100%" }} src={process.env.REACT_APP_API_URL + "/" + widget?.image} alt="" />
                            }
                          </Box>
                        )

                      case 'socials':
                        return (
                          <Box key={i} color="white">
                            {
                              widget.facebook ?
                                <a href={widget.facebook} target="_blank">
                                  <FacebookIcon />
                                </a>
                                :
                                null
                            }
                            {
                              widget.instagram ?
                                <a href={widget.instagram} target="_blank">
                                  <InstagramIcon />
                                </a>
                                :
                                null
                            }
                            {
                              widget.twitter ?
                                <a href={widget.twitter} target="_blank">
                                  <TwitterIcon />
                                </a>
                                :
                                null
                            }
                            {
                              widget.youtube ?
                                <a href={widget.youtube} target="_blank">
                                  <YouTubeIcon />
                                </a>
                                :
                                null
                            }
                          </Box>
                        )
                    }
                  })
                }
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
      <WidgetFormModal forWidget={newWidgetType} onClose={handleWidgetFormClose} />
      <SelectWidgetType title="Seleccione el tipo de widget" values={widgetsTypes} open={show} onClose={handleClose} />
    </Box>
  )
}

export default FooterEdit;
