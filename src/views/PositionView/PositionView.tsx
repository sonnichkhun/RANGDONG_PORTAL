import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { Switch, withRouter } from 'react-router-dom';

import './PositionView.scss';
import PositionMaster from 'views/PositionView/PositionMaster/PositionMaster';
import PositionDetail from 'views/PositionView/PositionDetail/PositionDetail';

function PositionView(props: RouteConfigComponentProps) {
  const { route } = props;

  return <Switch>{route && renderRoutes(route.children)}</Switch>;
}

export { PositionMaster, PositionDetail };
export default withRouter(PositionView);
