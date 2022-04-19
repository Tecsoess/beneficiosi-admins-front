import {
  Button,
  TextField,
  Box,
  Grid
} from "@material-ui/core";

import SettingsIcon from '@material-ui/icons/Settings';
import { useEffect } from "react";
import { useState } from "react";

import { useAuth } from "../../contexts/AuthContext";
import { isRequired, validate } from "../../helpers/formsValidations";
import useAxios from "../../hooks/useAxios";


type errorForm = {
  name: null | string;
  description: null | string;
  copyRightText: null | string;
  logo?: null | string;
}

type formDataPageInfo = {
  logo: any;
  name: string;
  description: string;
  copyRightText: string;
  commissionForSale: number;
}



const PageInfo = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [
    {
      data: getPageInfoData,
      error: getPageInfoError,
      loading: getPageInfoLoading
    },
    getPageInfo
  ] = useAxios({ url: 'settings/page-info' }, { useCache: false });

  const [pageInfoData, setPageInfoData] = useState<formDataPageInfo>({ logo: null, name: "", description: "", copyRightText: "", commissionForSale: 0 });



  const [errorsForm, setErrorsForm] = useState<errorForm>({ logo: null, name: null, description: null, copyRightText: null });

  const [{ data, error }, updatePageInfo] = useAxios({ method: "PUT", url: 'settings/page-info' }, { manual: true });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    const formData = new FormData();

    if (pageInfoData.logo) {
      formData.append("logo", pageInfoData.logo, pageInfoData.logo.name);
    }
    formData.append("name", pageInfoData.name);
    formData.append("description", pageInfoData.description);
    formData.append("copyrightText", pageInfoData.copyRightText);
    formData.append("commissionForSale", pageInfoData.commissionForSale.toString());

    setLoading?.({ show: true, message: "Actualizando Información" });
    await updatePageInfo({ data: formData });
    setLoading?.({ show: false, message: "" });
  }

  useEffect(() => {
    if (getPageInfoData) {
      setPageInfoData({
        name: getPageInfoData.name,
        description: getPageInfoData.description,
        copyRightText: getPageInfoData.copyrightText,
        commissionForSale: getPageInfoData.commissionForSale,
        logo: null
      });
    }
  }, [getPageInfoData])

  useEffect(() => {
    setErrorsForm({
      name: validate(pageInfoData.name, [
        { validator: isRequired, errorMessage: "el nombre es Obligatorio." },
      ]),
      description: validate(pageInfoData.description, [
        { validator: isRequired, errorMessage: "la descripcion es Obligatoria." }
      ]),
      copyRightText: validate(pageInfoData.copyRightText, [
        { validator: isRequired, errorMessage: "el texto de CopyRight es obligatorio." }
      ]),
    })
  }, [pageInfoData])

  useEffect(() => {
    setLoading?.({ show: getPageInfoLoading, message: "Obteniendo Información" })
  }, [getPageInfoLoading]);

  useEffect(() => {
    if (error) {
      console.log(error.response?.data);
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
    }
  }, [error])

  useEffect(() => {
    if (getPageInfoError) {
      console.log(getPageInfoError.response?.data);
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${getPageInfoError.response?.status === 400 ? getPageInfoError.response?.data.message[0] : getPageInfoError.response?.data.message}.`, severity: "error" });
    }
  }, [getPageInfoError])

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: "Los datos han sido actualizados exitosamente.", severity: "success" });
    }
  }, [data])

  const handleChange = (e: any) => {
    setPageInfoData({
      ...pageInfoData,
      [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
    });
  }

  return (
    <div>

      <Box component="h1" display="flex" alignItems="center" mb={4} color="gray">
        <SettingsIcon style={{ fontSize: '40px' }} />
        Información de la pagina
      </Box>

      <Box bgcolor="white" mb={10} p={4}>
        <form onSubmit={handleSubmit}>
          <Grid container>
            <Grid item xs={6}>
              <Grid container alignItems="center">
                <Grid style={{ marginBottom: '10px' }} xs={12}>
                  <Box component="h2" m={0}>
                    Logo de la Pagina
                  </Box>
                </Grid>
                <Grid item alignItems="center">
                  <Box display="flex" alignItems="center">
                    {pageInfoData.logo ?
                      <img style={{ width: '100px', height: "100px", borderRadius: "10%", marginRight: '20px' }} src={URL.createObjectURL(pageInfoData.logo)} alt="" />
                      :
                      getPageInfoData ?
                        <img style={{ width: '100px', height: "100px", borderRadius: "10%", marginRight: '20px' }} src={"http://api.tubeneficiosi.com/" + getPageInfoData.logo} alt="" />
                        :
                        <Box width='100px' height="100px" display="flex" border="1px dashed gray" borderRadius="10px">
                          <p>No hay imagen de logo :(</p>
                        </Box>
                    }

                    <Button variant="contained" size="small" color="primary">
                      <label htmlFor="logo">Añadir Imagen</label>
                      <input onChange={handleChange} type="file" name="logo" id="logo" accept="images/*" hidden />
                    </Button>
                  </Box>
                  {
                    errorsForm.logo ?
                      <Box component="p" color="red">
                        {errorsForm.logo}
                      </Box>
                      :
                      null
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Nombre de la pagina"
                error={errorsForm.name ? true : false}
                helperText={errorsForm.name ? <Box component="p" color="red">{errorsForm.name}</Box> : null}
                value={pageInfoData.name}
                onChange={handleChange}
                name="name"
                fullWidth
                variant="outlined"
                size="small"></TextField>
            </Grid>
          </Grid>

          <Box mt={10} mb={10}>
            <TextField
              error={errorsForm.description ? true : false}
              helperText={errorsForm.description ? <Box component="p" color="red">{errorsForm.description}</Box> : null}
              label="Descripcion de la pagina"
              value={pageInfoData.description}
              onChange={handleChange}
              name="description"
              rows={6}
              fullWidth
              multiline
              variant="outlined"
              size="small"></TextField>
          </Box>

          <Grid container spacing={5}>
            <Grid item xs={6}>

              <TextField
                label="Texto copyright"
                error={errorsForm.copyRightText ? true : false}
                helperText={errorsForm.copyRightText ? <Box component="p" color="red">{errorsForm.copyRightText}</Box> : null}
                value={pageInfoData.copyRightText}
                onChange={handleChange}
                name="copyRightText"
                fullWidth
                variant="outlined"
                size="small"></TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Comision por venta"
                value={pageInfoData.commissionForSale}
                onChange={handleChange}
                name="commissionForSale"
                fullWidth
                variant="outlined"
                size="small"
                type="number"></TextField>
            </Grid>
          </Grid>

          <Box mt={5} textAlign="right">
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  )
}

export default PageInfo;
