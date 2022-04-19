import {
  Button,
  TextField,
  Box,
  Grid
} from "@material-ui/core";

import { useHistory } from "react-router-dom";

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ImgUploadInput from "../../components/ImgUploadInput";
import { isRequired, validate } from "../../helpers/formsValidations";
import useAxios from "../../hooks/useAxios";
import { ImageSharp } from "@material-ui/icons";


const HelpCategoriesCreate = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const history = useHistory();

  const [helpCategoriesFormData, setHelpCategoriesFormData] = useState<{ title: string; icon: any }>({ title: '', icon: null });

  const [errorsForm, setErrorsForm] = useState<{ title: null | string, icon: null | string }>({ title: null, icon: null });

  const [{ data, error, loading }, createHelpCategory] = useAxios({ method: "POST", url: 'help-categories' }, { manual: true });

  useEffect(() => {
    console.log(error);
  }, [error])

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: "Se ha creado exitosamente la categoria de ayuda", severity: "success" });
      setHelpCategoriesFormData({ title: '', icon: null });
      history.push("/helps-management/helps-categories");
    }
  }, [data]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Creando ayuda por favor espere" });
  }, [loading])

  const handleChange = (e: any) => {
    setHelpCategoriesFormData((oldHelpCategoryData) => {
      return {
        ...oldHelpCategoryData,
        [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
      }
    })
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    const formData = new FormData();

    formData.append("name", helpCategoriesFormData.title);
    formData.append("icon", helpCategoriesFormData.icon, helpCategoriesFormData.icon.name);

    createHelpCategory({ data: formData });

  }

  useEffect(() => {
    setErrorsForm({
      title: validate(helpCategoriesFormData.title, [
        { validator: isRequired, errorMessage: "el titulo no puede estar vacio" },
      ]),
      icon: validate(helpCategoriesFormData.icon, [
        { validator: isRequired, errorMessage: "el icono es obligatorio." }
      ]),
    })
  }, [helpCategoriesFormData])

  return (
    <Box>
      <Box mb={4} component="h1" color="gray">
        <HelpOutlineIcon />
        Crear Categoria de Ayuda
      </Box>

      <Box bgcolor="white" p={5}>
        <form onSubmit={handleSubmit}>
          <Box mb={5}>
            <Grid container spacing={10}>
              <Grid item md={6}>
                <TextField error={errorsForm.title ? true : false} helperText={<Box component="p">{errorsForm.title}</Box>} onChange={handleChange} fullWidth variant="outlined" label="Titulo" name="title"></TextField>
              </Grid>
              <Grid item md={6}>
                {
                  errorsForm.icon ?
                    <Box textAlign="center" color="red" mb={2}>
                      {errorsForm.icon}
                    </Box>
                    :
                    null
                }
                <ImgUploadInput
                  width="60%"
                  icon={<ImageSharp style={{ fontSize: "80px" }} />}
                  height="300px"
                  previewFor="icon"
                  name="icon"
                  description="Cargue una imagen para el icono." change={handleChange} />
              </Grid>
            </Grid>
          </Box>

          <Box textAlign="right" mt={10}>
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default HelpCategoriesCreate;
