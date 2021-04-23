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

const menuItems=[
  new MainMenuItems('Home','/'),
  new MainMenuItems('Contact','/contact'),
  new MainMenuItems('Log in','/user/login'),

]

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={menuItems}></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={HomePage}></Route>
        <Route path="/contact" component={ContactPage}></Route>
        <Route path="/user/login" component={UserLoginPage}></Route>
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
