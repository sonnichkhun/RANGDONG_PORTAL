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
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
// Filter Class
import { PermissionFieldMappingFilter } from 'models/PermissionFieldMappingFilter';
// Mapping Class
import { Field } from 'models/Field';
import PermissionFieldMappingModal from 'views/PermissionView/PermissionDetail/PermissionFieldMappingModal/PermissionFieldMappingModal';
import { tableService } from 'services';

export interface PermissionFieldMappingTableProps {
  permission: Permission;

  setPermission: Dispatch<SetStateAction<Permission>>;
}

function PermissionFieldMappingTable(props: PermissionFieldMappingTableProps) {
  const [translate] = useTranslation();

  const { permission, setPermission } = props;

  const [
    permissionFieldMappings,
    setPermissionFieldMappings,
  ] = crudService.useContentTable<Permission, PermissionFieldMapping>(
    permission,
    setPermission,
    nameof(permission.permissionFieldMappings),
  );

  const [
    permissionFieldMappingFilter,
    setPermissionFieldMappingFilter,
  ] = React.useState<PermissionFieldMappingFilter>(
    new PermissionFieldMappingFilter(),
  );

  const [
    dataSource,
    pagination,
    ,
    handleTableChange,
  ] = tableService.useLocalTable<
    PermissionFieldMapping,
    PermissionFieldMappingFilter
  >(
    permissionFieldMappings,
    permissionFieldMappingFilter,
    setPermissionFieldMappingFilter,
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
    permissionRepository.listPermissionFieldMapping,
    permissionRepository.countPermissionFieldMapping,
    PermissionFieldMappingFilter,
  );

  const rowSelection = tableService.useModalRowSelection<
    Field,
    PermissionFieldMapping
  >(
    permission.id,
    nameof(permission),
    nameof(permissionFieldMappings[0].field),
    permissionFieldMappings,
    setPermissionFieldMappings,
  );

  // const rowSelection = tableService.useModalRowSelection<Field, PermissionFieldMapping>(
  //   permission.id,
  //   nameof(permission),
  //   nameof(permissionFieldMappings[0].field),
  //   permissionFieldMappings,
  //   setPermissionFieldMappings,
  // );

  const columns: ColumnProps<PermissionFieldMapping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PermissionFieldMapping>(pagination),
      },
      {
        title: translate('permissions.fields.permissionId'),
        key: nameof(dataSource[0].field.permissionId),
        dataIndex: nameof(dataSource[0].field),
        render(field: Field) {
          return field?.permissionId;
        },
      },
      {
        title: translate('permissions.fields.fieldId'),
        key: nameof(dataSource[0].field.fieldId),
        dataIndex: nameof(dataSource[0].field),
        render(field: Field) {
          return field?.fieldId;
        },
      },
      {
        title: translate('permissions.fields.value'),
        key: nameof(dataSource[0].field.value),
        dataIndex: nameof(dataSource[0].field),
        render(field: Field) {
          return field?.value;
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
        rowKey={nameof(permissionFieldMappings[0].fieldId)}
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
      <PermissionFieldMappingModal
        current={permissionFieldMappings}
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
export default PermissionFieldMappingTable;
