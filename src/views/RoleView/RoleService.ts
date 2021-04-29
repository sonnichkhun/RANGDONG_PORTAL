import { generalLanguageKeys } from 'config/consts';
import path from 'path';
import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router';
import nameof from 'ts-nameof.macro';
import { Role } from 'models/Role';
import { PermissionFilter } from 'models/PermissionFilter';
import { Permission } from 'models/Permission';
import { IdFilter } from 'core/filters';
import { roleRepository } from './RoleRepository';
import { crudService } from 'core/services';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { notification } from 'helpers/notification';

export class RoleService {
  public useRoleMasterNavigation(
    detailRoute: string,
  ): [() => void, (id: number) => () => void, (id: number) => () => void] {
    const history = useHistory();

    const handleGoCreate = React.useCallback(() => {
      history.push(
        path.join(detailRoute, nameof(generalLanguageKeys.actions.create)),
      );
    }, [detailRoute, history]);

    const handleGoAppUserRole = React.useCallback(
      (roleId: number) => {
        return () => {
          history.push(path.join(detailRoute, `assign-app-user/${roleId}`));
        };
      },
      [detailRoute, history],
    );

    const handleGoPermissionRole = React.useCallback(
      (roleId: number) => {
        return () => {
          history.push(path.join(detailRoute, `permission-role/${roleId}`));
        };
      },
      [detailRoute, history],
    );

    return [handleGoCreate, handleGoAppUserRole, handleGoPermissionRole];
  }

  public usePermissionTableMaster(
    role: Role,
  ): [
    PermissionFilter,
    Dispatch<SetStateAction<PermissionFilter>>,
    Permission[],
    Dispatch<SetStateAction<Permission[]>>,
    number,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    (field: string) => (filter) => void,
    () => void,
    () => void,
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ] {
    const [filter, setFilter] = crudService.useQuery<PermissionFilter>(
      PermissionFilter,
    );
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [total, setTotal] = React.useState<number>(undefined);
    const [isReset, setIsReset] = React.useState<boolean>(false);
    const [list, setList] = React.useState<Permission[]>([]);

    React.useEffect(() => {
      if (role.id) {
        setFilter({
          ...new PermissionFilter(),
          roleId: { ...new IdFilter(), equal: role.id },
        });
      }
    }, [role.id, setFilter]);

    React.useEffect(() => {
      if (loadList) {
        if (role.id) {
          setLoading(true);
          Promise.all([
            roleRepository.listPermission({
              ...filter,
              roleId: { equal: role.id },
            }),
            roleRepository.countPermission({
              ...filter,
              roleId: { equal: role.id },
            }),
          ])
            .then(([list, total]) => {
              setList(list);
              setTotal(total);
            })
            .finally(() => {
              setLoadList(false);
              setLoading(false);
            });
        }
      }
    }, [filter, loadList, role]);

    const handleFilter = React.useCallback(
      (field: string) => {
        return f => {
          const { skip, take } = PermissionFilter.clone<PermissionFilter>(
            new PermissionFilter(),
          );
          setFilter(
            PermissionFilter.clone<PermissionFilter>({
              ...filter,
              [field]: f,
              skip,
              take,
            }),
          );
          setLoadList(true);
        };
      },
      [filter, setFilter],
    );

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, []);

    const handleDefaultSearch = React.useCallback(() => {
      const { skip, take } = PermissionFilter.clone<PermissionFilter>(
        new PermissionFilter(),
      );
      setFilter(
        PermissionFilter.clone<PermissionFilter>({
          ...filter,
          skip,
          take,
        }),
      );
      setLoadList(true);
    }, [filter, setFilter]);

    /* return filter, setFilter, list, setList, total, loading, setLoading, handleFilter, handleSearch, handleDefaultSearch, isReset, setIsReset*/

    return [
      filter,
      setFilter,
      list,
      setList,
      total,
      loading,
      setLoading,
      handleFilter,
      handleSearch,
      handleDefaultSearch,
      isReset,
      setIsReset,
    ];
  }

  public useDetailPopup(
    role: Role,
    handleList: () => void,
  ): [
    boolean,
    Dispatch<SetStateAction<boolean>>,
    Permission,
    Dispatch<SetStateAction<Permission>>,
    () => void,
    () => void,
    (id?: number) => () => void,
  ] {
    const [translate] = useTranslation();
    /* return popupIsOpen, currentItem, setCurrentItem, handleClose, handleSave, handleOpen */
    const [currentItem, setCurrentItem] = React.useState<Permission>(
      new Permission(),
    );
    const [popupIsOpen, setPopupIsOpen] = React.useState<boolean>(false);

    const handleOpen = React.useCallback(
      (id?: number) => {
        return () => {
          if (id) {
            roleRepository.getPermission(id).then((item: Permission) => {
              setCurrentItem({ ...item });
              setPopupIsOpen(true);
            });
            return;
          }
          /* if id is not available, set new permission */
          setCurrentItem({ ...new Permission() });
          setPopupIsOpen(true);
          return;
        };
      },
      [setCurrentItem, setPopupIsOpen],
    );

    const handleClose = React.useCallback(() => {
      setPopupIsOpen(false);
      setCurrentItem({ ...new Permission() });
    }, [setPopupIsOpen]);

    const handleSave = React.useCallback(() => {
      if (role) {
        currentItem.roleId = role.id;
        /* check method based on currentItem id */
        const method = currentItem.id
          ? roleRepository.updatePermission
          : roleRepository.createPermission;
        method(currentItem)
          .then((permission: Permission) => {
            if (permission) {
              handleClose();
              handleList();
              setTimeout(() => {
                notification.success({
                  message: translate(generalLanguageKeys.update.success),
                });
              }, 1000);
            }
          })
          .catch((error: AxiosError<Role>) => {
            /* validate permisison from server */
            if (error.response && error.response.status === 400) {
              setCurrentItem(error.response?.data);
            }
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      }
    }, [currentItem, handleClose, handleList, role, translate]);

    return [
      popupIsOpen,
      setPopupIsOpen,
      currentItem,
      setCurrentItem,
      handleClose,
      handleSave,
      handleOpen,
    ];
  }
}

export const roleService: RoleService = new RoleService();
