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
import { MainMenu } from './components/MainMenu/mainmenu';



ReactDOM.render(
  <React.StrictMode>
    <MainMenu></MainMenu>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
