import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import { AxiosError } from 'axios';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedTreeFilter from 'components/AdvancedTreeFilter/AdvancedTreeFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { API_APP_USER_PORTAL_ROUTE } from 'config/api-consts';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { APP_USER_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { notification } from 'helpers/notification';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { AppUserRoleMapping } from 'models/AppUserRoleMapping';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Role } from 'models/Role';
import { Status } from 'models/Status';
import { StatusFilter } from 'models/StatusFilter';
import React from 'react';
import Avatar, { ConfigProvider } from 'react-avatar';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import AppUserPreview from 'views/AppUserView/AppUserMaster/AppUserPreview';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import { appUserService } from '../AppUserService';
import './AppUserMaster.scss';
import ChangePasswordModal from './Modal/ChangePasswordModal';
import ChangeRoleModal from './Modal/ChangeRoleModal';
import InactiveModal from './Modal/InactiveModal';

const { Item: FormItem } = Form;

function AppUserMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('app-user', API_APP_USER_PORTAL_ROUTE, 'portal');
  const [
    filter,
    setFilter,
    list,
    setList,
    loading,
    setLoading,
    total,
    previewLoading,
    previewVisible,
    previewModel,
    handleOpenPreview,
    handleClosePreview,
    handleFilter,
    handleSearch,
    handleReset,
    isReset,
    setIsReset,
    handleDefaultSearch,
  ] = crudService.useMaster<AppUser, AppUserFilter>(
    AppUser,
    AppUserFilter,
    appUserRepository.count,
    appUserRepository.list,
    appUserRepository.get,
  );

  const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
    APP_USER_DETAIL_ROUTE,
  );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  /**
   * If import
   */
  const [handleImport, handleClick, ref] = crudService.useImport(
    appUserRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(
    appUserRepository.export,
    filter,
  );

  const [handleExportTemplate] = crudService.useExport(
    appUserRepository.exportTemplate,
    filter,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------
  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(
    new StatusFilter(),
  );
  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<AppUser>(
    appUserRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [visibleInactive, setVisibleInactive] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<AppUser>(new AppUser());
  const [isDetailActive, setIsDetailActive] = React.useState<boolean>(false);

  const [
    loadingRole,
    setLoadingRole,
    visibleRole,
    setVisibleRole,
  ] = appUserService.useAppUserModal(
    appUserRepository.listRole,
    appUserRepository.countRole,
    currentItem,
  );

  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const handlePopupCancelInactive = React.useCallback(() => {
    setVisibleInactive(false);
  }, [setVisibleInactive]);

  const handleGoModalPassword = React.useCallback(
    (appUser: AppUser) => {
      setCurrentItem(appUser);
      setVisible(true);
    },
    [setCurrentItem, setVisible],
  );

  const handleGoModalInactive = React.useCallback(
    (appUser: AppUser) => {
      setCurrentItem(appUser);
      setVisibleInactive(true);
      setIsDetailActive(true);
    },
    [setCurrentItem, setIsDetailActive, setVisibleInactive],
  );

  const handleSavePopup = React.useCallback(
    currentItem => {
      return () => {
        if (currentItem.statusId === 1) {
          currentItem.statusId = 0;
        } else {
          currentItem.statusId = 1;
        }
        appUserRepository
          .update(currentItem)
          .then(res => {
            if (res) {
              setVisibleInactive(false);
              handleSearch();
            }
          })
          .finally(() => {
            setLoading(false);
          });
      };
    },
    [handleSearch, setLoading],
  );

  const handleSavePopupPassword = React.useCallback(
    currentItem => {
      return () => {
        setCurrentItem({
          ...currentItem,
        });
        appUserRepository
          .changePassword(currentItem)
          .then(res => {
            if (res) {
              setVisible(false);
              handleSearch();
            }
          })
          .finally(() => {
            setLoading(false);
          });
      };
    },
    [handleSearch, setLoading],
  );

  // role modal

  const handleOpenRole = React.useCallback((id: number) => {
    return () => {
      appUserRepository.get(id)
        .then((user => {
          setCurrentItem({ ...user });
          setVisibleRole(true);
        }));
    };
  }, [setCurrentItem, setVisibleRole]);
  const handleCloseRole = React.useCallback(() => {
    setVisibleRole(false);
  }, [setVisibleRole]);

  const handleSaveRole = React.useCallback(
    (list) => {
      if (currentItem?.appUserRoleMappings) {
        if (list && list?.length > 0) {
          const listRoleIds = list.map(role => role.id);
          const usedRoleIds = currentItem.appUserRoleMappings.map(content => content.roleId);
          list.forEach((i: Role) => {
            const content = new AppUserRoleMapping();
            content.role = i;
            content.roleId = i?.id;
            if (currentItem.appUserRoleMappings.length > 0) {
              // add unused role
              if (!usedRoleIds.includes(i.id)) {
                currentItem.appUserRoleMappings.push(content);
              }
            } else {
              currentItem.appUserRoleMappings.push(content);
            }
          });
          // remove content which used removed role
          const newContents = currentItem.appUserRoleMappings.filter(content => listRoleIds.includes(content.roleId));
          currentItem.appUserRoleMappings = newContents;
          setCurrentItem(currentItem);
        } else {
          // if no role selected, remove all contents
          currentItem.appUserRoleMappings = [];
          setCurrentItem({
            ...currentItem,
          });

        }
        appUserRepository.update(currentItem)
          .then((item) => {
            setCurrentItem({ ...item });
            setTimeout(() => {
              notification.success({
                message: translate(generalLanguageKeys.update.success),
              });
            }, 0);
            setVisibleRole(false);
          }).finally(() => {
            setLoadingRole(false);
          })
          .catch((error: AxiosError<AppUser>) => {
            if (error.response && error.response.status === 400) {
              setCurrentItem(error.response?.data);
            }
            notification.error({
              message: translate(generalLanguageKeys.update.error),
              description: error.message,
            });
          });
      }
    },
    [currentItem, setLoadingRole, setVisibleRole, translate],
  );

  const columns: ColumnProps<AppUser>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<AppUser>(pagination),
        },
        {
          title: translate('appUsers.avatar'),
          key: nameof(list[0].avatar),
          dataIndex: nameof(list[0].avatar),
          sorter: true,
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].avatar),
            sorter,
          ),
          align: 'center',
          render(avatar: string, appUser: AppUser) {
            return (
              <div className="button-hover">
                {avatar && <img src={avatar} className="image" alt="" />}
                {!avatar &&
                  <ConfigProvider colors={['#ef5e5e', '#6fde6f', '#3c3c5f38']}>
                    <Avatar maxInitials={1} round={true} size="40" name={appUser?.displayName} />
                  </ConfigProvider>}
              </div>
            );
          },
        },
        {
          title: translate('appUsers.username'),
          key: nameof(list[0].username),
          dataIndex: nameof(list[0].username),
          sorter: true,
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].username),
            sorter,
          ),
          render(username: string, appUser: AppUser) {
            return <div className="display-username"
              onClick={handleOpenPreview(appUser.id)}
            >
              {username}
            </div>;
          },
        },
        {
          title: translate('appUsers.displayName'),
          key: nameof(list[0].displayName),
          dataIndex: nameof(list[0].displayName),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].displayName),
            sorter,
          ),
        },

        {
          title: translate('appUsers.organization'),
          key: nameof(list[0].organization),
          dataIndex: nameof(list[0].organization),
          sorter: true,
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].organization),
            sorter,
          ),
          render(organization: Organization) {
            return organization?.name;
          },
        },
        {
          title: translate('appUsers.phone'),
          key: nameof(list[0].phone),
          dataIndex: nameof(list[0].phone),
          sorter: true,
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].phone),
            sorter,
          ),
        },
        {
          title: translate('appUsers.email'),
          key: nameof(list[0].email),
          dataIndex: nameof(list[0].email),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].email),
            sorter,
          ),
        },

        {
          title: translate('appUsers.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          sorter: true,
          align: 'center',
          sortOrder: getOrderTypeForTable<AppUser>(
            nameof(list[0].status),
            sorter,
          ),
          render(status: Status) {
            return (
              <div className={status?.id === 1 ? 'active' : ''}>
                <i className="fa fa-check-circle d-flex justify-content-center"></i>
              </div>
            );
          },
        },

        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, appUser: AppUser) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('update') &&
                  <Tooltip title={translate('appUsers.tooltip.role')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenRole(id)}
                    >
                      <i className="tio-user_outlined" />
                    </button>
                  </Tooltip>
                }
                {validAction('changePassword') &&
                  <Tooltip title={translate('appUsers.tooltip.changePassword')}>
                    <button
                      className="btn btn-sm btn-link "
                      onClick={() => handleGoModalPassword(appUser)}
                    >
                      <i className="tio-key" />
                    </button>
                  </Tooltip>
                }
                {validAction('update') &&
                  <Tooltip title={appUser.statusId === 1 ? translate('appUsers.tooltip.inactive') : translate('appUsers.tooltip.active')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoModalInactive(appUser)}
                    >
                      <i className={appUser.statusId === 1 ? 'tio-lock_outlined' : 'tio-lock_open_outlined'} />
                    </button>
                  </Tooltip>
                }
                {validAction('get') &&
                  <Tooltip title={translate('appUsers.tooltip.view')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                }
                {validAction('update') &&
                  <Tooltip title={translate('appUsers.tooltip.edit')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleGoDetail(id)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!appUser.used && validAction('delete') &&

                  <Tooltip title={translate('appUsers.tooltip.delete')}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={handleDelete(appUser)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                }
              </div>
            );
          },
        },
      ];
    },
    [
      handleDelete,
      handleGoDetail,
      handleGoModalInactive,
      handleGoModalPassword,
      handleOpenPreview,
      handleOpenRole,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );
  return (
    <div className="page master-page">
      <Card title={translate('appUsers.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.username')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.username.contain)}
                    filter={filter.username}
                    onChange={handleFilter(nameof(filter.username))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.username')}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStatus') &&
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('appUsers.status')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      onChange={handleFilter(nameof(filter.statusId))}
                      getList={appUserRepository.filterListStatus}
                      modelFilter={statusFilter}
                      setModelFilter={setStatusFilter}
                      searchField={nameof(statusFilter.name)}
                      searchType={nameof(statusFilter.name.contain)}
                      placeholder={translate('general.placeholder.title')}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      allowClear={true}
                    />
                  </FormItem>
                </Col>
              }
              {validAction('filterListOrganization') &&
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-0"
                    label={translate('appUsers.organization')}
                    labelAlign="left"
                  >
                    <AdvancedTreeFilter
                      filter={filter.organizationId}
                      filterType={nameof(filter.organizationId.equal)}
                      value={filter.organizationId.equal}
                      onChange={handleFilter(nameof(filter.organizationId))}
                      getList={appUserRepository.filterListOrganization}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      allowClear={true}
                      placeholder={translate('appUsers.placeholder.organization')}
                      mode="single"
                    />
                  </FormItem>
                </Col>
              }
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.email')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.email.contain)}
                    filter={filter.email}
                    onChange={handleFilter(nameof(filter.email))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.email')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.displayName')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.displayName.contain)}
                    filter={filter.displayName}
                    onChange={handleFilter(nameof(filter.displayName))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.displayName')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('appUsers.phone')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.phone.contain)}
                    filter={filter.phone}
                    onChange={handleFilter(nameof(filter.phone))}
                    className="w-100"
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('appUsers.placeholder.phone')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-start mt-3 mb-3 btn-filter">
            {validAction('list') &&
              <>
                <button
                  className="btn btn-sm btn-primary mr-2"
                  onClick={handleDefaultSearch}
                >
                  <i className="tio-filter_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.filter)}
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleReset}
                >
                  <i className="tio-clear_circle_outlined mr-2" />
                  {translate(generalLanguageKeys.actions.reset)}
                </button>
              </>
            }
          </div>

        </CollapsibleCard>
        <Table
          dataSource={list}
          columns={columns}
          size="small"
          tableLayout="fixed"
          loading={loading}
          rowKey={nameof(previewModel.id)}
          pagination={pagination}
          onChange={handleTableChange}
          className="table-none-row-selection"
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') &&
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleGoCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  }
                  {validAction('import') &&
                    <label
                      className="btn btn-sm btn-outline-primary mr-2 mb-0"
                      htmlFor="master-import"
                    >
                      <i className="tio-file_add_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.import)}
                    </label>
                  }
                  {validAction('export') &&
                    <button
                      className="btn btn-sm btn-outline-primary mr-2"
                      onClick={handleExport}
                    >
                      <i className="tio-file_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.export)}
                    </button>
                  }
                  {validAction('exportTemplate') &&
                    <button
                      className="btn btn-sm mr-2 btn-export-template"
                      onClick={handleExportTemplate}
                    >
                      <i className="tio-download_outlined mr-2" />
                      {translate(generalLanguageKeys.actions.exportTemplate)}
                    </button>
                  }
                </div>
                <div className="flex-shrink-1 d-flex align-items-center">
                  {translate('general.master.pagination', {
                    pageSize: pagination.pageSize,
                    total,
                  })}
                </div>
              </div>
            </>
          )}
        />
        <input
          ref={ref}
          type="file"
          className="hidden"
          id="master-import"
          onChange={handleImport}
          onClick={handleClick}
        />
        <AppUserPreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
        />
        {visible === true && (
          <ChangePasswordModal
            visible={visible}
            setVisible={setVisible}
            getListAppUser={appUserRepository.list}
            setListAppUser={setList}
            currentItem={currentItem}
            onClose={handlePopupCancel}
            onSave={handleSavePopupPassword(currentItem)}
            setCurrentItem={setCurrentItem}
          />
        )}
        {visibleInactive === true && (
          <InactiveModal
            isDetail={isDetailActive}
            visible={visibleInactive}
            currentItem={currentItem}
            getListAppUser={appUserRepository.list}
            setListAppUser={setList}
            onSave={handleSavePopup(currentItem)}
            onClose={handlePopupCancelInactive}
          />
        )}

        <ChangeRoleModal
          model={currentItem}
          isOpen={visibleRole}
          loading={loadingRole}
          onClose={handleCloseRole}
          onSave={handleSaveRole}
        />
      </Card>
    </div>
  );
}

export default AppUserMaster;
