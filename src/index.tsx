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


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/contact" component={ContactPage}></Route>
        <Route path="/user/login" component={UserLoginPage}></Route>
        <Route path="/category/:cId" component={CategoryPage}></Route>
        <Route path="/user/register" component={UserRegistrationPage}></Route>
        <Route path="/cart/orders" component={OrderPage}></Route>
        <Route path="/administrator/login" component={AdministratorLoginPage}></Route>
        <Route exact path="/administrator/dashboard/" component={AdministratorDashboard}></Route>
        <Route path="/administrator/dashboard/category/" component={AdministratorDashboardCategory}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
