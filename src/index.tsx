import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import Switch from 'react-bootstrap/esm/Switch';
import { HashRouter, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import OrderPage from './components/OrdersPage/OrdersPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardCategory from './components/AdministratorDashboardCategory/AdministratorDashboardCategory';
import AdministratorDashboardFeature from './components/AdministratorDashboardFeature/AdministratorDashboardFeature';
import AdministratorDashboardArticle from './components/AdministratorDashboardArticle/AdministratorDashboardArticle';
import AdministratorDashboardPhoto from './components/AdministratorDashboardPhoto/AdministratorDashboardPhoto';
import ArticlePage from './components/ArticlePage/ArticlePage';
import AdministratorDashboardOrder from './components/AdministratorDashboardOrder/AdministratorDashboardOrder';
import { AdministratorLogoutPage } from './components/AdministratorLogoutPage/AdministratorLogoutPage';
import { UserLogoutPage } from './components/UserLogoutPage/UserLogoutPage';


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/contact/" component={ContactPage}></Route>
        <Route path="/user/login/" component={UserLoginPage}></Route>
        <Route path="/user/logout/" component={UserLogoutPage}></Route>
        <Route path="/category/:cId/" component={CategoryPage}></Route>
        <Route path="/article/:aId/" component={ArticlePage}></Route>
        <Route path="/user/register/" component={UserRegistrationPage}></Route>
        <Route path="/cart/orders/" component={OrderPage}></Route>
        <Route path="/administrator/login" component={AdministratorLoginPage}></Route>
        <Route exact path="/administrator/dashboard/" component={AdministratorDashboard}></Route>
        <Route path="/administrator/dashboard/category/" component={AdministratorDashboardCategory}></Route>
        <Route path="/administrator/dashboard/feature/:cId" component={AdministratorDashboardFeature}></Route>
        <Route path="/administrator/dashboard/article/" component={AdministratorDashboardArticle}></Route>
        <Route path="/administrator/dashboard/photo/:aId" component={AdministratorDashboardPhoto}></Route>
        <Route path="/administrator/dashboard/order/" component={AdministratorDashboardOrder}></Route>
        <Route path="/administrator/logout" component={AdministratorLogoutPage}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
