import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
} from "@material-ui/core"
import Card from "../Card";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../contexts/AuthContext";
import { isRequired, validate } from "../../helpers/formsValidations";

const useStyles = makeStyles(theme => ({
  marginB: {
    marginBottom: theme.spacing(3),
  }
}));

type UpdateClientPasswordFormProps = {
  clientId: number
}


const UpdatePasswordForm = ({ clientId }: UpdateClientPasswordFormProps) => {

  const classes = useStyles();

  const { setLoading, setCustomAlert } = useAuth();

  const [updatePasswordForm, setUpdatePasswordForm] = useState({ confirmPassword: "", password: "" });

  const [errorsForm, setErrorsForm] = useState<{ confirmPassword: null | string, password: null | string }>({ confirmPassword: null, password: null });

  const [{ data, loading, error }, updatePassword] = useAxios({ url: `/clients/${clientId}/password`, method: "PUT" }, { useCache: false, manual: true });

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }
  }, [error]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Cambiando contraseña" })
  }, [loading]);

  useEffect(() => {
    if (data) {
      setCustomAlert?.({ show: true, message: `La contraseña ha sido actualizada exitosamente.`, severity: "success" });
      setUpdatePasswordForm({ password: "", confirmPassword: "" });
    }
  }, [data]);

  useEffect(() => {
    setErrorsForm({
      confirmPassword: validate(updatePasswordForm.confirmPassword, [
        { validator: isRequired, errorMessage: "Confirme la contraseña." },
      ]),
      password: validate(updatePasswordForm.password, [
        { validator: isRequired, errorMessage: "la nueva contraseña es Obligatoria." }
      ])
    })
  }, [updatePasswordForm])


  const handleChange = (e: any) => {
    setUpdatePasswordForm({
      ...updatePasswordForm,
      [e.target.name]: e.target.value
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

    if (updatePasswordForm.password !== updatePasswordForm.confirmPassword) {
      alert("Las Contraseñas no coinciden.");
      return;
    }

    updatePassword({ data: { password: updatePasswordForm.password } });
  }


  return (
    <Card title="Cambiar contraseña de usario" titleWithBorder className={classes.marginB}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              name="password"
              value={updatePasswordForm.password}
              helperText={errorsForm.password ? <Box component="p" color="red">{errorsForm.password}</Box> : null}
              error={errorsForm.password ? true : false}
              onChange={handleChange}
              label="Nueva Contraseña"
              variant="outlined"
              size="small"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <TextField
              type="password"
              name="confirmPassword"
              value={updatePasswordForm.confirmPassword}
              helperText={errorsForm.confirmPassword ? <Box component="p" color="red">{errorsForm.confirmPassword}</Box> : null}
              error={errorsForm.confirmPassword ? true : false}
              onChange={handleChange}
              label="Confirmar contraseña"
              variant="outlined"
              size="small"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}></Grid>
        </Grid>

        <Box textAlign="right">
          <Button type="submit" variant="contained" color="primary">Guardar contraseña</Button>
        </Box>
      </form>
    </Card>
  )
}

export default UpdatePasswordForm;
