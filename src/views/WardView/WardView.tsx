import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';

import WardDetail from './WardDetail/WardDetail';
import WardMaster from './WardMaster/WardMaster';
import './WardView.scss';

function WardView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { WardMaster, WardDetail };
export default withRouter(WardView);
