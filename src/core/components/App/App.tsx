import Spin from 'antd/lib/spin';
import { GlobalState } from 'core/config';
import { languageService } from 'core/services/LanguageService';
import * as Cookie from 'js-cookie';
import { AppUser } from 'models/AppUser';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  renderRoutes,
  RouteConfig,
  RouteConfigComponentProps,
} from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import { setGlobal } from 'reactn';
import authenticationService from 'services/AuthenticationService';
import signalRService from 'services/SignalRService';
import {
  ActionContext, MenuContext,
  MenuRouteContext,
  SignalRContext,
} from './AppContext';
import useAuthorizedApp from './AppHook';
import ErrorBoundary from './ErrorBoundary';

export interface AppProps extends RouteConfigComponentProps {
  routes: RouteConfig[];
  notLoggedInRoutes: RouteConfig[];
}

function App(props: AppProps) {
  const [translate] = useTranslation();
  const { routes, notLoggedInRoutes } = props;
  const {
    authorizedMenus,
    authorizedAction,
    authorizedMenuMapper,
    authChecking,
  } = useAuthorizedApp();

  languageService.useLanguage();

  if (!Cookie.get('Token'))
    return <Switch>{renderRoutes(notLoggedInRoutes)}</Switch>;

  authenticationService.checkAuth().then((user: AppUser) => {
    setGlobal<GlobalState>({
      user,
    });
  });

  return (
    <>
      {authChecking ? (
        <div id="app">
          <Spin tip={translate('pages.checking.authority')} />
        </div>
      ) : (
          <ErrorBoundary>
            <SignalRContext.Provider value={signalRService}>
              <MenuContext.Provider value={authorizedMenus}>
                <MenuRouteContext.Provider value={authorizedMenuMapper}>
                  <ActionContext.Provider value={authorizedAction}>
                    <Switch>{renderRoutes(routes)}</Switch>
                  </ActionContext.Provider>
                </MenuRouteContext.Provider>
              </MenuContext.Provider>
            </SignalRContext.Provider>
          </ErrorBoundary>
        )}
    </>
  );
}

export default withRouter(App);
