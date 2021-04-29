import React, { Dispatch, SetStateAction } from 'react';
import { crudService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { renderMasterIndex } from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';

// Parent Repo
import { permissionRepository } from 'views/PermissionView/PermissionRepository';
// Parent Class
import { Permission } from 'models/Permission';
// Class
import { PermissionPageMapping } from 'models/PermissionPageMapping';
// Filter Class
import { PermissionPageMappingFilter } from 'models/PermissionPageMappingFilter';
// Mapping Class
import { Page } from 'models/Page';
import PermissionPageMappingModal from 'views/PermissionView/PermissionDetail/PermissionPageMappingModal/PermissionPageMappingModal';
import { tableService } from 'services';

export interface PermissionPageMappingTableProps {
  permission: Permission;

  setPermission: Dispatch<SetStateAction<Permission>>;
}

function PermissionPageMappingTable(props: PermissionPageMappingTableProps) {
  const [translate] = useTranslation();

  const { permission, setPermission } = props;

  const [
    permissionPageMappings,
    setPermissionPageMappings,
  ] = crudService.useContentTable<Permission, PermissionPageMapping>(
    permission,
    setPermission,
    nameof(permission.permissionPageMappings),
  );

  const [
    permissionPageMappingFilter,
    setPermissionPageMappingFilter,
  ] = React.useState<PermissionPageMappingFilter>(
    new PermissionPageMappingFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<
    PermissionPageMapping,
    PermissionPageMappingFilter
  >(
    permissionPageMappings,
    permissionPageMappingFilter,
    setPermissionPageMappingFilter,
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
  ] = crudService.useContentModal(
    permissionRepository.listPermissionPageMapping,
    permissionRepository.countPermissionPageMapping,
    PermissionPageMappingFilter,
  );

  const rowSelection = tableService.useModalRowSelection<
    Page,
    PermissionPageMapping
  >(
    permission.id,
    nameof(permission),
    nameof(permissionPageMappings[0].page),
    permissionPageMappings,
    setPermissionPageMappings,
  );

  // const rowSelection = tableService.useModalRowSelection<Page, PermissionPageMapping>(
  //   permission.id,
  //   nameof(permission),
  //   nameof(permissionPageMappings[0].page),
  //   permissionPageMappings,
  //   setPermissionPageMappings,
  // );

  const columns: ColumnProps<PermissionPageMapping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PermissionPageMapping>(pagination),
      },
      {
        title: translate('permissions.pages.permissionId'),
        key: nameof(dataSource[0].page.permissionId),
        dataIndex: nameof(dataSource[0].page),
        render(page: Page) {
          return page?.permissionId;
        },
      },
      {
        title: translate('permissions.pages.pageId'),
        key: nameof(dataSource[0].page.pageId),
        dataIndex: nameof(dataSource[0].page),
        render(page: Page) {
          return page?.pageId;
        },
      },
    ],
    [dataSource, pagination, translate],
  );

  return (
    <>
      <Table
        tableLayout="fixed"
        bordered={true}
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowKey={nameof(permissionPageMappings[0].pageId)}
        onChange={handleTableChange}
        title={() => (
          <>
            <div className="d-flex justify-content-end">
              <button className="btn btn-sm btn-primary" onClick={handleOpen}>
                <i className="fa fa-plus mr-2" />
                {translate(generalLanguageKeys.actions.add)}
              </button>
            </div>
          </>
        )}
      />
      <PermissionPageMappingModal
        current={permissionPageMappings}
        list={list}
        total={total}
        loading={loading}
        isOpen={visible}
        modelFilter={filter}
        setModelFilter={setFilter}
        rowSelection={rowSelection}
        onClose={handleClose}
      />
    </>
  );
}
export default PermissionPageMappingTable;
