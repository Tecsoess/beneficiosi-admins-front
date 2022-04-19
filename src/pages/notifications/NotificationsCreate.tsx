import { Box, Button, Grid, MenuItem, TextField } from '@material-ui/core';

const NotificationsCreate = () => {
  return (
    <Box>
      <Box component="h1" color="gray">
        Crear Notificación
      </Box>

      <Box bgcolor="white" p={4} borderRadius={10}>
        <Grid container>
          <Grid item xs={6}>
            <TextField select fullWidth variant="outlined" label="Seleccione los usuarios">
              <MenuItem value={1}>Clientes</MenuItem>
              <MenuItem value={2}>Administradores</MenuItem>
              <MenuItem value={3}>Tiendas</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box mt={5}>
          <TextField multiline rows={15} label="Mensaje" variant="outlined" fullWidth ></TextField>
        </Box>

        <Box textAlign="right" mt={5}>
          <Button variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default NotificationsCreate;
