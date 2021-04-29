import Login from 'components/Login/Login';
import {
  APP_USER_DETAIL_ROUTE,
  APP_USER_ROOT_ROUTE,
  APP_USER_ROUTE,
  DISTRICT_ROUTE,
  FORBIDENT_ROUTE,
  LANDING_PAGE_ROUTE,
  LOGIN_ROUTE,
  NOT_FOUND_ROUTE,
  ORGANIZATION_DETAIL_ROUTE,
  ORGANIZATION_ROOT_ROUTE,
  ORGANIZATION_ROUTE,

  PORTAL_ROUTE,



  PROFILE_ROUTE,
  PROVINCE_ROUTE,
  ROLE_DETAIL_ROUTE,
  ROLE_ROOT_ROUTE,
  ROLE_ROUTE,
  ROOT_ROUTE,
  SITE_DETAIL_ROUTE,
  SITE_ROOT_ROUTE,
  SITE_ROUTE,
  USER_NOTIFICATION_ROUTE,
  WARD_ROUTE,
} from 'config/route-consts';
import WithAuth from 'core/components/App/WithAuth';
import DefaultLayout from 'layouts/DefaultLayout/DefaultLayout';
import { join } from 'path';
import React from 'react';
import { Redirect } from 'react-router';
import { RouteConfig } from 'react-router-config';
import AppUserView, {
  AppUserDetail,
  AppUserMaster,
} from 'views/AppUserView/AppUserView';
import DistrictView, {
  DistrictDetail,
  DistrictMaster,
} from 'views/DistrictView/DistrictView';
import ForbidentView from 'views/ForbidentView/ForbidentView';
import LandingPage from 'views/LandingPageView/LandingPage';
import NotFoundView from 'views/NotFoundView/NotFoundView';
import OrganizationTreeView, {
  OrganizationTreeDetail,
  OrganizationTreeMaster,
} from 'views/OrganizationTreeView/OrganizationTreeView';
import Profile from 'views/ProfileView/Profile';
import ProvinceView, {
  ProvinceDetail,
  ProvinceMaster,
} from 'views/ProvinceView/ProvinceView';
import RoleView, {
  AppUserRoleDetail,
  PermissionRoleDetail,
  RoleMaster,
} from 'views/RoleView/RoleView';
import SiteView, { SiteDetail, SiteMaster } from 'views/SiteView/SiteView';
import UserNotification from 'views/UserNotificationView/UserNotificationView';
import WardView, { WardDetail, WardMaster } from 'views/WardView/WardView';
import { API_APP_USER_PORTAL_ROUTE, API_DISTRICT_ROUTE, API_ORGANIZATION_ROUTE, API_PROVINCE_ROUTE, API_ROLE_ROUTE, API_SITE_ROUTE, API_WARD_ROUTE } from './api-consts';

