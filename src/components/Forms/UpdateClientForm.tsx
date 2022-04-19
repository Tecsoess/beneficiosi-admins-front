import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography
} from "@material-ui/core"
import Card from "../Card";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useAuth } from "../../contexts/AuthContext";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

type UpdateClientFormProps = {
  clientId: number
}

type errorForm = {
  email: null | string,
  name: null | string,
  phoneNumber: null | string,
}

type userProfileDataType = {
  email: string,
  name: string,
  phoneNumber: string,
  image: any,
  userStatusCode: string;
}

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: '50%',
    boxShadow: theme.shadows[3]
  },

  marginB: {
    marginBottom: theme.spacing(3),
  },
  shortInfo: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
}));

const UpdateClientForm = ({ clientId }: UpdateClientFormProps) => {

  const classes = useStyles();

  const { setLoading, setCustomAlert } = useAuth();

  const [{ data, loading, error }, , getClient] = useAxios({ url: `clients/${clientId}` }, { useCache: false });

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateClient] = useAxios({ url: `clients/${clientId}`, method: "PUT" }, { useCache: false, manual: true });

  const [profileImage, setProfileImage] = useState<any>(null);

  const [userProfileData, setUserProfileData] = useState<userProfileDataType>({
    email: "",
    name: "",
    phoneNumber: "",
    image: null,
    userStatusCode: ""
  });

  const [errorsForm, setErrorsForm] = useState<errorForm>({
    email: null,
    name: null,
    phoneNumber: null,
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setUserProfileData({
        name: data.name,
        email: data.email,
        image: null,
        phoneNumber: data.phoneNumber,
        userStatusCode: data.userStatus.code
      });
      if (data.imgPath) {
        setProfileImage(`${process.env.REACT_APP_API_URL}/${data.imgPath}`);
      }
    }
    console.log(data)
  }, [data]);

  useEffect(() => {
    if (updateData) {
      setCustomAlert?.({ show: true, message: "Los datos han sido actualizados exitosamente.", severity: "success" });
    }
  }, [updateData])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError?.response?.status === 400 ? updateError?.response?.data.message[0] : updateError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, updateError]);

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo usuario" });
  }, [loading]);


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    for (let errors in errorsForm) {
      if (errorsForm[errors as keyof typeof errorsForm] != null) {
        alert("Hay un error en el campo: " + errors);
        return;
      }
    }

    const formData = new FormData();

    for (let key in userProfileData) {
      if (key === "image") {
        if (userProfileData[key as keyof typeof userProfileData]) {
          formData.append(key, userProfileData[key as keyof typeof userProfileData], userProfileData[key as keyof typeof userProfileData].name)
        }
      } else {
        formData.append(key, userProfileData[key as keyof typeof userProfileData])
      }
    }

    setLoading?.({ show: true, message: "Actualizando usuario" });

    await updateClient({ data: formData });

    setLoading?.({ show: false, message: "" });

  }

  const handleChange = (e: any) => {
    setUserProfileData({
      ...userProfileData,
      [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
    });

    if (e.target.type === "file") {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  }

  return (
    <Card
      title={userProfileData.name}
      titleColor="primary"
      className={classes.marginB}
    >
      <Grid container className={classes.marginB} spacing={3}>
        <Grid item xs={12} md={6} container justify="center" alignItems="center">
          <label htmlFor="image" style={{ cursor: "pointer" }}>
            {
              profileImage ?
                <img
                  src={profileImage}
                  alt={userProfileData.name}
                  className={classes.avatar}
                />
                :
                <AccountCircleIcon className={classes.avatar} color="primary" />
            }
          </label>
          <input onChange={handleChange} type="file" name="image" id="image" accept="images/*" hidden />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.shortInfo}>
            <Typography variant="h5">
              Total gastado en la aplicación
            </Typography>

            <Box
              textAlign='right'
              fontSize='2.6rem'
              fontWeight="500"
              borderBottom="1px solid gray">
              $ 100
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box borderBottom="1px solid gray">
                  <p style={{ marginBottom: 0 }}>Fecha de creación</p>
                  <p style={{ marginBottom: 0 }}>12/06/2021</p>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box borderBottom="1px solid gray">
                  <Box component="p">
                    Estado
                  </Box>
                  <Box m={0} component="p">
                    {userProfileData.userStatusCode === "urs-001" ? 'Activo' : 'Inactivo'}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              error={errorsForm.name ? true : false}
              helperText={errorsForm.name ? <Box component="p" color="red">{errorsForm.name}</Box> : null}
              name="name"
              onChange={handleChange}
              value={userProfileData.name}
              label="Nombre y Apellido"
              variant="outlined"
              size="small"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={errorsForm.email ? true : false}
              helperText={errorsForm.email ? <Box component="p" color="red">{errorsForm.email}</Box> : null}
              name="email"
              onChange={handleChange}
              value={userProfileData.email}
              label="Correo electrónico"
              variant="outlined"
              size="small"
              fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              error={errorsForm.phoneNumber ? true : false}
              helperText={errorsForm.phoneNumber ? <Box component="p" color="red">{errorsForm.phoneNumber}</Box> : null}
              name="phoneNumber"
              onChange={handleChange}
              value={userProfileData.phoneNumber}
              label="Teléfono"
              variant="outlined"
              size="small"
              fullWidth />
          </Grid>
        </Grid>
        <Box mt={5} textAlign="right">
          <Button type="submit" variant="contained" color="primary">Actualizar Usuario</Button>
        </Box>
      </form>
    </Card>
  )
}

export default UpdateClientForm;
