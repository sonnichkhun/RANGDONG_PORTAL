import React from 'react';
import { ContentTableProps } from 'react3l';
import { crudService, formService } from 'core/services';
import Table, { ColumnProps } from 'antd/lib/table';
import { tableService } from 'services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import nameof from 'ts-nameof.macro';
import { useTranslation } from 'react-i18next';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import Form from 'antd/lib/form';
import { formItemLayout } from 'config/ant-design/form';
import { Col, Row } from 'antd/lib/grid';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';

import { fieldRepository } from 'views/FieldView/FieldRepository';
import { Field } from 'models/Field';
import { PermissionFieldMapping } from 'models/PermissionFieldMapping';
import { PermissionFieldMappingFilter } from 'models/PermissionFieldMappingFilter';
import PermissionFieldMappingModal from 'views/FieldView/FieldDetail/PermissionFieldMappingModal/PermissionFieldMappingModal';
const { Item: FormItem } = Form;

function PermissionFieldMappingTable(
  props: ContentTableProps<Field, PermissionFieldMapping>,
) {
  const [translate] = useTranslation();

  const { model, setModel } = props;

  const [
    permissionFieldMappings,
    setPermissionFieldMappings,
    handleAdd,
    handleDelete,
  ] = crudService.useContentTable<Field, PermissionFieldMapping>(
    model,
    setModel,
    nameof(model.permissionFieldMappings),
  );

  const [
    loading,
    visible,
    ,
    list,
    total,
    handleOpen,
    handleClose,
    permissionFieldMappingFilter,
    setPermissionFieldMappingFilter,
  ] = crudService.useContentModal(
    fieldRepository.listPermissionFieldMapping,
    fieldRepository.countPermissionFieldMapping,
    PermissionFieldMappingFilter,
  );

  const [
    dataSource,
    pagination,
    sorter,
    handleTableChange,
    handleFilter,
    handleSearch,
    handleReset,
  ] = tableService.useLocalTable(
    permissionFieldMappings,
    permissionFieldMappingFilter,
    setPermissionFieldMappingFilter,
  );

  const columns: ColumnProps<PermissionFieldMapping>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<PermissionFieldMapping>(pagination),
      },
      {
        title: translate('permissionFieldMappings.id'),
        key: nameof(dataSource[0].id),
        dataIndex: nameof(dataSource[0].id),
        render: renderMasterIndex<PermissionFieldMapping>(pagination),
      },
      {
        title: translate('permissionFieldMappings.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Field>(
          nameof(dataSource[0].name),
          sorter,
        ),
        render(name: string, permissionFieldMapping: PermissionFieldMapping) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<
                PermissionFieldMapping
              >(
                permissionFieldMapping.errors,
                nameof(permissionFieldMapping.name),
              )}
              help={permissionFieldMapping.errors?.name}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(name)}
                defaultValue={name}
              />
            </FormItem>
          );
        },
      },
      {
        title: translate(generalLanguageKeys.actions.label),
        key: nameof(generalLanguageKeys.actions),
        width: generalColumnWidths.actions,
        align: 'center',
        render(
          ...params: [PermissionFieldMapping, PermissionFieldMapping, number]
        ) {
          return (
            <>
              <button
                className="btn btn-link mr-2"
                onClick={handleDelete(params[2])}
              >
                <i className="tio-delete_outlined" />
              </button>
            </>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, sorter, translate],
  );
  const tableTitle = React.useCallback(
    () => (
      <button className="btn btn-sm btn-primary" onClick={handleOpen}>
        <i className="fa fa-plus mr-2" />
        {translate(generalLanguageKeys.actions.add)}
      </button>
    ),
    [handleOpen, translate],
  );
  const tableFooter = React.useCallback(
    () => (
      <>
        <button className="btn btn-link" onClick={handleAdd}>
          <i className="fa fa-plus mr-2" />
          {translate(generalLanguageKeys.actions.create)}
        </button>
      </>
    ),
    [handleAdd, translate],
  );

  return (
    <>
      <CollapsibleCard
        title={translate(generalLanguageKeys.actions.search)}
        className="mb-4"
      >
        <PermissionFieldMappingModal
          title={translate('field.permissionFieldMappingModal.title')}
          selectedList={permissionFieldMappings}
          setSelectedList={setPermissionFieldMappings}
          list={list}
          total={total}
          isOpen={visible}
          loading={loading}
          toggle={handleClose}
          onClose={handleClose}
          filter={permissionFieldMappingFilter}
          setFilter={setPermissionFieldMappingFilter}
        />
        <Form {...formItemLayout}>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('fields.id')}
              ></FormItem>
            </Col>
          </Row>
        </Form>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-primary mr-2"
            onClick={handleSearch}
          >
            <i className="fa fa-search mr-2" />
            {translate(generalLanguageKeys.actions.filter)}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary text-dark"
            onClick={handleReset}
          >
            <i className="fa mr-2 fa-times" />
            {translate(generalLanguageKeys.actions.reset)}
          </button>
        </div>
      </CollapsibleCard>
      <Table
        pagination={pagination}
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        tableLayout="fixed"
        bordered={true}
        size="small"
        title={tableTitle}
        footer={tableFooter}
      />
    </>
  );
}

export default PermissionFieldMappingTable;
