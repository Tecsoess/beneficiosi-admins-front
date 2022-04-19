import { Box, Button, Grid, TextField } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import useAxios from "../../hooks/useAxios";

import PersonIcon from '@material-ui/icons/Person';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import LocationOnIcon from '@material-ui/icons/LocationOn';

type adminDataType = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  image: any;
  userStatusCode: string;
}

const AdminsEdit = () => {

  const params = useParams<any>();

  const { setLoading, setCustomAlert, user, setAuthInfo } = useAuth();

  const [imagePreview, setimagePreview] = useState("");


  const [adminData, setAdminData] = useState<adminDataType>({ name: "", email: "", phoneNumber: "", address: "", isActive: false, image: null, userStatusCode: "urs-001" });

  const [{ data: updateData, loading: updateLoading, error: updateError }, updateAdmin] = useAxios({ url: `/admins/${params?.id}`, method: "PUT" }, { useCache: false, manual: true });

  const [{ data, loading, error }, getAdmin] = useAxios({ url: `/admins/${params?.id}` }, { useCache: false });

  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo datos" });
  }, [loading])

  useEffect(() => {
    if (data) {
      console.log(data);
      const { role, userStatus, imgPath, ...rest } = data;
      setAdminData({ ...rest, userStatusCode: userStatus.code });
      if (imgPath) {
        setimagePreview(`${process.env.REACT_APP_API_URL}/${imgPath}`)
      }
    }
  }, [data]);

  useEffect(() => {
    if (updateData) {
      console.log(updateData);
      setCustomAlert?.({ show: true, message: "Se han actualizado los campos exitosamente.", severity: "success" });
    }
  }, [updateData])

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error.response?.status === 400 ? error.response?.data.message[0] : error.response?.data.message}.`, severity: "error" });
    }

    if (updateError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${updateError.response?.status === 400 ? updateError.response?.data.message[0] : updateError.response?.data.message}.`, severity: "error" });
    }
  }, [error, updateError])

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(adminData);

    const formData = new FormData();
    for (let key in adminData) {
      if (key === "image") {
        if (adminData[key as keyof typeof adminData]) {
          formData.append(key, adminData[key as keyof typeof adminData], adminData[key as keyof typeof adminData].name)
        }
      } else {
        formData.append(key, adminData[key as keyof typeof adminData])
      }
    }
    setLoading?.({ show: true, message: "Actualizando datos" });
    await updateAdmin({ data: formData });
    setLoading?.({ show: false, message: "" });
  }

  const handleChange = (e: any) => {
    setAdminData((oldAdminData) => {
      return {
        ...oldAdminData,
        [e.target.name]: e.target.type === "file" ? e.target.files[0] : e.target.value
      }
    });

    if (e.target.type === "file") {
      setimagePreview(URL.createObjectURL(e.target.files[0]));
    }
  }


  return (
    <Box>
      <Box component="h1" color="gray">
        Información del Administrador
      </Box>
      <Box borderRadius={5} overflow="hidden" bgcolor="white">
        <Box bgcolor="red" height="50px" />
        <Box p={5}>
          <Box mb={5} textAlign="center" color="gray" component="h1">
            <PersonIcon />
            {adminData.name}
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Box width="100%" display="flex" fontSize="150px" color="gray">
                  <Box m="auto" display="flex" alignItems="center">
                    {
                      imagePreview ?
                        <img style={{ height: "150px", width: "150px", borderRadius: "100%", boxShadow: "5px 5px 10px -3px rgba(0,0,0,0.5)" }} src={imagePreview} alt="" />
                        :
                        <AccountCircleIcon style={{ fontSize: "inherit" }} />
                    }
                    <Button style={{ marginLeft: 10 }} variant="contained" size="small" color="primary">
                      <label htmlFor="image">Cambiar Imagen</label>
                      <input onChange={handleChange} type="file" name="image" id="image" accept="image/png, image/gif, image/jpeg" hidden />
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box mb={5}>
                  <TextField
                    name="name"
                    onChange={handleChange}
                    value={adminData.name}
                    label={
                      <Box display="flex" alignItems="center">
                        <PersonIcon />
                        Nombre y Apellido
                      </Box>
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Box>
                <Box mb={5}>
                  <TextField
                    name="email"
                    onChange={handleChange}
                    value={adminData.email}
                    label={
                      <Box display="flex" alignItems="center">
                        <EmailIcon />
                        Correo Electronico
                      </Box>
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Box>

                <Box mb={5}>
                  <TextField
                    name="phoneNumber"
                    onChange={handleChange}
                    value={adminData.phoneNumber}
                    label={
                      <Box display="flex" alignItems="center">
                        <PhoneIphoneIcon />
                        Numero Telefónico
                      </Box>
                    }
                    variant="outlined"
                    fullWidth
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="address"
                  onChange={handleChange}
                  value={adminData.address}
                  label={
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon />
                      Dirección
                    </Box>
                  }
                  variant="outlined"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Box mt={5} textAlign="right">
              <Button type="submit" variant="contained" color="primary">
                Actualizar Datos
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default AdminsEdit;
