import { Box, Button, Grid, MenuItem, TextField } from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useHelpsCategories from "../../hooks/useHelpCategories";
import HelpsEditor from '../../components/HelpsEditor';
import { isNumber, isRequired, validate } from "../../helpers/formsValidations";
import useAxios from "../../hooks/useAxios";
import { useHistory, useParams } from "react-router-dom";

const HelpsEdit = () => {

  const params = useParams<any>();

  const [{ data: help, error }, getHelp] = useAxios({ url: `/helps/${params?.id}` }, { useCache: false, manual: true });

  const [{ error: errorHelpsCategories, helpsCategories }, getHelpsCategories] = useHelpsCategories({ options: { useCache: false, manual: true } });

  const history = useHistory();

  const [{ data, error: updateHelpError, loading: updateHelpLoading }, updateHelp] = useAxios({ method: "PUT", url: `/helps/${params?.id}` }, { manual: true });

  const { setLoading, setCustomAlert } = useAuth();

  const [helpsData, setHelpsData] = useState({ title: '', helpCategoryId: null, description: '' });

  const [errorsForm, setErrorsForm] = useState<{ title: null | string, helpCategoryId: null | string, description: null | string }>({ title: null, helpCategoryId: null, description: null });

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando datos" });
    Promise.all([getHelpsCategories(), getHelp()]).then((values) => {
      setLoading?.({ show: false, message: "" });
    })
  }, []);

  useEffect(() => {
    if (help) {
      console.log(help);
      setHelpsData({
        title: help.title,
        description: help.description,
        helpCategoryId: help.helpCategory.id
      });
    }
  }, [help])

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: "Se ha actualizado exitosamente la ayuda", severity: "success" });
      setHelpsData({ title: '', helpCategoryId: null, description: '' });
      history.push("/helps-management/helps");
    }
  }, [data]);

  useEffect(() => {
    setErrorsForm({
      title: validate(helpsData.title, [
        { validator: isRequired, errorMessage: "el titulo no puede estar vacio" },
      ]),
      helpCategoryId: validate(helpsData.helpCategoryId, [
        { validator: isRequired, errorMessage: "La categoria es obligatoria." },
        { validator: isNumber, errorMessage: "tiene que ser un numero." }
      ]),
      description: validate(helpsData.description, [
        { validator: isRequired, errorMessage: "La descripcion es obligatoria." }
      ])
    })
  }, [helpsData])

  const onHelpEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setHelpsData((oldHelpData) => {
      return {
        ...oldHelpData,
        description: data
      }
    })
  }

  const handleChange = (e: any) => {
    setHelpsData((oldHelpData) => {
      return {
        ...oldHelpData,
        [e.target.name]: e.target.value
      }
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
    setLoading?.({ show: true, message: "Actualizando Ayuda" });
    await updateHelp({ data: helpsData });
    setLoading?.({ show: false, message: "" });
  }

  return (
    <Box>
      <Box mb={5} component="h1" display="flex" color="gray">
        <HelpOutlineIcon />
        Editar Ayuda
      </Box>

      <Box bgcolor="white" p={5}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item md={6}>
              <TextField
                error={errorsForm.title ? true : false}
                helperText={<Box component="p">{errorsForm.title}</Box>}
                onChange={handleChange}
                value={helpsData.title}
                variant="outlined"
                label="Titulo"
                fullWidth
                name="title" />
            </Grid>
            <Grid item md={6}>
              <TextField
                error={errorsForm.helpCategoryId ? true : false} helperText={<Box component="p">{errorsForm.helpCategoryId}</Box>}
                onChange={handleChange}
                variant="outlined"
                value={helpsData.helpCategoryId}
                label="Topico"
                disabled={helpsCategories.length > 0 ? false : true}
                fullWidth
                name="helpCategoryId"
                select>
                {
                  helpsCategories.length > 0 ?
                    helpsCategories.map((helpCategory, i) => {
                      return (
                        <MenuItem key={i} value={helpCategory.id}>
                          {helpCategory.name}
                        </MenuItem>
                      )
                    })
                    :
                    null
                }
              </TextField>
            </Grid>
          </Grid>

          <Box>
            <HelpsEditor
              onReady={() => { }}
              onChange={onHelpEditorChange}
              onBlur={null}
              onFocus={null}
              data={helpsData.description}
              title="Descripción"
            />
            {
              errorsForm.description ?
                <Box component="p" color="red">{errorsForm.description}</Box>
                :
                null
            }
          </Box>

          <Box textAlign="right" mt={5}>
            <Button type="submit" variant="contained" color="primary">
              Guardar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default HelpsEdit;