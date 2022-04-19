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
  makeStyles,
  Grid
} from "@material-ui/core";

import { Link } from "react-router-dom";

import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import CloseIcon from '@material-ui/icons/Close';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import StarOutlinedIcon from '@material-ui/icons/StarOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import SearchIcon from '@material-ui/icons/Search';


import Pagination from '../../../components/Pagination';
import useTags from "../../../hooks/useTags";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import useCategories from "../../../hooks/useCategories";
import ConfirmAlert from "../../../components/ConfirmAlert";
import useAxios from "../../../hooks/useAxios";

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
}));

const Tags = () => {

  const classes = useStyles();

  const [show, setShow] = useState(false);

  const [{ tags, error: tagsError, size, numberOfPages, total }, getTags] = useTags({ options: { manual: true } });

  const [tagToDelete, setTagToDelete] = useState<any>(null);

  const [{ categories, error: categoriesError }, getCategories] = useCategories({ options: { manual: true } });


  const [filters, setFilters] = useState({ id: null, name: "", storeCategoryId: null });

  const [isFilters, setIsFilters] = useState(false);

  const { setLoading, setCustomAlert } = useAuth();

  const [activePage, setActivePage] = useState(1);

  const [{ data: deleteData, error: deleteError, loading: deleteLoading }, deleteTag] = useAxios({ url: `/tags/${tagToDelete?.id}`, method: "DELETE" }, { useCache: false, manual: true });

  const [{data: tagsSummaryData, loading: tagsSummaryLoading}] = useAxios({url: `/summaries/tags`}, {useCache: false});

  useEffect(() => {
    console.log(tagsSummaryData);
  }, [tagsSummaryData])

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando Datos" });
    Promise.all([getCategories(), getTags()]).then((values) => {
      setLoading?.({ show: false, message: "" });
    })
  }, []);

  useEffect(() => {
    setLoading?.({ show: true, message: "Cargando" });
    getTags({
      params: {
        page: activePage
      }
    }).then(() => {
      setLoading?.({ show: false, message: "" });
    });
  }, [activePage])

  useEffect(() => {
    if (tagsError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${tagsError?.response?.status === 400 ? tagsError?.response?.data.message[0] : tagsError?.response?.data.message}.`, severity: "error" });
    }

    if (deleteError) {
      setLoading?.({ show: false, message: "" });
      setCustomAlert?.({ show: true, message: `Ha ocurrido un error: ${deleteError?.response?.status === 400 ? deleteError?.response?.data.message[0] : deleteError?.response?.data.message}.`, severity: "error" });
    }
  }, [tagsError, deleteError]);

  useEffect(() => {
    if (deleteData !== undefined) {
      getTags().then(() => {
        setCustomAlert?.({ show: true, message: "La Etiqueta ha sido eliminada exitosamente", severity: "success" });
        setTagToDelete(null);
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

  const findTags = async () => {
    setLoading?.({ show: true, message: "Filtrando etiquetas" });
    await getTags({
      params: {
        ...filters
      }
    });
    setIsFilters(true);
    setLoading?.({ show: false, message: "" });
  }

  const handleClearFilters = async () => {
    setLoading?.({ show: true, message: "Obteniendo etiquetas" });
    setFilters({ storeCategoryId: null, id: null, name: "" });
    await getTags();
    setIsFilters(false);
    setLoading?.({ show: false, message: "" });
  }

  const handleDelete = (tag: any) => {
    setShow(true);
    setTagToDelete(tag);
  }

  const closeAlert = () => {
    setShow(false);
    setTagToDelete(null);
  }

  const handleConfirmDelete = async () => {
    setShow(false);
    setLoading?.({ show: true, message: "Eliminando Etiqueta" });
    await deleteTag();
    setLoading?.({ show: false, message: "" });
  }

  return (
    <div>
      <Box mb={4}>
        <div className={classes.pageTilte}>
          <LocalOfferOutlinedIcon style={{ fontSize: '40px' }} />
          <h1>Etiquetas</h1>
        </div>
      </Box>

      <Box bgcolor="white" mb={10} className="bg-white rounded p-4">
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Grid container alignItems="center">
              <Grid item alignItems="center">
                <BookmarkBorderOutlinedIcon color="primary" className={classes.resumeCardIcons} />
              </Grid>
              <Grid item alignItems="center">
                <h3 className={classes.resumeCardTitles}>Etiquetas Vacias</h3>
                <h1 className={classes.resumeCardValues}>{tagsSummaryData?.emptyTagsCount}</h1>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Grid container alignItems="center">
              <Grid item alignItems="center">
                <StarOutlinedIcon className={classes.resumeCardIconsStar} />
              </Grid>
              <Grid item alignItems="center">
                <h3 className={classes.resumeCardTitles}>Mejor Etiqueta</h3>
                <h1 className={classes.resumeCardValues}>{tagsSummaryData?.bestTag?.name}</h1>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Grid container alignItems="center">
              <Grid item alignItems="center">
                <EqualizerOutlinedIcon color="error" className={classes.resumeCardIcons} />
              </Grid>
              <Grid xs={9} item alignItems="center">
                <h3 className={classes.resumeCardTitles}>Promedio de productos por etiqueta</h3>
                <h1 className={classes.resumeCardValues}>{Number(tagsSummaryData?.averageProductsPerTag).toFixed(0)}</h1>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4} style={{ textAlign: 'right' }}>
        <Link style={{ textDecoration: "none" }} to={'/catalog/tags/create'}>
          <Button variant="contained" color="primary">
            Añadir Etiqueta
          </Button>
        </Link>


      </Box>

      <Paper elevation={0}>
        <div className={classes.redBar} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>ID</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Nombre</TableCell>
                <TableCell style={{ textAlign: 'center' }}>Categoria</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button color="primary" startIcon={<SearchIcon />} onClick={findTags}>Buscar</Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField onChange={handleChange} name="id" value={filters.id} variant="outlined" size="small" />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField onChange={handleChange} name="name" value={filters.name} variant="outlined" size="small" />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <TextField
                    disabled={!categories || categories.length < 1 ? true : false}
                    onChange={handleChange}
                    value={filters.storeCategoryId}
                    name="storeCategoryId"
                    fullWidth
                    variant="outlined"
                    size="small"
                    select>
                    {
                      categories?.map((category, i) => {
                        return (
                          <MenuItem value={category.id} key={i}>
                            {category.name}
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
              {tags.map((tag, i) => <TableRow key={i}>
                <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {tag.id}
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Link to={`/catalog/tags/${tag?.id}/edit`}>
                    {tag.name}
                  </Link>
                </TableCell>
                <TableCell style={{ textAlign: 'center', textTransform: "capitalize" }}>
                  {tag.storeCategory.name}
                </TableCell>
                <TableCell align="right" className={classes.actionCell}>
                  <IconButton size="small" component={Link} to={`/catalog/tags/${tag?.id}/edit`}>
                    <CreateOutlinedIcon />
                  </IconButton>
                  <IconButton onClick={() => { handleDelete(tag) }} color="primary" size="small">
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>)}
            </TableBody>
          </Table>
        </TableContainer>

        <Box p={"20px 20%"}>
          <Pagination activePage={activePage} pages={numberOfPages} onChange={e => { setActivePage(e) }} />
        </Box>
      </Paper>

      <ConfirmAlert
        show={show}
        title={"¿Deseas eliminar la Etiqueta?"}
        description={tagToDelete?.name}
        onCancel={closeAlert}
        onConfirm={handleConfirmDelete} />
    </div>
  )
}

export default Tags;
