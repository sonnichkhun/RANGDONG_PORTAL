import { routes, NotLoggedInRoutes } from 'config/routes';
import { i18nextConfig, initialGlobalState } from 'core/config';
import i18next from 'i18next';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import React from 'reactn';
import App from './core/components/App/App';
import * as serviceWorker from './serviceWorker';
import './styles';

Promise.all([
  React.setGlobal(initialGlobalState),
  i18next.use(initReactI18next).init(i18nextConfig),
]).then(() => {
  ReactDOM.render(
    <BrowserRouter>
      <App routes={routes} notLoggedInRoutes={NotLoggedInRoutes} />
    </BrowserRouter>,
    document.getElementById('root'),
  );
});

serviceWorker.unregister();
