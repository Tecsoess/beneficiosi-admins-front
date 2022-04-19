import { Switch } from "react-router"
import { Redirect } from "react-router-dom";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import Admins from "./pages/admins/Admins";
import AdminsEdit from "./pages/admins/AdminsEdit";
import CreateTags from "./pages/catalog/tags/CreateTags";
import Discounts from "./pages/catalog/Discounts";
import Products from "./pages/catalog/Products";
import Tags from "./pages/catalog/tags/Tags";
import ClientEdit from "./pages/ClientEdit";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import HelpCategoriesCreate from "./pages/helps/HelpCategoriesCreate";
import Helps from "./pages/helps/Helps";
import HelpsCategories from "./pages/helps/HelpsCategories";
import HelpsCreate from "./pages/helps/HelpsCreate";
import Locations from "./pages/locations/Locations";
import LocationsCreate from "./pages/locations/LocationsCreate";
import LocationsEdit from "./pages/locations/LocationsEdit";
import Carts from "./pages/my-orders/carts/Carts";
import DeliveryNotes from "./pages/my-orders/DeliveryNotes";
import Invoices from "./pages/my-orders/Invoices";
import Orders from "./pages/my-orders/orders/Orders";
import Notifications from "./pages/notifications/Notifications";
import NotificationsCreate from "./pages/notifications/NotificationsCreate";
import FeaturedProducts from "./pages/publicity/featured-products/FeaturedProducts";
import FeaturedProductsCreate from "./pages/publicity/featured-products/FeaturedProductsCreate";
import PublicityBanner from "./pages/publicity/banners/PublicityBanner";
import PublicitySection from "./pages/publicity/publicity-section/PublicitySection";
import Reports from "./pages/reports/Reports";
import FooterEdit from "./pages/settings/FooterEdit";
import PageInfo from "./pages/settings/PageInfo";
import SettingsFooter from "./pages/settings/SettingsFooter";
import SettingsHome from "./pages/settings/SettingsHome";
import StoreEdit from "./pages/StoreEdit";
import Stores from "./pages/Stores";
import PublicityBannerCreate from "./pages/publicity/banners/PublicityBannerCreate";
import PublicityBannerEdit from "./pages/publicity/banners/PublicityBannerEdit";
import FeaturedStores from "./pages/publicity/featured-stores/FeaturedStores";
import FeaturedStoresCreate from "./pages/publicity/featured-stores/FeaturedStoresCreate";
import HelpCategoriesEdit from "./pages/helps/HelpCategoriesEdit";
import HelpsEdit from "./pages/helps/HelpsEdit";
import PublicitySectionCreate from "./pages/publicity/publicity-section/PublicitySectionCreate";
import CardIssuers from "./pages/pay-settings/card-issuers/CardIssuers";
import BankAccounts from "./pages/pay-settings/bank-accounts/BankAccounts";
import Cards from "./pages/pay-settings/cards/Cards";
import CardIssuersCreate from "./pages/pay-settings/card-issuers/CardIssuersCreate";
import CardIssuersEdit from "./pages/pay-settings/card-issuers/CardIssuersEdit";
import BankAccountsCreate from "./pages/pay-settings/bank-accounts/BankAccountsCreate";
import BankAccountsEdit from "./pages/pay-settings/bank-accounts/BankAccountsEdit";
import CardsCreate from "./pages/pay-settings/cards/CardsCreate";
import CardsEdit from "./pages/pay-settings/cards/CardsEdit";
import BankAccountsTypes from "./pages/pay-settings/bank-accounts-types/BankAccountsTypes";
import BankAccountsTypesCreate from "./pages/pay-settings/bank-accounts-types/BankAccountsTypesCreate";
import BankAccountsTypesEdit from "./pages/pay-settings/bank-accounts-types/BankAccountsTypesEdit";
import CardsTypes from "./pages/pay-settings/cards-types/CardsTypes";
import CardsTypesCreate from "./pages/pay-settings/cards-types/CardsTypesCreate";
import CardsTypesEdit from "./pages/pay-settings/cards-types/CardsTypesEdit";
import CartsEdit from "./pages/my-orders/carts/CartsEdit";
import OrdersEdit from "./pages/my-orders/orders/OrdersEdit";
import PublicitySectionEdit from "./pages/publicity/publicity-section/PublicitySectionEdit";
import Brands from "./pages/catalog/Brands/Brands";
import BrandsCreate from "./pages/catalog/Brands/BrandsCreate";
import EditTags from "./pages/catalog/tags/EditTags";
import FeatureStores from "./pages/settings/features-stores/FeatureStores";
import FeatureStoresCreate from "./pages/settings/features-stores/FeatureStoresCreate";
import FeatureStoresEdit from "./pages/settings/features-stores/FeatureStoresEdit";

