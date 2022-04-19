import {
  Button,
  IconButton,
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core"
import Card from "../components/Card";
import SectionTitle from "../components/SectionTitle";
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Pagination from "../components/Pagination";
import ChatIcon from '@material-ui/icons/Chat';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DeleteIcon from '@material-ui/icons/Delete';
import { useParams } from "react-router-dom";
import UpdateClientForm from "../components/Forms/UpdateClientForm";
import UpdatePasswordForm from "../components/Forms/UpdatePasswordForm";
import StoreOrdersTable from "../components/StoreOrdersTable";

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    borderRadius: '50%',
    boxShadow: theme.shadows[3]
  },
  shortInfo: {
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
  spentAmount: {
    textAlign: 'right',
    fontSize: '2.6rem',
    fontWeight: 500,
    margin: theme.spacing(2, 0)
  },
  borderB: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  marginB: {
    marginBottom: theme.spacing(3),
  },
  orderStatus: {
    backgroundColor: theme.palette.warning.main,
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
  },
  cardTitle: {
    display: 'flex',
    '& > span': {
      marginLeft: theme.spacing(1),
    },
  },
  warningText: {
    color: theme.palette.warning.main,
  },
  purpleText: {
    color: '#B400C3',
  },
  primaryText: {
    color: theme.palette.primary.main,
  },
  successText: {
    color: theme.palette.success.main,
  },
  paginationSection: {
    textAlign: 'center',
    padding: theme.spacing(2, 2, 0, 2),
  },
  actionsCell: {
    whiteSpace: 'nowrap',
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1)
    }
  },
}));

const orders = Array.from(Array(10).keys()).map(n => ({
  id: 123456,
  reference: 'IASDHIU',
  delivery: 'CABA',
  store: 'Tienda X',
  total: 15.00,
  date: '12/06/2021 12:00:53',
  status: 'En proceso de pago',
  paymentType: n % 3 === 0 ? 'Efectivo' : 'Tranferencia',
}));

const chats = Array.from(Array(10).keys()).map(n => ({
  id: 123456,
  store: 'Tienda',
  chatTopic: n % 3 === 0 ? 'Error en pago de la Orden #2' : 'Soporte técnico de cliente Jeyver',
  date: '12/06/2021 12:00:53',
  status: n % 3 === 0 ? 'Cerrado' : 'Abierto',
}));



const ClientEdit = () => {
  const classes = useStyles();

  const params = useParams<any>();

  return <>
    <SectionTitle withMargin>Editar Cliente</SectionTitle>

    <UpdateClientForm clientId={params?.id} />

    <UpdatePasswordForm clientId={params?.id} />

    <StoreOrdersTable clientId={params?.id} />
    
  </>;
};

export default ClientEdit;
