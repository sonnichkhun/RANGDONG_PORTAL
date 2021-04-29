import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import PermissionDetail from './PermissionDetail/PermissionDetail';
import PermissionMaster from './PermissionMaster/PermissionMaster';

import './PermissionView.scss';

function PermissionView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { PermissionMaster, PermissionDetail };
export default withRouter(PermissionView);