export const routes: RouteConfig[] = [
  {
    key: 'login',
    path: join(ROOT_ROUTE, 'login'),
    component: Login,
    exact: true,
  },
  {
    key: 'landing',
    path: LANDING_PAGE_ROUTE,
    component: LandingPage,
    exact: true,
  },
  {
    path: NOT_FOUND_ROUTE,
    component: NotFoundView,
    exact: true,
  },
  {
    path: FORBIDENT_ROUTE,
    component: ForbidentView,
    exact: true,
  },
  {
    path: ROOT_ROUTE,
    exact: true,
    render() {
      return <Redirect to={LANDING_PAGE_ROUTE} />;
    },
  },
  {
    key: 'main',
    path: PORTAL_ROUTE,
    component: DefaultLayout,
    routes: [
      {
        path: APP_USER_ROOT_ROUTE,
        component: AppUserView,
        children: [
          {
            path: join(APP_USER_DETAIL_ROUTE, ':id'),
            component: WithAuth(AppUserDetail, `/${`${API_APP_USER_PORTAL_ROUTE}`}/list`),
          },
          {
            path: join(APP_USER_ROUTE),
            component: WithAuth(AppUserMaster, `/${`${API_APP_USER_PORTAL_ROUTE}`}/list`),
          },
        ],
      },
      {
        path: DISTRICT_ROUTE,
        component: DistrictView,
        children: [
          {
            path: join(DISTRICT_ROUTE, ':id'),
            component: DistrictDetail,
          },
          {
            path: join(DISTRICT_ROUTE),
            component: WithAuth(DistrictMaster, `/${`${API_DISTRICT_ROUTE}`}/list`),
          },
        ],
      },

      {
        path: SITE_ROOT_ROUTE,
        component: SiteView,
        children: [
          {
            path: join(SITE_DETAIL_ROUTE, ':id'),
            component: WithAuth(SiteDetail, `/${`${API_SITE_ROUTE}`}/list`),
          },
          {
            path: join(SITE_ROUTE),
            component: WithAuth(SiteMaster, `/${`${API_SITE_ROUTE}`}/list`),
          },
        ],
      },

      {
        path: ORGANIZATION_ROOT_ROUTE,
        component: OrganizationTreeView,
        children: [
          {
            path: join(ORGANIZATION_DETAIL_ROUTE, ':id'),
            component: WithAuth(
              OrganizationTreeDetail,
              `/${`${API_ORGANIZATION_ROUTE}`}/list`,
            ),
          },
          {
            path: join(ORGANIZATION_ROUTE),
            component: WithAuth(
              OrganizationTreeMaster,
              `/${`${API_ORGANIZATION_ROUTE}`}/list`,
            ),
          },
        ],
      },

      // {
      //   path: PERMISSION_ROUTE,
      //   component: PermissionView,
      //   children: [
      //     {
      //       path: join(PERMISSION_ROUTE, ':id'),
      //       component: PermissionDetail,
      //     },
      //     {
      //       path: join(PERMISSION_ROUTE),
      //       component: WithAuth(PermissionMaster, `${PERMISSION_ROUTE}`),
      //     },
      //   ],
      // },
      {
        path: PROVINCE_ROUTE,
        component: ProvinceView,
        children: [
          {
            path: join(PROVINCE_ROUTE, ':id'),
            component: ProvinceDetail,
          },
          {
            path: join(PROVINCE_ROUTE),
            component: WithAuth(ProvinceMaster, `/${`${API_PROVINCE_ROUTE}`}/list`),
          },
        ],
      },
      {
        path: WARD_ROUTE,
        component: WardView,
        children: [
          {
            path: join(WARD_ROUTE, ':id'),
            component: WardDetail,
          },
          {
            path: join(WARD_ROUTE),
            component: WithAuth(WardMaster, `/${`${API_WARD_ROUTE}`}/list`),
          },
        ],
      },
      {
        path: ROLE_ROOT_ROUTE,
        component: RoleView,
        children: [
          {
            path: join(ROLE_DETAIL_ROUTE, 'assign-app-user/:id'),
            component: WithAuth(AppUserRoleDetail, `/${`${API_ROLE_ROUTE}`}/list`),
          },
          {
            path: join(ROLE_DETAIL_ROUTE, 'permission-role/:id'),
            component: WithAuth(PermissionRoleDetail, `/${`${API_ROLE_ROUTE}`}/list`),
          },
          {
            path: join(ROLE_DETAIL_ROUTE, ':id'),
            component: WithAuth(PermissionRoleDetail, `/${`${API_ROLE_ROUTE}`}/list`),
          },
          {
            path: join(ROLE_ROUTE),
            component: WithAuth(RoleMaster, `/${`${API_ROLE_ROUTE}`}/list`),
          },
        ],
      },
      // {
      //   path: POSITION_ROUTE,
      //   component: PositionView,
      //   children: [
      //     {
      //       path: join(POSITION_ROUTE, 'id'),
      //       component: PositionDetail,
      //     },
      //     {
      //       path: join(POSITION_ROUTE),
      //       component: WithAuth(PositionMaster, `/${`${API_POSITION_ROUTE}`}/list`),
      //     },
      //   ],
      // },
      {
        path: join(PROFILE_ROUTE),
        component: Profile,
      },
      {
        path: join(USER_NOTIFICATION_ROUTE),
        component: UserNotification,
      },
      {
        path: ROOT_ROUTE,
        render() {
          return <Redirect to={APP_USER_ROUTE} />;
        },
      },
      {
        path: '/portal/:path',
        render() {
          return <Redirect to={NOT_FOUND_ROUTE} />;
        },
      },
    ],
  },
  {
    path: '/:path',
    render() {
      return <Redirect to={NOT_FOUND_ROUTE} />;
    },
  },
];

export const NotLoggedInRoutes = [
  {
    key: 'login',
    path: join(ROOT_ROUTE, 'login'),
    component: Login,
    exact: true,
  },
  {
    path: ROOT_ROUTE,
    exact: true,
    render() {
      return <Redirect to={LOGIN_ROUTE} />;
    },
  },
  {
    path: '/:path',
    render() {
      return <Redirect to={LOGIN_ROUTE} />;
    },
  },
];
