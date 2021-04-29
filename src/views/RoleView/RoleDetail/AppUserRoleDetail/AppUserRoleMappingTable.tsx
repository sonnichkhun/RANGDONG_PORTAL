import Table, { ColumnProps } from 'antd/lib/table';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, tableService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { Role } from 'models/Role';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { roleRepository } from 'views/RoleView/RoleRepository';
import AppUserRoleMappingModal from './AppUserRoleMappingModal';
import '.././RoleDetail.scss';
import { API_ROLE_ROUTE } from 'config/api-consts';

export interface AppUserRoleMappingTableProps {
  role: Role;
  setRole: Dispatch<SetStateAction<Role>>;
}

function AppUserRoleMappingTable(props: AppUserRoleMappingTableProps) {
  const [translate] = useTranslation();

  const { role, setRole } = props;
  const { validAction } = crudService.useAction('role', API_ROLE_ROUTE, 'portal');
  const [
    appUserRoleMappings,
    setAppUserRoleMappings,
  ] = crudService.useContentTable<Role, AppUserRoleMapping>(
    role,
    setRole,
    nameof(role.appUserRoleMappings),
  );

  const [appUsers, setAppUsers] = React.useState<AppUser[]>([]);
  const [appUserFilter, setAppUserFilter] = React.useState<AppUserFilter>(
    new AppUserFilter(),
  );
  const [isChangeSelectedList, setIsChangeSelectedList] = React.useState<
    boolean
  >(false);

  React.useEffect(() => {
    if (appUserRoleMappings.length > 0) {
      const appUsers = appUserRoleMappings.map(item => item.appUser);
      setAppUsers(appUsers);
    }
  }, [appUserRoleMappings, role]);

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<AppUser, AppUserFilter>(
    appUsers,
    appUserFilter,
    setAppUserFilter,
  );

  const [
    loading,
    visible,
    ,
    list,
    total,
    handleOpen,
    handleClose,
    filter,
    setFilter,
    setList,
  ] = crudService.useContentModal(
    roleRepository.listAppUser,
    roleRepository.countAppUser,
    AppUserFilter,
  );

  const rowSelection = tableService.useModalRowSelection<
    AppUser,
    AppUserRoleMapping
  >(
    role.id,
    nameof(role),
    nameof(appUserRoleMappings[0].appUser),
    appUserRoleMappings,
    setAppUserRoleMappings,
  );

  const handleValueFilter = React.useCallback(
    (field: string) => (ev: React.ChangeEvent<HTMLInputElement>) => {
      appUserFilter[field].contain = ev.target.value;
      const { skip, take } = AppUserFilter.clone<AppUserFilter>(
        new AppUserFilter(),
      );
      setAppUserFilter(
        AppUserFilter.clone<AppUserFilter>({
          ...filter,
          skip,
          take,
        }),
      );
    },
    [appUserFilter, filter],
  );

  const handleDelete = React.useCallback(
    (index: number) => {
      return () => {
        appUsers.splice(index, 1);
        setAppUsers([...appUsers]);
        appUserRoleMappings.splice(index, 1);
        setAppUserRoleMappings([...appUserRoleMappings]);
      };
    },
    [appUserRoleMappings, appUsers, setAppUserRoleMappings],
  );
  const handleAddUser = React.useCallback(() => {
    handleOpen();
    setIsChangeSelectedList(true);
  }, [handleOpen, setIsChangeSelectedList]);
  const columns: ColumnProps<AppUser>[] = React.useMemo(
    () => [
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.columns.index)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.username')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.username))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        render(...[, appUser]) {
          return appUser?.username;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.displayName')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.displayName))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        render(...[, appUser]) {
          return appUser?.displayName;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.phone')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.phone))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        render(...[, appUser]) {
          return appUser?.phone;
        },
      },
      {
        title: () => (
          <>
            <div>{translate('appUsers.email')}</div>
            <input
              type="text"
              onChange={handleValueFilter(nameof(appUserFilter.email))}
              className="form-control form-control-sm mt-2 mb-2"
            />
          </>
        ),
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        render(...[, appUser]) {
          return appUser?.email;
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate('appUsers.status')}
          </div>
        ),
        key: nameof(dataSource[0].status),
        dataIndex: nameof(dataSource[0].status),
        align: 'center',
        render(...[, appUser]) {
          return (
            <div className={appUser.statusId === 1 ? 'active' : ''}>
              <i className="fa fa-check-circle d-flex justify-content-center"></i>
            </div>
          );
        },
      },
      {
        title: () => (
          <div className="table-title-header">
            {translate(generalLanguageKeys.actions.label)}
          </div>
        ),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(list[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(...[, , index]) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              <button
                className="btn btn-sm btn-link"
                onClick={handleDelete(index)}
              >
                <i className="tio-delete_outlined" />
              </button>
            </div>
          );
        },
      },
    ],
    [
      appUserFilter.displayName,
      appUserFilter.email,
      appUserFilter.phone,
      appUserFilter.username,
      dataSource,
      handleDelete,
      handleValueFilter,
      list,
      pagination,
      translate,
    ],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={nameof(appUserRoleMappings[0].key)}
        onChange={handleTableChange}
        title={() => (
          <>
            <div className="d-flex d-flex justify-content-between ml-2">
              <div className="flex-shrink-1 d-flex align-items-center">
                {validAction('listAppUser') && (
                  <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleAddUser}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate('roles.addAppUsers')}
                  </button>
                )}
                {/* <label
                  className="btn btn-sm btn-outline-primary mr-2 mb-0"
                  htmlFor="master-import"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.085"
                    height="12.893"
                    viewBox="0 0 19.085 12.893"
                  >
                    <path
                      fill="#ee534d"
                      className="a"
                      d="M535.168,262.972a7.2,7.2,0,0,0-.208-1.031c-.045-.165-.1-.326-.151-.488-.026-.076-.053-.153-.081-.227-.014-.039-.03-.076-.044-.112a.585.585,0,0,0-.024-.06c0-.007-.007-.014-.012-.027a5.973,5.973,0,0,0-.471-.876,4.3,4.3,0,0,0-.59-.727c-.11-.114-.227-.22-.348-.323-.03-.027-.06-.05-.092-.075l-.014-.011c-.005-.005-.015-.012-.028-.021-.073-.055-.151-.106-.226-.156a3.7,3.7,0,0,0-.417-.234,3.93,3.93,0,0,0-.467-.2,5.3,5.3,0,0,0-1.048-.295l-.02,0-.083-.01c-.073-.007-.145-.009-.217-.013-.136-.006-.263-.018-.4-.035a.417.417,0,0,1-.407-.412v-1.281c-.637.482-1.269.952-1.9,1.427-.664.5-1.329,1-1.99,1.507l3.9,2.895c-.012-.471-.021-.942-.032-1.412a.41.41,0,0,1,.3-.4,4.4,4.4,0,0,1,.983-.092,3.732,3.732,0,0,1,1.023.183,5.044,5.044,0,0,1,1.708,1.025,8.236,8.236,0,0,1,1.294,1.483c.02.028.042.057.06.086C535.174,263.031,535.172,263,535.168,262.972Z"
                      transform="translate(-516.091 -255.372)"
                    />
                    <path
                      fill="#ee534d"
                      className="a"
                      d="M77.237,220.837a1.374,1.374,0,0,1-1.373,1.356H67.611a1.377,1.377,0,0,1-1.377-1.376v-8.252a1.377,1.377,0,0,1,1.377-1.376h8.252a1.349,1.349,0,0,1,1.055.528c.329-.249.662-.5.994-.749a1.605,1.605,0,0,0-1.34-.723H66.9a1.613,1.613,0,0,0-1.613,1.611v9.67a1.613,1.613,0,0,0,1.613,1.611h9.669a1.61,1.61,0,0,0,1.609-1.588v-3.891l-.944-.7v3.88Z"
                      transform="translate(-65.29 -210.244)"
                    />
                    <path
                      fill="#ee534d"
                      className="a"
                      d="M254.106,395.7l-.838,1.242-.839-1.242h-1.646l1.646,2.485-1.646,2.485h1.646l.839-1.243.838,1.243h1.647l-1.647-2.485s1.646-2.472,1.661-2.485Z"
                      transform="translate(-246.821 -391.735)"
                    />
                  </svg>
                  {translate(generalLanguageKeys.actions.import)}
                </label>
                <button
                  className="btn btn-sm btn-outline-primary mr-2"
                  onClick={handleExport}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.125"
                    height="13.247"
                    viewBox="0 0 19.125 13.247"
                  >
                    <path
                      className="a"
                      fill="#ee534d"
                      d="M84.416,206.816c-.679-.519-1.362-1.032-2.045-1.547-.647-.488-1.3-.971-1.951-1.467v1.315a.429.429,0,0,1-.418.424c-.141.016-.272.029-.412.035-.074,0-.147.007-.223.014l-.085.01-.022,0a5.54,5.54,0,0,0-1.077.3,4.176,4.176,0,0,0-.479.205,3.927,3.927,0,0,0-.428.24c-.078.052-.157.1-.232.162a.26.26,0,0,0-.028.022l-.015.011c-.032.026-.063.05-.095.078-.123.1-.244.214-.358.331a4.448,4.448,0,0,0-.605.747,6.186,6.186,0,0,0-.486.9c0,.012-.009.02-.011.027a.606.606,0,0,0-.025.061c-.016.037-.031.075-.046.114-.028.077-.057.155-.083.234-.057.165-.11.331-.156.5a7.615,7.615,0,0,0-.214,1.06c0,.031-.005.061-.007.09.019-.029.04-.059.062-.089a8.52,8.52,0,0,1,1.329-1.523,5.209,5.209,0,0,1,1.755-1.053,3.846,3.846,0,0,1,1.052-.187,4.582,4.582,0,0,1,1.01.094.421.421,0,0,1,.312.409c-.012.485-.022.968-.033,1.452Q82.411,208.3,84.416,206.816Zm-6.851,1.991v4.674a1.412,1.412,0,0,1-1.411,1.393H67.675a1.415,1.415,0,0,1-1.415-1.414v-8.479a1.415,1.415,0,0,1,1.415-1.414h8.479a1.411,1.411,0,0,1,1.411,1.393v.621c.123-.052.245-.1.4-.161.186-.07.377-.129.567-.191v-1a1.654,1.654,0,0,0-1.653-1.632H66.948a1.658,1.658,0,0,0-1.657,1.656v9.935a1.658,1.658,0,0,0,1.657,1.656h9.934a1.655,1.655,0,0,0,1.653-1.632v-5.682a6.03,6.03,0,0,0-.754.19C77.708,208.744,77.638,208.779,77.565,208.807Zm-4.789-2.139-.862,1.276-.861-1.276H69.362l1.692,2.553-1.692,2.553h1.692l.861-1.277.862,1.277h1.691l-.326-.492-.675-.983c0-.007-.69-1.078-.69-1.078l1.691-2.553Z"
                      transform="translate(-65.291 -202.597)"
                    />
                  </svg>
                  {translate(generalLanguageKeys.actions.export)}
                </button>
                <button
                  className="btn btn-sm btn-export-template mr-2"
                  onClick={handleExportTemplate}
                >
                  <i className="fa mr-2 fa-download" />
                  {translate(generalLanguageKeys.actions.exportTemplate)}
                </button> */}
              </div>
              <div className="flex-shrink-1 d-flex align-items-center">
                {translate('general.master.pagination', {
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                })}
              </div>
            </div>
          </>
        )}
      />
      <AppUserRoleMappingModal
        list={list}
        setList={setList}
        getList={roleRepository.listAppUser}
        total={total}
        loading={loading}
        isOpen={visible}
        modelFilter={filter}
        setModelFilter={setFilter}
        rowSelection={rowSelection}
        onClose={handleClose}
        isChangeSelectedList={isChangeSelectedList}
        setIsChangeSelectedList={setIsChangeSelectedList}
      />
    </>
  );
}

export default AppUserRoleMappingTable;
