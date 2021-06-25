import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './services/firebase' //importar arquivo que inicializa a conexão com o firebase

import './styles/global.scss'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

