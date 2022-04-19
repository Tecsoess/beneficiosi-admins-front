import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TableBody,
  TextField,
  IconButton,
  MenuItem
} from "@material-ui/core";

import CreateIcon from '@material-ui/icons/Create';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

import { Link } from 'react-router-dom';

import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

import Pagination from '../../components/Pagination';
import { useEffect, useState } from "react";
import useLocations from "../../hooks/useLocations";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmAlert from "../../components/ConfirmAlert";
import useAxios from "../../hooks/useAxios";


const Locations = () => {

  const { setLoading, setCustomAlert } = useAuth();

  const [show, setShow] = useState(false);

  const [locationToDelete, setLocationToDelete] = useState<any>(null);

  const [{ locations, total, error, loading, numberOfPages }, getLocations] = useLocations();

  const [{ data: deleteData, error: deleteError }, deleteLocation] = useAxios({ url: `/locations/${locationToDelete?.id}`, method: "DELETE" }, { manual: true, useCache: false });

  const [filters, setFilters] = useState({ page: 1, id: "", name: "", parentId: "" });

  const [isFilters, setIsFilters] = useState(false);

  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }
    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, deleteError]);

  useEffect(() => {
    if (deleteData !== undefined) {
      getLocations().then(() => {
        setCustomAlert?.({ show: true, message: "Se ha eliminado La ubicación exitosamente.", severity: "success" });
      });
    }
  }, [deleteData]);

  useEffect(() => {
    getLocations({
      params: {
        ...filters
      }
    });
  }, [filters])


  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Información" });
  }, [loading]);

  const handleChange = (e: any) => {
    setFilters((oldFilters) => {
      if (e.target.name !== "page") {
        return {
          ...oldFilters,
          [e.target.name]: e.target.value,
          page: 1
        }
      }
      return {
        ...oldFilters,
        [e.target.name]: e.target.value,
      }
    })
  }

  const handleDelete = (location: any) => {
    setLocationToDelete(location);
    setShow(true);
  }

  const handleClose = async (e: any) => {
    setShow(false);
    if (e) {
      setLoading?.({ show: true, message: "Eliminando Ubicación" });
      await deleteLocation();
      setLoading?.({ show: false, message: "" });
    }

    setLocationToDelete(null);
  }

  const handleClick = async () => {
    await getLocations({ params: filters });
    setIsFilters(true);
  }

  const handleClearFilters = async () => {
    setFilters({ id: "", name: "", parentId: "", page: 1 });
    await getLocations();
    setIsFilters(false);
  }

  return (
    <Box>
      <Box mb={4} component="h1" color="gray">
        <LocationOnOutlinedIcon />
        Ubicaciones
      </Box>

      <Box textAlign="right" mb={4} >
        <Link style={{ textDecoration: "none" }} to="/locations/create">
          <Button variant="contained" color="primary">
            Agregar ubicación
          </Button>
        </Link>
      </Box>

      <Paper elevation={0}>
        <Box bgcolor="red" borderRadius={"10px 10px 0 0"} p={5}>

        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Nombre</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Pertenece a:</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button color="primary" startIcon={<SearchIcon />} onClick={handleClick}>Buscar</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    onChange={handleChange}
                    value={filters.id}
                    name="id"
                    fullWidth
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={handleChange}
                    value={filters.name}
                    name="name"
                    fullWidth
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell>
                  <TextField
                    onChange={handleChange}
                    value={filters.parentId}
                    name="parentId"
                    fullWidth
                    variant="outlined"
                    size="small"
                    select>
                    {
                      locations.map((location, i) => {
                        return (
                          <MenuItem key={i} value={location.id}>
                            {location.name}
                          </MenuItem>
                        )
                      })
                    }
                  </TextField>
                </TableCell>
                <TableCell>
                  {
                    isFilters ?
                      <Box textAlign="center">
                        <Button startIcon={<CloseIcon />} onClick={handleClearFilters}>
                          Limpiar Filtros
                        </Button>
                      </Box>
                      :
                      null
                  }
                </TableCell>
              </TableRow>
              {locations.length > 0 ?

                locations?.map((location, i) => <TableRow key={i}>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {location.id}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {location?.name}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {location.parentLocation ?
                      location.parentLocation.name
                      :
                      "No pertenece a ninguna localidad."
                    }
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" component={Link} to={`/locations/${location.id}/edit`} >
                      <CreateIcon />
                    </IconButton>
                    <IconButton onClick={() => { handleDelete(location) }} color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
                :
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box textAlign="center" color="red">
                      No hay Ubicaciones
                    </Box>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>

        <Box p={"20px 20%"}>
          <Pagination activePage={filters.page} pages={numberOfPages} onChange={e => { handleChange({ target: { name: "page", value: e } }) }} />
        </Box>

        <ConfirmAlert title={`¿Desea Eliminar ${locationToDelete?.name}?`} show={show} onClose={handleClose} />
      </Paper>
    </Box>
  )
}

export default Locations;
