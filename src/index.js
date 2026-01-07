import { Buffer } from 'buffer';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/styles/floating-label.css';
import './assets/styles/lims-global-theme.css';
// import './assets/styles/fontello.css';
import store from './store';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

window.Buffer = Buffer;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter >
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
