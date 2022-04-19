import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TextField,
  MenuItem,
  IconButton,
  Paper,
  Box,
  makeStyles
} from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';


import Pagination from '../../components/Pagination';
import useHelps from "../../hooks/useHelps";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useHelpsCategories from "../../hooks/useHelpCategories";
import useAxios from "../../hooks/useAxios";
import ConfirmAlert from "../../components/ConfirmAlert";

const useStyles = makeStyles(theme => ({
  pageTilte: {
    color: theme.palette.grey[500],
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
  },

  mlAuto: {
    marginLeft: 'auto'
  },

  textSuccess: {
    color: theme.palette.success.main
  },

  textPrimary: {
    color: theme.palette.primary.main
  },

  resumeCardTitles: {
    color: theme.palette.primary.main
  },

  resumeCardValues: {
    color: theme.palette.grey[400]
  },

  resumeCardIcons: {
    fontSize: '50px',
    marginRight: '20px'
  },

  resumeCardIconsStar: {
    fontSize: '50px',
    marginRight: '20px',
    color: theme.palette.warning.main
  },

  textWarning: {
    color: theme.palette.info.main
  },

  redBar: {
    background: theme.palette.primary.main,
    minHeight: '50px',
    borderRadius: '5px 5px 0px 0px'
  },

  redBar2: {
    background: theme.palette.primary.main,
    minHeight: '50px',
    borderRadius: '5px 5px 0px 0px',
    padding: '10px 15px',
    color: 'white',
    margin: 0
  },

  actionCell: {
    whiteSpace: 'nowrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    }
  },
}))

const tags = Array.from(Array(10).keys()).map((n) => {
  return {
    id: n,
    name: 'Como hacer un pedido',
    category: {
      id: 1,
      name: 'Gastronomia'
    }
  }
});

const Helps = () => {

  const [{ helps, error, numberOfPages, total }, getHelps] = useHelps();
  const [{ helpsCategories, error: helpsCategoriesError }, getHelpsCategories] = useHelpsCategories();

  const [show, setShow] = useState(false);

  const [helpToDelete, setHelpToDelete] = useState<any>(null);

  const [{ data: deleteData, error: deleteError }, deleteHelp] = useAxios({ url: `/helps/${helpToDelete?.id}`, method: "DELETE" }, { useCache: false, manual: true });

  const [activePage, setActivePage] = useState(1);

  const [filters, setFilters] = useState({ id: null, name: "", categoryId: "" });

  const [isFilters, setIsFilters] = useState(false);

  const { setLoading, setCustomAlert } = useAuth();

  const history = useHistory();

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando Datos" });
    Promise.all([getHelpsCategories(), getHelps()]).then((values) => {
      setLoading?.({ show: false, message: "" });
    })
  }, []);

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando" });
    getHelps({
      params: {
        page: activePage
      }
    }).then(() => {
      setLoading?.({ show: false, message: "" });
    });
  }, [activePage])


  useEffect(() => {
    if (error) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${error?.response?.status === 400 ? error?.response?.data.message[0] : error?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }

    if (helpsCategoriesError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${helpsCategoriesError?.response?.status === 400 ? helpsCategoriesError?.response?.data.message[0] : helpsCategoriesError?.response?.data.message}.`, severity: "error" });
    }
  }, [error, deleteError, helpsCategoriesError]);


  useEffect(() => {
    if (deleteData !== undefined) {
      getHelps().then(() => {
        setCustomAlert?.({ show: true, message: "La Ayuda ha sido eliminada exitosamente", severity: "success" });
        setHelpToDelete(null);
      });
    }
  }, [deleteData])

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

  const handleClick = async () => {
    setLoading?.({ show: true, message: "Filtrando ayudas" })
    await getHelps({ params: filters });
    setLoading?.({ show: false, message: "" })
    setIsFilters(true);
  }

  const handleClearFilters = async () => {
    setFilters({ id: null, name: "", categoryId: "" });
    setLoading?.({ show: true, message: "Eliminando Filtros" })
    await getHelps();
    setLoading?.({ show: false, message: "" })
    setIsFilters(false);
  }

  const handleDelete = (help: any) => {
    setShow(true);
    setHelpToDelete(help);
  }

  const closeAlert = () => {
    setShow(false);
    setHelpToDelete(null);
  }

  const handleConfirmDelete = async () => {
    setShow(false);
    setLoading?.({ show: true, message: "Eliminando ayuda" });
    await deleteHelp();
    setLoading?.({ show: false, message: "" });
  }

  const handleCreateHelp = () => {
    history.push('/helps-management/helps/create');
  }

  const classes = useStyles();

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <HelpOutlineIcon style={{ fontSize: '40px' }} />
          <h1>Ayudas</h1>
        </div>
      </Box>

      <Box mb={4} style={{ textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={handleCreateHelp}>
          Añadir Ayuda
        </Button>
      </Box>

      <Paper elevation={0}>
        <div className={classes.redBar} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Nombre</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Topicos</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button color="primary" startIcon={<SearchIcon />} onClick={handleClick}>Buscar</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="id"
                    value={filters.id}
                    onChange={handleChange}
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    variant="outlined"
                    size="small" />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    size="small"
                    select>
                    {
                      helpsCategories.map((helpCategory, i) => {
                        return (
                          <MenuItem value={helpCategory.id} key={i}>
                            {helpCategory.name}
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
              {helps.length > 0 ?


                helps.map((help, i) => <TableRow key={i}>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {help.id}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {help.title}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {help.helpCategory?.name}
                  </TableCell>
                  <TableCell align="right" className={classes.actionCell}>
                    <IconButton size="small" component={Link} to={`/helps-management/helps/${help.id}/edit`}>
                      <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => { handleDelete(help) }} color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
                :
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box component="p" color="red" textAlign="center">No hay Ayudas</Box>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>

        <Box p={"20px 20%"}>
          <Pagination activePage={activePage} pages={numberOfPages} onChange={e => { setActivePage(e) }} />
        </Box>
      </Paper>

      <ConfirmAlert
        show={show}
        title={"¿Deseas eliminar la Ayuda?"}
        description={helpToDelete?.title}
        onCancel={closeAlert}
        onConfirm={handleConfirmDelete} />
    </div>
  )
}

export default Helps;
