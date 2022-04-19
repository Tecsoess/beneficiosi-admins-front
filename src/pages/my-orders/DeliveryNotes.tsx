import SectionTitle from "../../components/SectionTitle";
import { IconButton, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import Pagination from "../../components/Pagination";
import SearchIcon from '@material-ui/icons/Search';
import PrintIcon from '@material-ui/icons/Print';
import ReceiptIcon from '@material-ui/icons/Receipt';


const invoices = Array.from(Array(10).keys()).map(_ => ({
  id: 123456,
  store: {
    id: 1,
    name: 'BurguerKing'
  },
  order: {
    ref: 'AASDAC844'
  },
  amount: 15.38,
  createdAt: new Date().toLocaleDateString(),
  client: {
    id: 1,
    name: 'Jeyver Vegas'
  },
  address: {
    id: 1,
    address: 'Juncal 2930'
  },
  isActive: true,
}));

const useStyles = makeStyles(theme => ({
  actionsCell: {
    whiteSpace: 'nowrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1),
    }
  },
  mb: {
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    color: theme.palette.primary.main
  },
  money: {
    fontSize: theme.spacing(3)
  },
  textSuccess: {
    color: theme.palette.success.main,
  },
  textPrimary: {
    color: theme.palette.primary.main,
  },

  tablehead: {
    background: theme.palette.primary.main,
    height: 40,
    width: '100%',
    marginTop: 30
  },
  textCenter: {
    textAlign: 'center'
  },
  borderb: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`
  },
  bordert: {
    borderTop: `1px solid ${theme.palette.grey[400]}`
  },
}));

const DeliveryNotes = () => {

  const classes = useStyles();

  return (
    <div>
      <SectionTitle withMargin>
        <ReceiptIcon />
        Albaranes
      </SectionTitle>

      <div className={classes.tablehead}>

      </div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.textCenter}>ID</TableCell>
              <TableCell className={classes.textCenter}>Cliente</TableCell>
              <TableCell className={classes.textCenter}>Orden</TableCell>
              <TableCell className={classes.textCenter}>Tienda</TableCell>
              <TableCell className={classes.textCenter}>Direccion</TableCell>
              <TableCell className={classes.textCenter}>Total</TableCell>
              <TableCell className={classes.textCenter}>Fecha</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.textCenter}>
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <TextField className={classes.mb} variant="outlined" size="small" />
                <TextField variant="outlined" size="small" />
              </TableCell>
              <TableCell className={classes.textCenter}>
                <IconButton size="small">
                  <SearchIcon /> Buscar
                  </IconButton>
              </TableCell>
            </TableRow>
            {invoices.map((invoice, i) => <TableRow key={i}>
              <TableCell className={classes.textCenter}>{invoice.id}</TableCell>
              <TableCell className={classes.textCenter}>
                <Link to={'/#'}>
                  {invoice.client.name}
                </Link>
              </TableCell>
              <TableCell className={classes.textCenter}>
                <Link to={'/#'}>
                  {invoice.order.ref}
                </Link>
              </TableCell>
              <TableCell className={classes.textCenter}>
                <Link to={'/#'}>
                  {invoice.store.name}
                </Link>
              </TableCell>
              <TableCell className={classes.textCenter}>
                {invoice.address.address}
              </TableCell>
              <TableCell className={classes.textCenter}>$ {invoice.amount}</TableCell>
              <TableCell className={classes.textCenter}>{invoice.createdAt}</TableCell>
              <TableCell align="right" className={classes.actionsCell}>
                <IconButton size="small" component={Link} to="/clients/1/edit">
                  <PrintIcon />  Imprimir
                  </IconButton>
              </TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination pages={10} activePage={1} key={0} />
    </div>
  )
}

export default DeliveryNotes;
