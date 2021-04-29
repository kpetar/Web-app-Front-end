import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { MainMenu, MainMenuItems } from './components/MainMenu/mainmenu';
import Switch from 'react-bootstrap/esm/Switch';
import { Route } from 'react-router';
import { ContactPage } from './components/ContactPage';
import { UserLoginPage } from './components/UserLoginPage';
import { HashRouter } from 'react-router-dom';
import { CategoryPage } from './components/CategoryPage/CategoryPage';
import { UserRegistrationPage } from './components/UserRegistrationPage';

const menuItems=[
  new MainMenuItems('Home','/'),
  new MainMenuItems('Contact','/contact'),
  new MainMenuItems('Log in','/user/login'),
  new MainMenuItems('Category 1','/category/1'),
  new MainMenuItems('Register', '/user/register'),

]

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={menuItems}></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/contact" component={ContactPage}></Route>
        <Route path="/user/login" component={UserLoginPage}></Route>
        <Route path="/category/:id" component={CategoryPage}></Route>
        <Route path="/user/register" component={UserRegistrationPage}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
