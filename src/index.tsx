import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from '../src/components/App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery';
import 'popper.js/dist/popper';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { MainMenu, MainMenuItems } from './components/MainMenu/mainmenu';

const menuItems=[
  new MainMenuItems('Home','/'),
  new MainMenuItems('Contact','/contact'),
  new MainMenuItems('Log in','/user/login'),

]

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={menuItems}></MainMenu>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
