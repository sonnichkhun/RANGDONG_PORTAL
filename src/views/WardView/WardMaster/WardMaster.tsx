import { Tooltip } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import { Col, Row } from 'antd/lib/grid';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import AdvancedNumberFilter from 'components/AdvancedNumberFilter/AdvancedNumberFilter';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { generalColumnWidths, generalLanguageKeys } from 'config/consts';
import { crudService } from 'core/services';
import {
  getOrderTypeForTable,
  renderMasterIndex,
} from 'helpers/ant-design/table';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import WardPreview from 'views/WardView/WardMaster/WardPreview';
import { wardRepository } from 'views/WardView/WardRepository';
import { WardDetail } from '../WardView';
import './WardMaster.scss';
import { API_WARD_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

function WardMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('ward', API_WARD_ROUTE, 'portal');

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
  ] = crudService.useMaster<Ward, WardFilter>(
    Ward,
    WardFilter,
    wardRepository.count,
    wardRepository.list,
    wardRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<Ward>();

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Ward>(
    wardRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    wardRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<any>(null);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const handleGoDetail = React.useCallback(
    (ward: Ward) => {
      setCurrentItem(ward);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );
  const columns: ColumnProps<Ward>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Ward>(pagination),
        },
        {
          title: translate('wards.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(nameof(list[0].code), sorter),
        },
        {
          title: translate('wards.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(nameof(list[0].name), sorter),
        },

        {
          title: translate('wards.priority'),
          key: nameof(list[0].priority),
          dataIndex: nameof(list[0].priority),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(
            nameof(list[0].priority),
            sorter,
          ),
        },

        {
          title: translate('wards.district'),
          key: nameof(list[0].district),
          dataIndex: nameof(list[0].district),
          sorter: true,
          sortOrder: getOrderTypeForTable<Ward>(
            nameof(list[0].district),
            sorter,
          ),
          render(district: District) {
            return district?.name;
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, ward: Ward) {
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
                      onClick={() => handleGoDetail(ward)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!ward.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link "
                      onClick={handleDelete(ward)}
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
      <Card title={translate('wards.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('wards.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('wards.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('wards.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('wards.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('wards.priority')}
                  labelAlign="left"
                >
                  <AdvancedNumberFilter
                    filterType={nameof(filter.priority.equal)}
                    filter={filter.priority}
                    onChange={handleFilter(nameof(filter.priority))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('wards.placeholder.priority')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('filterListDistrict') &&
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('wards.district')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.districtId}
                      filterType={nameof(filter.districtId.equal)}
                      value={filter.districtId.equal}
                      onChange={handleFilter(nameof(filter.districtId))}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      getList={wardRepository.filterListDistrict}
                      searchType={nameof(districtFilter.name.contain)}
                      searchField={nameof(districtFilter.name)}
                      placeholder={translate('wards.placeholder.district')}
                      allowClear={true}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </FormItem>
                </Col>
              }
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
        <WardPreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
        />
      </Card>
      {visible === true && (
        <WardDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListWard={wardRepository.list}
          setListWard={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default WardMaster;
