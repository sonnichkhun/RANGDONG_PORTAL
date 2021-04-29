import { Card, Col, Form } from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { ORGANIZATION_DETAIL_ROUTE } from 'config/route-consts';
import { crudService, routerService } from 'core/services';
import { renderMasterIndex } from 'helpers/ant-design/table';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { organizationRepository } from 'views/OrganizationTreeView/OrganizationRepository';
import AppUserModal from '../OrganizationTreeDetail/AppUserModal/AppUserModal';
import OrganizationTree from './OrganizationTree/OrganizationTree';
import './OrganizationTreeMaster.scss';
import ImportErrorModal from 'components/ImportErrorModal/ImportErrorModal';
import { API_ORGANIZATION_ROUTE } from 'config/api-consts';
import { organizationService } from '../OrrganizationTreeService';

function OrganizationTreeMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction(
    'organization',
    API_ORGANIZATION_ROUTE,
    'portal',
  );

  const [
    filter,
    ,
    list,
    setList,
    loading,
    setLoading,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    handleDefaultSearch,
  ] = crudService.useMaster<Organization, OrganizationFilter>(
    Organization,
    OrganizationFilter,
    organizationRepository.count,
    organizationRepository.list,
    organizationRepository.get,
  );

  const [
    handleCreate,
    handleGoDetail,
    handleGoCreate,
  ] = routerService.useMasterNavigation(ORGANIZATION_DETAIL_ROUTE);

  const [listAppUser, setListAppUser] = React.useState<AppUser[]>([]);

  const [currentItem, setCurrentItem] = React.useState<Organization>(
    new Organization(),
  );

  const [handleDelete] = tableService.useDeleteHandler<Organization>(
    organizationRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [
    loadingAppUser,
    visibleAppUser,
    setVisibleProduct,
    listAppUser2,
    totalAppUser,
    handleOpenAppUser,
    ,
    filterAppUser,
    setFilterAppUser,
  ] = crudService.useContentModal(
    organizationRepository.listAppUser,
    organizationRepository.countAppUser,
    AppUserFilter,
  );
  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
    ,
    ,
    ,
  ] = tableService.useLocalTable(listAppUser, filterAppUser, setFilterAppUser);

  const [filterAppUserExport, setAppUserFilterExport] = React.useState<
    AppUserFilter
  >(new AppUserFilter());

  const [
    handleImport,
    handleClick,
    ref,
    errVisible,
    setErrVisible,
    errModel,
  ] = organizationService.useImport(
    organizationRepository.importAppUser,
    setLoading,
    currentItem?.id,
  );

  /**
   * If export
   */

  const [handleExport] = crudService.useExport(
    organizationRepository.exportAppUser,
    filterAppUserExport,
  );
  const listFilterType: any[] = React.useMemo(() => {
    return [
      {
        id: 1,
        name: translate('organizations.filter.all'),
      },
      {
        id: 2,
        name: translate('organizations.filter.parent'),
      },
      {
        id: 3,
        name: translate('organizations.filter.children'),
      },
    ];
  }, [translate]);
  const [filterTypeFilter, setFilterTypeFilter] = React.useState<number>(1);

  const [handleExportTemplate] = crudService.useExport(
    organizationRepository.exportTemplateAppUser,
    filter,
  );

  const handleGetDetail = React.useCallback(
    (id: number, filterType: number) => {
      const listAppUser = [];
      organizationRepository
        .get(id, filterType)
        .then(res => {
          if (res && res.appUsers && res.appUsers.length > 0) {
            res.appUsers.forEach(appUser => {
              listAppUser.push(appUser);
            });
            setListAppUser(listAppUser);
          } else {
            setListAppUser([]);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading, setListAppUser],
  );

  const handleCloseAppUser = React.useCallback(
    (currentItem: Organization) => {
      handleGetDetail(currentItem?.id, filterTypeFilter);
      setVisibleProduct(false);
    },
    [setVisibleProduct, handleGetDetail, filterTypeFilter],
  );

  const handleDeleteAppUser = React.useCallback(
    (id, current, currentItem) => {
      current.id = id;
      organizationRepository
        .deleteAppUser(current)
        .then(res => {
          if (res) {
            setVisibleProduct(false);
            handleGetDetail(currentItem.id, filterTypeFilter);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setVisibleProduct, setLoading, handleGetDetail, filterTypeFilter],
  );
  const columns: ColumnProps<AppUser>[] = React.useMemo(() => {
    return [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<AppUser>(pagination),
      },

      {
        title: translate('organizations.master.appUser.username'),
        key: nameof(dataSource[0].username),
        dataIndex: nameof(dataSource[0].username),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.displayName'),
        key: nameof(dataSource[0].displayName),
        dataIndex: nameof(dataSource[0].displayName),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.email'),
        key: nameof(dataSource[0].email),
        dataIndex: nameof(dataSource[0].email),
        ellipsis: true,
      },
      {
        title: translate('organizations.master.appUser.phone'),
        key: nameof(dataSource[0].phone),
        dataIndex: nameof(dataSource[0].phone),
        ellipsis: true,
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.columns.actions),
        dataIndex: nameof(dataSource[0].id),
        width: generalColumnWidths.actions,
        align: 'center',
        render(id: number, appUser: AppUser) {
          return (
            <div className="d-flex justify-content-center button-action-table">
              {validAction('deleteAppUser') && (
                <button
                  className="btn btn-sm btn-link "
                  onClick={() => handleDeleteAppUser(id, appUser, currentItem)}
                >
                  <i className="tio-delete_outlined" />
                </button>
              )}
            </div>
          );
        },
      },
    ];
  }, [
    currentItem,
    dataSource,
    handleDeleteAppUser,
    pagination,
    translate,
    validAction,
  ]);

  const handleActive = React.useCallback(
    (node: AppUser) => {
      setCurrentItem(node);
      filterAppUserExport.organizationId.equal = node.id;
      setAppUserFilterExport(filterAppUserExport);
      if (node.appUsers !== null) {
        setListAppUser(node.appUsers);
      } else {
        setListAppUser([]);
      }
      handleGetDetail(node.id, filterTypeFilter);
    },
    [
      setCurrentItem,
      setListAppUser,
      handleGetDetail,
      filterTypeFilter,
      filterAppUserExport,
      setAppUserFilterExport,
    ],
  );

  const handleSavePopup = React.useCallback(
    (event, currentItems) => {
      if (currentItems.appUsers === null) {
        currentItems.appUsers = [];
      }
      if (event) {
        event.forEach(element => {
          currentItems.appUsers.push(element);
        });
      }

      organizationRepository
        .update(currentItems)
        .then(res => {
          if (res) {
            setVisibleProduct(false);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setLoading, setVisibleProduct],
  );

  const handleFilterAppUser = React.useCallback(
    event => {
      currentItem.filterType = Number(event.equal);
      handleGetDetail(currentItem?.id, currentItem.filterType);
      setFilterTypeFilter(currentItem.filterType);
    },
    [currentItem, handleGetDetail],
  );
  return (
    <div className="page master-page">
      <Card
        className="organization-master"
        title={translate('organizations.master.title')}
      >
        <Col lg={12}>
          <div className="org-grouping">
            {validAction('create') && (
              <div className="mb-3">
                <span className="title-org">
                  {translate('organizations.master.grouping.title')}
                </span>
                <i
                  role="button"
                  className="tio-add  ml-2 color-primary"
                  onClick={handleCreate}
                />
              </div>
            )}
            <OrganizationTree
              tree={list}
              onAdd={handleGoCreate}
              onEdit={handleGoDetail}
              onDelete={handleDelete}
              onActive={handleActive}
              currentItem={currentItem}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className="flex-shrink-1 d-flex align-items-center">
            {currentItem && currentItem?.id && (
              <>
                <Form.Item
                  labelAlign="left"
                  className="mb-1 select"
                  label={translate('organizations.appUser')}
                >
                  <AdvancedIdFilter
                    filter={filter.filterType}
                    filterType={nameof(filter.filterType.equal)}
                    value={filterTypeFilter}
                    onChange={handleFilterAppUser}
                    allowClear={false}
                    list={listFilterType}
                  />
                </Form.Item>
                {validAction('listAppUser') && (
                  <button
                    className="btn btn-sm btn-primary mt-4 ml-1 mr-2 "
                    onClick={handleOpenAppUser}
                  >
                    <i className="tio-add mr-1" />
                    {translate('organizations.master.add')}
                  </button>
                )}
                {validAction('importAppUser') && (
                  <label
                    className="btn btn-sm btn-outline-primary mt-4 mr-2 mb-0 ml-1"
                    htmlFor="master-import"
                  >
                    <i className="tio-file_add_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.import)}
                  </label>
                )}
                <input
                  ref={ref}
                  type="file"
                  className="hidden"
                  id="master-import"
                  onChange={handleImport}
                  onClick={handleClick}
                />
                {validAction('exportAppUser') && (
                  <button
                    className="btn btn-sm btn-outline-primary mt-4 mr-2 "
                    onClick={handleExport}
                  >
                    <i className="tio-file_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.export)}
                  </button>
                )}
                {validAction('exportTemplateAppUser') && (
                  <button
                    className="btn btn-sm btn-export-template mt-4 mr-2 "
                    onClick={handleExportTemplate}
                  >
                    <i className="tio-download_outlined mr-2" />
                    {translate(generalLanguageKeys.actions.exportTemplate)}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="table-app-user">
            <div className="mb-3 title-org">
              {translate('organizations.master.appUser.title')}
            </div>
            <Table
              className="content-app-user"
              key={listAppUser[0]?.id}
              dataSource={listAppUser}
              columns={columns}
              bordered
              size="small"
              tableLayout="fixed"
              loading={loading}
              rowKey={nameof(dataSource[0].id)}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </div>

          <AppUserModal
            title={translate('organizations.master.appUser.title')}
            selectedList={listAppUser}
            setSelectedList={setListAppUser}
            list={listAppUser2}
            total={totalAppUser}
            isOpen={visibleAppUser}
            loading={loadingAppUser}
            toggle={handleCloseAppUser}
            onClose={handleCloseAppUser}
            onSave={handleSavePopup}
            currentItem={currentItem}
            isSave={true}
            pagination={pagination}
            dataSource={dataSource}
            getList={organizationRepository.listAppUser}
            count={organizationRepository.countAppUser}
          />
        </Col>
      </Card>
      {typeof errModel !== 'undefined' && (
        <ImportErrorModal
          errVisible={errVisible}
          setErrVisible={setErrVisible}
          errModel={errModel}
        />
      )}
    </div>
  );
}

export default OrganizationTreeMaster;
