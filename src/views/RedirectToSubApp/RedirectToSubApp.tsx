import { NOT_FOUND_ROUTE } from 'config/route-consts';
import React from 'react';
import NotFoundView from 'views/NotFoundView/NotFoundView';
import './RedirectToSubApp.scss';

function RedirectToSubApp() {
  const {pathname} = window.location;

  React.useEffect(() => {
    if (pathname.startsWith('/dms')) {
      window.location.href = `${window.location.origin}/dms`;
      return;
    }
    if (pathname.startsWith('/crm')) {
      window.location.href = `${window.location.origin}/crm`;
      return;
    }
    if (pathname.startsWith('/portal')) {
      return;
    }
    if (!pathname.startsWith(NOT_FOUND_ROUTE)) {
      window.location.href = NOT_FOUND_ROUTE;
    }
  }, [pathname]);

  return (
    <>
      <NotFoundView />
    </>
  );
}

export default RedirectToSubApp;
