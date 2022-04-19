import {
  Button,
  TextField,
  Box,
  Grid
} from "@material-ui/core";

import { useHistory, useParams } from "react-router-dom";

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ImgUploadInput from "../../components/ImgUploadInput";
import { isRequired, validate } from "../../helpers/formsValidations";
import useAxios from "../../hooks/useAxios";
import { ImageSharp } from "@material-ui/icons";


const HelpCategoriesEdit = () => {

  const params = useParams<any>();

  const [{ data: helpCategory, error, loading }, getHelpCategory] = useAxios({ url: `/help-categories/${params?.id}` }, { useCache: false });

  const { setLoading, setCustomAlert } = useAuth();

  const history = useHistory();

  const [previewImage, setPreviewImage] = useState("");

  const [helpCategoriesFormData, setHelpCategoriesFormData] = useState<{ name: string; icon: any }>({ name: '', icon: null });

  const [errorsForm, setErrorsForm] = useState<{ name: null | string }>({ name: null });

  const [{ data, error: updateError, loading: updateLoading }, updateHelpCategory] = useAxios({ method: "PUT", url: `/help-categories/${params?.id}` }, { manual: true });

  useEffect(() => {
    if (helpCategory) {
      console.log(helpCategory);
      const { icon, ...rest } = helpCategory;
      setHelpCategoriesFormData((oldCategoryHelp) => {
        return {
          ...oldCategoryHelp,
          ...rest
        }
      });
      setPreviewImage(`${process.env.REACT_APP_API_URL}/${icon}`);
    }
  }, [helpCategory])

  useEffect(() => {
    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
    }

    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }
  }, [updateError, error]);


  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: "Se ha actializado exitosamente la categoria de ayuda", severity: "success" });
      setHelpCategoriesFormData({ name: '', icon: null });
      history.push("/helps-management/helps-categories");
    }
  }, [data]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Información" });
  }, [loading]);

  useEffect(() => {
    setLoading?.({ show: updateLoading, message: "Actualizando Información" });
  }, [loading]);

  const handleChange = (e: any) => {
    setHelpCategoriesFormData((oldHelpCategoryData) => {
      return {
        ...oldHelpCategoryData,
        [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
      }
    })
  }

  useEffect(() => {
    setErrorsForm({
      name: validate(helpCategoriesFormData.name, [
        { validator: isRequired, errorMessage: "el nombre no puede estar vacio" },
      ])
    })
  }, [helpCategoriesFormData])


  const handleSubmit = (e: any) => {
    e.preventDefault();
    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    const formData = new FormData();

    formData.append("name", helpCategoriesFormData.name);
    if (helpCategoriesFormData.icon) {
      formData.append("icon", helpCategoriesFormData.icon, helpCategoriesFormData.icon.name);
    }

    updateHelpCategory({ data: formData });

  }

  return (
    <Box>
      <Box mb={4} component="h1" color="gray">
        <HelpOutlineIcon />
        Editar Categoria de Ayuda
      </Box>

      <Box bgcolor="white" p={5}>
        <form onSubmit={handleSubmit}>
          <Box mb={5}>
            <Grid container spacing={10}>
              <Grid item md={6}>
                <TextField
                  error={errorsForm.name ? true : false}
                  helperText={<Box component="p">{errorsForm.name}</Box>}
                  onChange={handleChange}
                  value={helpCategoriesFormData.name}
                  fullWidth
                  variant="outlined"
                  label="Nombre"
                  name="name" />
              </Grid>
              <Grid item md={6}>
                <ImgUploadInput
                  previewImage={previewImage}
                  width="60%"
                  icon={<ImageSharp style={{ fontSize: "80px" }} />}
                  height="300px"
                  previewFor="icon"
                  name="icon"
                  description="Cargue una imagen para el icono." change={handleChange} />
              </Grid>
            </Grid>
          </Box>


          <Box textAlign="right">
            <Button type="submit" variant="contained" color="primary">
              Guardar Cambios
            </Button>
          </Box>
        </form>
      </Box>
    </Box >
  )
}

export default HelpCategoriesEdit;
