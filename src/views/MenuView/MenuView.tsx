import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';
import MenuDetail from './MenuDetail/MenuDetail';
import MenuMaster from './MenuMaster/MenuMaster';

import './MenuView.scss';

function MenuView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { MenuMaster, MenuDetail };
export default withRouter(MenuView);
