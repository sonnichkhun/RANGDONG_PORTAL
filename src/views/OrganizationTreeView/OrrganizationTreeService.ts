import { notification } from 'antd';
import { AxiosError } from 'axios';
import { generalLanguageKeys } from 'config/consts';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Organization } from 'models/Organization';
import React, { Dispatch, RefObject, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

export class OrganizationService {
  public useAppUserContentMaster(
    getList: (filter: AppUserFilter) => Promise<AppUser[]>,
    count: (filter: AppUserFilter) => Promise<number>,
    currentItem: Organization,
  ): [
    AppUserFilter,
    Dispatch<SetStateAction<AppUserFilter>>,
    AppUser[],
    Dispatch<SetStateAction<AppUser[]>>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    () => void,
    number,
  ] {
    const [filter, setFilter] = React.useState<AppUserFilter>(
      new AppUserFilter(),
    );
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loadList, setLoadList] = React.useState<boolean>(true);
    const [list, setList] = React.useState<AppUser[]>([]);
    const [total, setTotal] = React.useState<number>(0);

    React.useEffect(() => {
      if (currentItem) {
        const newFilter = new AppUserFilter();
        newFilter.organizationId.equal = currentItem.id;
        setFilter(newFilter);
      }
    }, [currentItem]);
    // setList and count
    React.useEffect(() => {
      if (loadList && currentItem) {
        const newFilter = new AppUserFilter();
        newFilter.organizationId.equal = currentItem.id;
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
    }, [count, currentItem, filter, getList, loadList]);

    const handleSearch = React.useCallback(() => {
      setLoadList(true);
    }, [setLoadList]);

    return [
      filter,
      setFilter,
      list,
      setList,
      loading,
      setLoading,
      handleSearch,
      total,
    ];
  }

  public useImport(
    onImport: (file: File, organizationId: number) => Promise<void>,
    setLoading: Dispatch<SetStateAction<boolean>>,
    organizationId?: number,
  ): [
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    () => void,
    RefObject<HTMLInputElement>,
    boolean,
    Dispatch<SetStateAction<boolean>>,
    string,
  ] {
    const [translate] = useTranslation();
    const ref: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
      null,
    );
    const [errVisible, setErrVisible] = React.useState<boolean>(false);
    const [errorModel, setErrorModel] = React.useState<string>();

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
          const file: File = event.target.files[0];
          setLoading(true);
          onImport(file, organizationId)
            .then(() => {
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
              notification.success({
                message: translate(generalLanguageKeys.update.requireRefresh),
              });
            })
            .catch((error: AxiosError<any>) => {
              setErrorModel(error.response.data);
              setErrVisible(true);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      },
      [onImport, setLoading, translate, organizationId],
    );

    const handleClick = React.useCallback(() => {
      ref.current.value = null;
    }, []);

    return [
      handleChange,
      handleClick,
      ref,
      errVisible,
      setErrVisible,
      errorModel,
    ];
  }
}

export const organizationService: OrganizationService = new OrganizationService();
