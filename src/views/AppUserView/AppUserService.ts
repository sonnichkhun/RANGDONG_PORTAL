import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import React, { Dispatch, SetStateAction } from 'react';

export  class AppUserService {
      public useAppUserModal(
        getList: (filter: AppUserFilter) => Promise<AppUser[]>,
        count: (filter: AppUserFilter) => Promise<number>,
        model: AppUser,
      ): [
        boolean,
        Dispatch<SetStateAction<boolean>>,
        boolean,
        Dispatch<SetStateAction<boolean>>,
        AppUser[],
        number,
      ]{
        const [visible, setVisible] = React.useState<boolean>(false);
        const [loading, setLoading] = React.useState<boolean>(false);
        const [list, setList] = React.useState<AppUser[]>([]);
        const [total, setTotal] = React.useState<number>(0);
        const [filter] = React.useState<AppUserFilter>(new AppUserFilter());

        React.useEffect(() => {
          if (visible) {
            setLoading(true);
            Promise.all([getList(filter), count(filter)])
            .then(([list, total]) => {
              setList(list);
              setTotal(total);
            })
            .finally(() => {
              setLoading(false);
            });
          }
        }, [count, filter, getList, model, visible]);

        return [
          loading,
          setLoading,
          visible,
          setVisible,
          list,
          total,
        ];
      }

      public useRoleContentMaster(
        getList: (filter: RoleFilter) => Promise<Role[]>,
        count: (filter: RoleFilter) => Promise<number>,
      ): [
        RoleFilter,
          Dispatch<SetStateAction<RoleFilter>>,
          Role[],
          Dispatch<SetStateAction<Role[]>>,
          boolean,
          Dispatch<SetStateAction<boolean>>,
          () => void,
          number,
        ] {
        const [filter, setFilter] = React.useState<RoleFilter>(
          new RoleFilter(),
        );
        const [loading, setLoading] = React.useState<boolean>(true);
        const [loadList, setLoadList] = React.useState<boolean>(true);
        const [list, setList] = React.useState<Role[]>([]);
        const [total, setTotal] = React.useState<number>(0);

        React.useEffect(() => {
          if (loadList) {
            setLoading(true);
            Promise.all([getList(filter), count(filter)])
              .then(([list, total]) => {
                setList(list);
                setTotal(total);
              })
              .finally(() => {
                setLoadList(false);
                setLoading(false);
              });
          }
        }, [count, filter, getList, loadList]);

        const handleSearch = React.useCallback(() => {
          setLoadList(true);
        }, [setLoadList]);
        return [filter, setFilter, list, setList, loading, setLoading, handleSearch, total];
      }

}
export const appUserService: AppUserService = new AppUserService();

