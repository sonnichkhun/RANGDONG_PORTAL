import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { formItemLayout } from 'config/ant-design/form';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService, formService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Field } from 'models/Field';
import { FieldFilter } from 'models/FieldFilter';
import { Menu } from 'models/Menu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContentTableProps } from 'react3l';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import './FieldTable.scss';

const { Item: FormItem } = Form;

function FieldTable(props: ContentTableProps<Menu, Field>) {
  const [translate] = useTranslation();

  const { model, setModel } = props;

  const [fields, , handleAdd, handleDelete] = crudService.useContentTable<
    Menu,
    Field
  >(model, setModel, nameof(model.fields));

  const [fieldFilter, setFieldFilter] = React.useState<FieldFilter>(
    new FieldFilter(),
  );

  const [
    dataSource,
    pagination,
    sorter,
    handleTableChange,
    handleFilter,
    handleSearch,
    handleReset,
  ] = tableService.useLocalTable(fields, fieldFilter, setFieldFilter);

  const columns: ColumnProps<Field>[] = React.useMemo(
    () => [
      {
        title: translate(generalLanguageKeys.columns.index),
        key: nameof(generalLanguageKeys.columns.index),
        width: generalColumnWidths.index,
        render: renderMasterIndex<Field>(pagination),
      },
      {
        title: translate('fields.id'),
        key: nameof(dataSource[0].id),
        dataIndex: nameof(dataSource[0].id),
        render: renderMasterIndex<Field>(pagination),
      },

      {
        title: translate('fields.name'),
        key: nameof(dataSource[0].name),
        dataIndex: nameof(dataSource[0].name),
        sorter: true,
        sortOrder: getOrderTypeForTable<Menu>(
          nameof(dataSource[0].name),
          sorter,
        ),
        render(name: any, field: Field) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Field>(
                field.errors,
                nameof(field.name),
              )}
              help={field.errors?.name}
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
        title: translate('fields.type'),
        key: nameof(dataSource[0].type),
        dataIndex: nameof(dataSource[0].type),
        sorter: true,
        sortOrder: getOrderTypeForTable<Menu>(
          nameof(dataSource[0].type),
          sorter,
        ),
        render(type: any, field: Field) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Field>(
                field.errors,
                nameof(field.type),
              )}
              help={field.errors?.type}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(type)}
                defaultValue={type}
              />
            </FormItem>
          );
        },
      },

      {
        title: translate('fields.isDeleted'),
        key: nameof(dataSource[0].isDeleted),
        dataIndex: nameof(dataSource[0].isDeleted),
        sorter: true,
        sortOrder: getOrderTypeForTable<Menu>(
          nameof(dataSource[0].isDeleted),
          sorter,
        ),
        render(isDeleted: any, field: Field) {
          return (
            <FormItem
              validateStatus={formService.getValidationStatus<Field>(
                field.errors,
                nameof(field.isDeleted),
              )}
              help={field.errors?.isDeleted}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                name={nameof(isDeleted)}
                defaultValue={isDeleted}
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
        render(...params: [Field, Field, number]) {
          return (
            <>
              <button
                className="btn btn-link mr-2"
                onClick={handleDelete(params[2])}
              >
                <i className="fa fa-trash text-danger" />
              </button>
            </>
          );
        },
      },
    ],
    [dataSource, handleDelete, pagination, sorter, translate],
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
        <Form {...formItemLayout}>
          <Row>
            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('fields.name')}>
                <AdvancedStringFilter
                  filterType={nameof(fieldFilter.name.startWith)}
                  filter={fieldFilter.name}
                  onChange={handleFilter(nameof(fieldFilter.name))}
                  className="w-100"
                />
              </FormItem>
            </Col>

            <Col className="pl-1" span={8}>
              <FormItem className="mb-0" label={translate('fields.type')}>
                <AdvancedStringFilter
                  filterType={nameof(fieldFilter.type.startWith)}
                  filter={fieldFilter.type}
                  onChange={handleFilter(nameof(fieldFilter.type))}
                  className="w-100"
                />
              </FormItem>
            </Col>

            <Col className="pl-1" span={8}>
              <FormItem
                className="mb-0"
                label={translate('fields.isDeleted')}
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
        footer={tableFooter}
      />
    </>
  );
}
export default FieldTable;
