import { API_APP_USER_PORTAL_ROUTE } from 'config/api-consts';
import {
  APP_USER_ROUTE, ORGANIZATION_ROUTE,
  POSITION_ROUTE,
  PROFILE_ROUTE, ROLE_ROUTE, USER_NOTIFICATION_ROUTE,
} from 'config/route-consts';
import { translate } from 'core/helpers/internationalization';
import { RouteConfig } from 'react-router-config';
import { API_ORGANIZATION_ROUTE, API_POSITION_ROUTE, API_ROLE_ROUTE, API_SITE_ROUTE } from './api-consts';
import { SITE_ROUTE } from './route-consts';




export const menu: RouteConfig[] = [
  {
    name: translate('menu.appUsers'),
    path: APP_USER_ROUTE,
    validPath: `/${`${API_APP_USER_PORTAL_ROUTE}`}/list`,
    key: APP_USER_ROUTE,
    icon: 'tio-user_add',
  },

  {
    name: translate('menu.roles'),
    path: ROLE_ROUTE,
    validPath: `/${`${API_ROLE_ROUTE}`}/list`,
    key: ROLE_ROUTE,
    icon: 'tio-group_senior',
  },
  {
    name: translate('menu.site'),
    path: SITE_ROUTE,
    validPath: `/${`${API_SITE_ROUTE}`}/list`,
    key: SITE_ROUTE,
    icon: 'tio-group_senior',
  },
  {
    name: translate('menu.organization'),
    path: ORGANIZATION_ROUTE,
    validPath: `/${`${API_ORGANIZATION_ROUTE}`}/list`,
    key: ORGANIZATION_ROUTE,
    icon: 'tio-category_outlined',
  },
  {
    name: translate('menu.position'),
    path: POSITION_ROUTE,
    validPath: `/${`${API_POSITION_ROUTE}`}/list`,
    key: POSITION_ROUTE,
    icon: 'tio-files_labeled_outlined',
  },
  // {
  //   notTitle: false,
  //   name: translate('menu.administrativeUnits'),
  //   path: OFFICIAL_ROOT_ROUTE,
  //   key: OFFICIAL_ROOT_ROUTE,
  //   checkVisible: checkVisible(
  //     `/${`${API_PROVINCE_ROUTE}`}/list`,
  //     `/${`${API_DISTRICT_ROUTE}`}/list`,
  //     `/${`${API_WARD_ROUTE}`}/list`,
  //   ),
  //   icon: 'tio-earth_west',
  //   children: [
  //     {
  //       name: translate('menu.provinces'),
  //       path: PROVINCE_ROUTE,
  //       validPath: `/${`${API_PROVINCE_ROUTE}`}/list`,
  //       key: PROVINCE_ROUTE,
  //       icon: 'tio-route',
  //     },
  //     {
  //       name: translate('menu.districts'),
  //       path: DISTRICT_ROUTE,
  //       validPath: `/${`${API_DISTRICT_ROUTE}`}/list`,
  //       key: DISTRICT_ROUTE,
  //       icon: 'tio-route',
  //     },
  //     {
  //       name: translate('menu.wards'),
  //       path: WARD_ROUTE,
  //       validPath: `/${`${API_WARD_ROUTE}`}/list`,
  //       key: WARD_ROUTE,
  //       icon: 'tio-route',
  //     },
  //   ],
  // },
];

export const menuProfile: RouteConfig[] = [
  {
    name: translate('menu.userAccount'),
    path: PROFILE_ROUTE,
    key: 'official-user-account',
    icon: 'tio-account_circle',
  },
  {
    name: translate('menu.userNotifications'),
    path: USER_NOTIFICATION_ROUTE,
    key: 'official-user-notification',
    icon: 'tio-notifications_on_outlined',
  },
];

// function checkVisible(
//   ...urls: string[]
// ): (object: Record<string, number>) => boolean {
//   return (object: Record<string, number>) => {
//     let display = false;
//     if (urls.length > 0) {
//       urls.forEach(item => {
//         if (object.hasOwnProperty(item)) display = true;
//       });
//     }
//     return display;
//   };
// } // check whether title is visible or not
