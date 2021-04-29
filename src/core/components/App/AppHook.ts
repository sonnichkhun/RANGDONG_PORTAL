import { menu } from 'config/menu';
import { Reducer, useEffect, useReducer } from 'react';
import { RouteConfig } from 'react-router-config';
import permissionService from 'services/PermissionService';

export interface AppState {
  permissionPaths?: string[];
  authorizedMenus?: RouteConfig[];
  authorizedAction?: string[];
  authorizedMenuMapper?: Record<string, any>;
  authChecking?: boolean;
}

export interface AppAction {
  type: AppActionEnum;
  data: AppState;
}

export enum AppActionEnum {
  SET_PERMISSION,
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case AppActionEnum.SET_PERMISSION: {
      return {
        ...state,
        ...action.data,
      };
    }
  }
}

export default function useAuthorizedApp() {
  const [
    {
      permissionPaths,
      authorizedMenus,
      authorizedAction,
      authorizedMenuMapper,
      authChecking,
    },
    dispatch,
  ] = useReducer<Reducer<AppState, AppAction>>(appReducer, {
    permissionPaths: [],
    authorizedMenus: [],
    authorizedAction: [],
    authorizedMenuMapper: null,
    authChecking: true,
  });

  useEffect(() => {
    let isCancelled = false;
    try {
      const fetch = async () => {
        let permissions = [];
        // Promise.all([ permissionService.listPath(),  permissionService.listPathMDM()])
        //   .then(([listPortal, listMDM]) => {
        //     permissions = [listPortal, ...listMDM];
        //     debugger
        //   })

        const listportal = await permissionService.listPath();
        // const listMDM = await permissionService.listPathMDM();
        // permissions = [...listportal, ...listMDM];
        permissions = [...listportal];
        // const permissions = await permissionService.listPath();
        if (!isCancelled) {
          if (permissions.length > 0) {
            const menuMapper: Record<string, number> = {};
            const actions: string[] = [];
            permissions.forEach((path: string, index) => {
              // if (path.match(ACTION_URL_REGEX)) {
                menuMapper[`/${path as string}`] = index;
                actions.push(path); // set legal action
              // }
            });

            dispatch({
              type: AppActionEnum.SET_PERMISSION,
              data: {
                permissionPaths: [...permissions],
                authorizedMenus: menu.map((item: RouteConfig) =>
                  mapTree(item, menuMapper),
                ),
                authorizedAction: actions,
                authorizedMenuMapper: menuMapper,
                authChecking: false,
              }, // update all appState
            });
            return;
          }
          dispatch({
            type: AppActionEnum.SET_PERMISSION,
            data: {
              authorizedMenuMapper: {
                hasAnyPermission: 0,
              },
              authChecking: false,
            },
          }); // if listPath length === 0, set hasAnyPermission to 0
        }
      };
      fetch();
    } catch (ex) {
      // tslint:disable-next-line:no-console
      console.log(`ex: `, ex);
    }
    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    permissionPaths,
    authorizedMenus,
    authorizedMenuMapper,
    authorizedAction,
    authChecking,
  };
}

const mapTree = (tree: RouteConfig, mapper: Record<string, number>) => {
  const { path, children } = tree;
  let isShow = false;
  if (mapper.hasOwnProperty((path) as string)) isShow = true; // if any path contained by mapper's keys

  if (typeof tree.checkVisible === 'function' && !tree.notTitle) {
    isShow = tree.checkVisible(mapper);
  }

   if (!children || (typeof children === 'object' && children.length === 0))
    return { ...tree, isShow };
  return {
    ...tree,
    isShow,
    children: children.map((item: RouteConfig) => mapTree(item, mapper)),
  };
};
