import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import ListAltIcon from '@material-ui/icons/ListAlt';
import WidgetsIcon from '@material-ui/icons/Widgets';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import TimelineIcon from '@material-ui/icons/Timeline';
import NotificationsActiveOutlinedIcon from '@material-ui/icons/NotificationsActiveOutlined';
import StoreIcon from '@material-ui/icons/Store';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ContactlessIcon from '@material-ui/icons/Contactless';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import ReceiptIcon from '@material-ui/icons/Receipt';
import StarsOutlinedIcon from '@material-ui/icons/StarsOutlined';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import ArrowDownwardOutlinedIcon from '@material-ui/icons/ArrowDownwardOutlined';
import ViewDayOutlinedIcon from '@material-ui/icons/ViewDayOutlined';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';

import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import MoneyIcon from '@material-ui/icons/Money';
import CategoryIcon from '@material-ui/icons/Category';


import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

export type MenuLink = {
  title: string,
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
  path: string,
  children: MenuLink[] | null,
};

const createLink = (
  title: string,
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>,
  path: string,
  children: MenuLink[] | null = null
) => ({ title, icon, path, children });

const MenuLinks = [
  createLink('Panel principal', HomeIcon, '/dashboard'),

  createLink('Gestión de usuarios', PeopleIcon, '/users-management', [
    createLink('Clientes', PeopleIcon, '/users-management/clients'),
    createLink('Tiendas', StoreIcon, '/users-management/stores'),
    createLink('Admin', SupervisorAccountIcon, '/users-management/admins'),
  ]),

  createLink('Publicidad', ContactlessIcon, '/ads-management', [
    createLink('Banner Publicitario', AddPhotoAlternateOutlinedIcon, '/ads-management/publicity-banner'),
    createLink('Sección Publicitaria', BallotOutlinedIcon, '/ads-management/publicity-section'),
    createLink('Destacados', StarsOutlinedIcon, '/ads-management/featured-products'),
    createLink('Tiendas Destacadas', StoreIcon, '/ads-management/featured-stores'),
  ]),

  createLink('Pedidos', ListAltIcon, '/orders-management', [
    createLink('Ordenes', ListAltIcon, '/orders-management/orders'),
    createLink('Carritos', ShoppingCartIcon, '/orders-management/carts'),
  ]),


  createLink('Catalogo', WidgetsIcon, '/catalog', [
    createLink('Productos', FastfoodIcon, '/catalog/products'),
    createLink('Etiquetas', LocalOfferOutlinedIcon, '/catalog/tags'),
    createLink('Marcas', CategoryIcon, '/catalog/brands'),
    createLink('Descuentos', ArrowDownwardOutlinedIcon, '/catalog/discounts'),
  ]),

  createLink('Ayudas', HelpOutlineIcon, '/helps-management', [
    createLink('Ayudas', HelpOutlineIcon, '/helps-management/helps'),
    createLink('Categorias de Ayudas', HelpOutlineIcon, '/helps-management/helps-categories')
  ]),

  createLink('Configuración de Pagos', AttachMoneyIcon, '/pay-settings', [
    createLink('Emisores de tarjetas', AccountBalanceIcon, '/pay-settings/card-issuers'),
    createLink('Tipos de cuentas', MoneyIcon, '/pay-settings/accounts-types'),
    createLink('Tipos de tarjetas', DynamicFeedIcon, '/pay-settings/cards-types'),
    createLink('Cuentas Bancarias', ChromeReaderModeIcon, '/pay-settings/bank-accounts'),
    createLink('Tarjetas', CreditCardIcon, '/pay-settings/cards'),
  ]),

  createLink('Configuración', SettingsIcon, '/settings', [
    createLink('Informacion de la pagina', SettingsIcon, '/settings/page-info'),
    createLink('Configuracion del home', HomeIcon, '/settings/home'),
    createLink('Configuracion del footer', ViewDayOutlinedIcon, '/settings/footer'),
    createLink('Caracteristicas de tiendas', LocalOfferOutlinedIcon, '/settings/feature-stores'),
  ]),

  createLink('Ubicaciones', LocationOnOutlinedIcon, '/locations'),


  createLink('Reportes', TimelineIcon, '/reports'),

  createLink('Notificaciones', NotificationsActiveOutlinedIcon, '/notifications'),
];

export default MenuLinks;
