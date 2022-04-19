import { Box, Button, CircularProgress, Grid, MenuItem, TextField } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { isNumber, isRequired, validate } from "../../../helpers/formsValidations";
import useAxios from "../../../hooks/useAxios";
import useCategories from "../../../hooks/useCategories";
import useTags from "../../../hooks/useTags";


type errorsFormType = {
  name: null | string;
  storeCategoryId: null | string;
}

type tagsFormDataType = {
  name: string;
  parentIds: any[];
  storeCategoryId: any;
}

const CreateTags = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [tagsFormData, setTagsFormData] = useState<tagsFormDataType>({ name: "", parentIds: [], storeCategoryId: "" });

  const [errorsForm, setErrorsForm] = useState<errorsFormType>({ name: null, storeCategoryId: null });

  const [{ categories, error: categoriesError }, getCategories] = useCategories({ options: { manual: true } });

  const [{ tags, error: tagsError, loading: tagsLoading }, getTags] = useTags({ options: { manual: true, useCache: false } });

  const [{ data, loading, error }, createTag] = useAxios({ url: "/tags", method: "POST" }, { manual: true, useCache: false });


  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando datos" });
    Promise.all([getCategories()]).then((values) => {
      setLoading?.({ show: false, message: "" });
    })
  }, []);

  useEffect(() => {
    setTagsFormData((oldTagData) => {
      return {
        ...oldTagData,
        parentIds: []
      }
    })

    getTags({
      params: {
        storeCategoryIds: tagsFormData.storeCategoryId,
        perPage: 200
      }
    })
  }, [tagsFormData.storeCategoryId])

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: "Se ha guardado la etiqueta exitosamente.", severity: "success" });
      setTagsFormData({ name: "", parentIds: [], storeCategoryId: "" });
    }
  }, [data])

  useEffect(() => {
    if (tagsError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${tagsError?.response?.status === 400 ? tagsError?.response?.data.message[0] : tagsError?.response?.data.message}.`, severity: "error" });
    }

    if (categoriesError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${categoriesError?.response?.status === 400 ? categoriesError?.response?.data.message[0] : categoriesError?.response?.data.message}.`, severity: "error" });
    }

    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }
  }, [tagsError, categoriesError, error]);

  useEffect(() => {
    setErrorsForm({
      name: validate(tagsFormData.name, [
        { validator: isRequired, errorMessage: "el nombre no puede estar vacio." },
      ]),
      storeCategoryId: validate(tagsFormData.storeCategoryId, [
        { validator: isRequired, errorMessage: "La categoria es obligatoria." },
        { validator: isNumber, errorMessage: "tiene que ser un numero." }
      ]),
    })
  }, [tagsFormData])


  const handleChange = (e: any) => {
    setTagsFormData({
      ...tagsFormData,
      [e.target.name]: e.target.value
    });
  }

  const handleAutoCompleteChange = (e: any, values: any) => {
    setTagsFormData({
      ...tagsFormData,
      parentIds: values
    })
  }

  const handleChangeTags = (e: any) => {
    getTags({
      params: {
        storeCategoryIds: tagsFormData.storeCategoryId,
        perPage: 200,
        name: e.target.value
      }
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    setLoading?.({ show: true, message: "Creando Etiqueta" });

    await createTag({ data: { ...tagsFormData, parentIds: tagsFormData.parentIds.map(values => values.id) } });

    setLoading?.({ show: false, message: "" });
  }

  const handleOptionSelected = (option: any, value: any): boolean => {
    if (value.id === option.id) {
      return true
    }
    return false
  }
  return (
    <Box>
      <Box component="h1" color="gray">
        Crear Etiqueta
      </Box>

      <Box bgcolor="white" borderRadius="5px" p={5}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={handleChange}
                helperText={errorsForm.name ? <Box component="span" color="red">{errorsForm.name}</Box> : null}
                error={errorsForm.name ? true : false}
                value={tagsFormData.name}
                name="name"
                fullWidth
                label="Nombre"
                variant="outlined" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                disabled={!categories || categories.length < 1 ? true : false}
                onChange={handleChange}
                helperText={errorsForm.storeCategoryId ? <Box component="span">{errorsForm.storeCategoryId}</Box> : null}
                error={errorsForm.storeCategoryId ? true : false}
                value={tagsFormData.storeCategoryId}
                name="storeCategoryId"
                fullWidth
                label="Categoria"
                variant="outlined"
                style={{ textTransform: "capitalize" }}
                select>
                {
                  categories?.map((category, i) => {
                    return (
                      <MenuItem style={{ textTransform: "capitalize" }} value={category.id} key={i}>
                        {category.name}
                      </MenuItem>
                    )
                  })
                }
              </TextField>
            </Grid>
            <Grid item xs={12}>
              {
                tagsLoading &&
                <Box display="flex" alignItems="center" mb={1}>
                  <CircularProgress />
                  <p>Obteniendo etiquetas</p>
                </Box>

              }
              <Autocomplete
                multiple
                id="parent-tags"
                options={tags}
                getOptionLabel={(option) => option.name}
                value={tagsFormData.parentIds}
                filterSelectedOptions
                getOptionSelected={handleOptionSelected}
                onChange={handleAutoCompleteChange}
                renderInput={(params) => (
                  <TextField
                    onChange={handleChangeTags}
                    {...params}
                    variant="outlined"
                    label="Etiquetas padres"
                    placeholder="Introduzca el nombre..."
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box textAlign="right" mt={5}>
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default CreateTags;
