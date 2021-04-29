import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { provinceRepository } from 'views/ProvinceView/ProvinceRepository';
import { ProvinceDetail } from '../ProvinceView';
import './ProvinceMaster.scss';
import { Tooltip } from 'antd';
import ProvincePreview from 'views/ProvinceView/ProvinceMaster/ProvincePreview';
import { API_PROVINCE_ROUTE } from 'config/api-consts';

// import icon-unfilter
const { Item: FormItem } = Form;

function ProvinceMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('province', API_PROVINCE_ROUTE, 'portal');
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
    setLoadList,
  ] = crudService.useMaster<Province, ProvinceFilter>(
    Province,
    ProvinceFilter,
    provinceRepository.count,
    provinceRepository.list,
    provinceRepository.get,
  );
  // const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
  //   PROVINCE_ROUTE,
  // );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<Province>();

  /**
   * If import
   */
  const [handleImport, handleClick, ref] = crudService.useImport(
    provinceRepository.import,
    setLoading,
  );

  /**
   * If export
   */
  const [handleExport] = crudService.useExport(
    provinceRepository.export,
    filter,
  );

  const [handleDelete] = tableService.useDeleteHandler<Province>(
    provinceRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    provinceRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const handleGoDetail = React.useCallback(
    (province: Province) => {
      setCurrentItem(province);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );

  const columns: ColumnProps<Province>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Province>(pagination),
        },
        {
          title: translate('provinces.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Province>(
            nameof(list[0].code),
            sorter,
          ),
        },
        {
          title: translate('provinces.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Province>(
            nameof(list[0].name),
            sorter,
          ),
        },

        {
          title: translate('provinces.priority'),
          key: nameof(list[0].priority),
          dataIndex: nameof(list[0].priority),
          sorter: true,
          sortOrder: getOrderTypeForTable<Province>(
            nameof(list[0].priority),
            sorter,
          ),
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, province: Province) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                {validAction('get') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.view)}>
                    <button
                      className="btn btn-sm btn-link "
                      onClick={handleOpenPreview(id)}
                    >
                      <i className="tio-visible_outlined" />
                    </button>
                  </Tooltip>
                }
                {validAction('update') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.edit)}>
                    <button
                      className="btn btn-sm btn-link"
                      onClick={() => handleGoDetail(province)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!province.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link "
                      onClick={handleDelete(province)}
                    >
                      <i className="tio-delete_outlined" />
                    </button>
                  </Tooltip>
                )}
              </div>
            );
          },
        },
      ];
    },
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleGoDetail,
      handleOpenPreview,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );
  const handleCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);
  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  return (
    <div className="page master-page">
      <Card title={translate('provinces.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('provinces.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('provinces.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('provinces.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('provinces.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('provinces.priority')}
                  labelAlign="left"
                >
                  <AdvancedNumberFilter
                    filterType={nameof(filter.priority.equal)}
                    filter={filter.priority}
                    onChange={handleFilter(nameof(filter.priority))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('provinces.placeholder.priority')}
                    className="w-100"
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
          rowSelection={rowSelection}
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {validAction('create') &&
                    <button
                      className="btn btn-sm btn-primary mr-2"
                      onClick={handleCreate}
                    >
                      <i className="fa mr-2 fa-plus" />
                      {translate(generalLanguageKeys.actions.create)}
                    </button>
                  }
                  {validAction('bulkDelete') &&
                    <button
                      className="btn btn-sm btn-danger mr-2"
                      disabled={!hasSelected}
                      onClick={handleBulkDelete}
                    >
                      <i className="fa mr-2 fa-trash" />
                      {translate(generalLanguageKeys.actions.delete)}
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
        <ProvincePreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
        />
      </Card>
      {visible === true && (
        <ProvinceDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListProvince={provinceRepository.list}
          setListProvince={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default ProvinceMaster;
