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
import { MainMenu, MainMenuItems } from './components/MainMenu/mainmenu';
import Switch from 'react-bootstrap/esm/Switch';
import { HashRouter, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import OrderPage from './components/OrdersPage/OrdersPage';
import { UserRegistrationPage } from './components/UserRegistrationPage/UserRegistrationPage';

const menuItems=[
  new MainMenuItems('Home','/'),
  new MainMenuItems('Contact','/contact/'),
  new MainMenuItems('Log in','/user/login/'),
  new MainMenuItems('Register', '/user/register/'),
  new MainMenuItems('My Orders', "/cart/orders/")
]

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={menuItems}></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/contact" component={ContactPage}></Route>
        <Route path="/user/login" component={UserLoginPage}></Route>
        <Route path="/category/:cId" component={CategoryPage}></Route>
        <Route path="/user/register" component={UserRegistrationPage}></Route>
        <Route path="/cart/orders" component={OrderPage}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
