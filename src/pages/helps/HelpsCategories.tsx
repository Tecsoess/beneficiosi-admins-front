import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  TextField,
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
import useHelpsCategories from "../../hooks/useHelpCategories";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmAlert from "../../components/ConfirmAlert";
import useAxios from "../../hooks/useAxios";

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

const HelpsCategories = () => {

  const [{ helpsCategories, loading, error, numberOfPages, total }, getHelps] = useHelpsCategories();

  const [show, setShow] = useState(false);

  const [helpCategoryToDelete, setHelpCategoryToDelete] = useState<any>(null);

  const [{ data: deleteData, error: deleteError }, deleteHelpCategory] = useAxios({ url: `/help-categories/${helpCategoryToDelete?.id}`, method: "DELETE" }, { useCache: false, manual: true });

  const [filters, setFilters] = useState({ id: null, name: "" });

  const [isFilters, setIsFilters] = useState(false);

  const [activePage, setActivePage] = useState(1);

  const history = useHistory();

  const { setLoading, setCustomAlert } = useAuth();

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
  }, [error, deleteError]);


  useEffect(() => {
    if (deleteData !== undefined) {
      getHelps().then(() => {
        setCustomAlert?.({ show: true, message: "La Categoria de Ayuda ha sido eliminada exitosamente", severity: "success" });
        setHelpCategoryToDelete(null);
      });
    }
  }, [deleteData])



  useEffect(() => {
    setLoading?.({ show: loading, message: "Obteniendo Información" });
  }, [loading])


  const classes = useStyles();

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
    setFilters({ id: null, name: "" });
    setLoading?.({ show: true, message: "Eliminando Filtros" })
    await getHelps();
    setLoading?.({ show: false, message: "" })
    setIsFilters(false);
  }

  const handleDelete = (help: any) => {
    setShow(true);
    setHelpCategoryToDelete(help);
  }

  const closeAlert = () => {
    setShow(false);
    setHelpCategoryToDelete(null);
  }

  const handleConfirmDelete = async () => {
    setShow(false);
    setLoading?.({ show: true, message: "Eliminando categoria de ayuda" });
    await deleteHelpCategory();
    setLoading?.({ show: false, message: "" });
  }

  const createHelpCategory = () => {
    history.push('/helps-management/helps-categories/create');
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <HelpOutlineIcon style={{ fontSize: '40px' }} />
          <h1>Categoria de ayudas</h1>
        </div>
      </Box>

      <Box mb={4} style={{ textAlign: 'right' }}>
        <Button onClick={createHelpCategory} variant="contained" color="primary">
          Crear Categoria de Ayuda
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
                <TableCell style={{ textAlign: 'center' }}>Icono</TableCell>
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
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>

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
              {helpsCategories.length > 0 ?
                helpsCategories.map((helpCategory, i) => <TableRow key={i}>
                  <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    {helpCategory.id}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    {helpCategory.name}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Box textAlign="center">
                      <img style={{ width: "60px", height: "60px" }} src={`http://api.tubeneficiosi.com/${helpCategory.icon}`} alt="" />
                    </Box>
                  </TableCell>
                  <TableCell align="right" className={classes.actionCell}>
                    <IconButton size="small" component={Link} to={`/helps-management/helps-categories/${helpCategory.id}/edit`}>
                      <CreateOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => { handleDelete(helpCategory) }} color="primary" size="small">
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
                )
                :
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box textAlign="center" color="red">
                      No se encontraron categorias de ayudas
                    </Box>
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
        title={"¿Deseas eliminar la Categoria de Ayuda?"}
        description={helpCategoryToDelete?.name}
        onCancel={closeAlert}
        onConfirm={handleConfirmDelete} />
    </div>
  )
}

export default HelpsCategories;