const Routes = () => {
  return <Switch>
    <ProtectedRoute path="/dashboard" component={Dashboard} exact />

    {/*USUARIOS*/}
    <Redirect path="/users-management" to={'/users-management/clients'} exact />
    <ProtectedRoute path="/users-management/clients" component={Clients} exact />
    <ProtectedRoute path="/users-management/clients/:id/edit" component={ClientEdit} exact />
    <ProtectedRoute path="/users-management/stores" component={Stores} exact />
    <ProtectedRoute path="/users-management/stores/:id/edit" component={StoreEdit} exact />
    <ProtectedRoute path="/users-management/admins" component={Admins} exact />
    <ProtectedRoute path="/users-management/admins/:id/edit" component={AdminsEdit} exact />

    {/*PUBLICIDAD*/}
    <Redirect path="/ads-management" to={'/ads-management/publicity-banner'} exact />
    <ProtectedRoute path="/ads-management/publicity-banner" component={PublicityBanner} exact />
    <ProtectedRoute path="/ads-management/publicity-banner/create" component={PublicityBannerCreate} exact />
    <ProtectedRoute path="/ads-management/publicity-banner/:id/edit" component={PublicityBannerEdit} exact />
    <ProtectedRoute path="/ads-management/publicity-section" component={PublicitySection} exact />
    <ProtectedRoute path="/ads-management/publicity-section/create" component={PublicitySectionCreate} exact />
    <ProtectedRoute path="/ads-management/publicity-section/:id/edit" component={PublicitySectionEdit} exact />
    <ProtectedRoute path="/ads-management/featured-products" component={FeaturedProducts} exact />
    <ProtectedRoute path="/ads-management/featured-products/create" component={FeaturedProductsCreate} exact />
    <ProtectedRoute path="/ads-management/featured-stores" component={FeaturedStores} exact />
    <ProtectedRoute path="/ads-management/featured-stores/create" component={FeaturedStoresCreate} exact />

    {/*PEDIDOS*/}
    <Redirect path="/orders-management" to={'/orders-management/orders'} exact />
    <ProtectedRoute path="/orders-management/orders" component={Orders} exact />
    <ProtectedRoute path="/orders-management/orders/:id/edit" component={OrdersEdit} exact />
    <ProtectedRoute path="/orders-management/carts" component={Carts} exact />
    <ProtectedRoute path="/orders-management/carts/:id" component={CartsEdit} exact />
    <ProtectedRoute path="/orders-management/invoices" component={Invoices} exact />
    <ProtectedRoute path="/orders-management/delivery-notes" component={DeliveryNotes} exact />

    {/*CATALOGO*/}
    <Redirect path="/catalog" to={'/catalog/products'} exact />
    <ProtectedRoute path="/catalog/products" component={Products} exact />
    <ProtectedRoute path="/catalog/tags" component={Tags} exact />
    <ProtectedRoute path="/catalog/tags/create" component={CreateTags} exact />
    <ProtectedRoute path="/catalog/tags/:id/edit" component={EditTags} exact />
    <ProtectedRoute path="/catalog/brands" component={Brands} exact />
    <ProtectedRoute path="/catalog/brands/create" component={BrandsCreate} exact />
    <ProtectedRoute path="/catalog/discounts" component={Discounts} exact />

    {/*AYUDAS*/}
    <Redirect path="/helps-management" to={'/helps-management/helps'} exact />
    <ProtectedRoute path="/helps-management/helps" component={Helps} exact />
    <ProtectedRoute path="/helps-management/helps/create" component={HelpsCreate} exact />
    <ProtectedRoute path="/helps-management/helps/:id/edit" component={HelpsEdit} exact />
    <ProtectedRoute path="/helps-management/helps-categories" component={HelpsCategories} exact />
    <ProtectedRoute path="/helps-management/helps-categories/create" component={HelpCategoriesCreate} exact />
    <ProtectedRoute path="/helps-management/helps-categories/:id/edit" component={HelpCategoriesEdit} exact />

    {/*CONFIGURACION DE PAGOS*/}
    <Redirect path="/pay-settings" to={'/pay-settings/card-issuers'} exact />

    <ProtectedRoute path="/pay-settings/card-issuers" component={CardIssuers} exact />
    <ProtectedRoute path="/pay-settings/card-issuers/create" component={CardIssuersCreate} exact />
    <ProtectedRoute path="/pay-settings/card-issuers/:id/edit" component={CardIssuersEdit} exact />

    <ProtectedRoute path="/pay-settings/accounts-types" component={BankAccountsTypes} exact />
    <ProtectedRoute path="/pay-settings/accounts-types/create" component={BankAccountsTypesCreate} exact />
    <ProtectedRoute path="/pay-settings/accounts-types/:id/edit" component={BankAccountsTypesEdit} exact />

    <ProtectedRoute path="/pay-settings/cards-types" component={CardsTypes} exact />
    <ProtectedRoute path="/pay-settings/cards-types/create" component={CardsTypesCreate} exact />
    <ProtectedRoute path="/pay-settings/cards-types/:id/edit" component={CardsTypesEdit} exact />

    <ProtectedRoute path="/pay-settings/bank-accounts" component={BankAccounts} exact />
    <ProtectedRoute path="/pay-settings/bank-accounts/create" component={BankAccountsCreate} exact />
    <ProtectedRoute path="/pay-settings/bank-accounts/:id/edit" component={BankAccountsEdit} exact />

    <ProtectedRoute path="/pay-settings/cards" component={Cards} exact />
    <ProtectedRoute path="/pay-settings/cards/create" component={CardsCreate} exact />
    <ProtectedRoute path="/pay-settings/cards/:id/edit" component={CardsEdit} exact />


    {/*CONFIGURACION*/}
    <Redirect path="/settings" to={'/settings/page-info'} exact />
    <ProtectedRoute path="/settings/page-info" component={PageInfo} exact />
    <ProtectedRoute path="/settings/home" component={SettingsHome} exact />
    <ProtectedRoute path="/settings/footer" component={SettingsFooter} exact />
    <ProtectedRoute path="/settings/footer/:id/edit" component={FooterEdit} exact />
    <ProtectedRoute path="/settings/feature-stores" component={FeatureStores} exact />
    <ProtectedRoute path="/settings/feature-stores/create" component={FeatureStoresCreate} exact />
    <ProtectedRoute path="/settings/feature-stores/:id/edit" component={FeatureStoresEdit} exact />

    {/*UBICACIONES*/}
    <ProtectedRoute path="/locations" component={Locations} exact />
    <ProtectedRoute path="/locations/create" component={LocationsCreate} exact />
    <ProtectedRoute path="/locations/:id/edit" component={LocationsEdit} exact />

    {/*REPORTES*/}
    <ProtectedRoute path="/reports" component={Reports} exact />

    {/*NOTIFICACIONES*/}
    <ProtectedRoute path="/notifications" component={Notifications} exact />
    <ProtectedRoute path="/notifications/create" component={NotificationsCreate} exact />

  </Switch>;
};

export default Routes;
