import { join } from 'path';

export const ROOT_ROUTE: string = '/';

/* appUser routes*/
export const APP_USER_ROOT_ROUTE: string = '/portal/account/app-user';
export const APP_USER_ROUTE: string = join(APP_USER_ROOT_ROUTE, 'app-user-master');
export const APP_USER_DETAIL_ROUTE: string = join(APP_USER_ROOT_ROUTE, 'app-user-detail');

/* role routes*/
export const ROLE_ROOT_ROUTE: string = join('/portal/account/role');

export const ROLE_ROUTE: string = join(ROLE_ROOT_ROUTE, 'role-master');

export const ROLE_DETAIL_ROUTE: string = join(ROLE_ROOT_ROUTE, 'role-detail');

/* organization routes*/
export const ORGANIZATION_ROOT_ROUTE: string = '/portal/account/organization';
export const ORGANIZATION_ROUTE: string = join(ORGANIZATION_ROOT_ROUTE, 'organization-master');
export const ORGANIZATION_DETAIL_ROUTE: string = join(ORGANIZATION_ROOT_ROUTE, 'organization-detail');

/* official routes*/
export const OFFICIAL_ROOT_ROUTE = '/portal/official';

// province route
export const PROVINCE_ROOT_ROUTE: string = join(OFFICIAL_ROOT_ROUTE, 'province');
export const PROVINCE_ROUTE: string = join(PROVINCE_ROOT_ROUTE, 'province-master');
export const PROVINCE_DETAIL_ROUTE: string = join(PROVINCE_ROOT_ROUTE, 'province-detail');

// district route
export const DISTRICT_ROOT_ROUTE: string = join(OFFICIAL_ROOT_ROUTE, 'district');
export const DISTRICT_ROUTE: string = join(DISTRICT_ROOT_ROUTE, 'district-master');
export const DISTRICT_DETAIL_ROUTE: string = join(DISTRICT_ROOT_ROUTE, 'district-detail');
//  ward route
export const WARD_ROOT_ROUTE: string = join(OFFICIAL_ROOT_ROUTE, 'ward');
export const WARD_ROUTE: string = join(WARD_ROOT_ROUTE, 'ward-master');

/* others */
export const LOGIN_ROUTE: string = '/login';

export const NOT_FOUND_ROUTE: string = '/404';

export const FORBIDENT_ROUTE: string = '/403';

export const LANDING_PAGE_ROUTE: string = '/landing-page';

export const FIELD_ROUTE: string = '/portal/field';

export const MENU_ROUTE: string = '/portal/menu';

export const PAGE_ROUTE: string = '/portal/page';

export const PERMISSION_ROUTE: string = '/portal/permission';

export const PORTAL_ROUTE: string = '/portal';

export const POSITION_ROOT_ROUTE: string = '/portal/position';

export const POSITION_ROUTE: string = join(POSITION_ROOT_ROUTE, 'position-master');

export const PROFILE_ROUTE: string = '/portal/profile';

export const CHANGE_PASSWORD_ROUTE: string = '/portal/profile/change-password';

export const USER_NOTIFICATION_ROUTE: string = '/portal/user-notification';

export const DASHBOARD_ROUTE: string = '/portal/dashboard';
export const SITE_ROOT_ROUTE: string = '/portal/site';

export const SITE_ROUTE: string = join(SITE_ROOT_ROUTE, 'site-master');

export const SITE_DETAIL_ROUTE : string = join(SITE_ROOT_ROUTE, 'site-detail');

