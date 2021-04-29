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
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { tableService } from 'services';
import nameof from 'ts-nameof.macro';
import { districtRepository } from 'views/DistrictView/DistrictRepository';
import DistrictDetail from '../DistrictDetail/DistrictDetail';
import './DistrictMaster.scss';
import { Tooltip } from 'antd';
import DistrictPreview from 'views/DistrictView/DistrictMaster/DistrictPreview';
import { API_DISTRICT_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

function DistrictMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('district', API_DISTRICT_ROUTE, 'portal');

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
  ] = crudService.useMaster<District, DistrictFilter>(
    District,
    DistrictFilter,
    districtRepository.count,
    districtRepository.list,
    districtRepository.get,
  );

  // const [handleGoCreate, handleGoDetail] = routerService.useMasterNavigation(
  //   DISTRICT_ROUTE,
  // );
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );
  const [rowSelection, hasSelected] = tableService.useRowSelection<District>();

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<District>(
    districtRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );
  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    districtRepository.bulkDelete,
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

  const columns: ColumnProps<District>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<District>(pagination),
        },
        {
          title: translate('districts.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<District>(
            nameof(list[0].code),
            sorter,
          ),
        },
        {
          title: translate('districts.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<District>(
            nameof(list[0].name),
            sorter,
          ),
        },
        {
          title: translate('districts.priority'),
          key: nameof(list[0].priority),
          dataIndex: nameof(list[0].priority),
          sorter: true,
          sortOrder: getOrderTypeForTable<District>(
            nameof(list[0].priority),
            sorter,
          ),
        },
        {
          title: translate('districts.province'),
          key: nameof(list[0].province),
          dataIndex: nameof(list[0].province),
          sorter: true,
          sortOrder: getOrderTypeForTable<District>(
            nameof(list[0].province),
            sorter,
          ),
          render(province: Province) {
            return province?.name;
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number, district: District) {
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
                      onClick={() => handleGoDetail(district)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!district.used && validAction('delete') && (
                  <Tooltip
                    title={translate(generalLanguageKeys.actions.delete)}
                  >
                    <button
                      className="btn btn-sm btn-link "
                      onClick={handleDelete(district)}
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
      <Card title={translate('districts.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('districts.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    value={filter.code.contain}
                    onChange={handleFilter(nameof(filter.code))}
                    placeholder={translate('districts.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('districts.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    placeholder={translate('districts.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('districts.priority')}
                  labelAlign="left"
                >
                  <AdvancedNumberFilter
                    filterType={nameof(filter.priority.equal)}
                    filter={filter.priority}
                    onChange={handleFilter(nameof(filter.priority))}
                    isReset={isReset}
                    setIsReset={setIsReset}
                    placeholder={translate('districts.placeholder.priority')}
                    className="w-100"
                  />
                </FormItem>
              </Col>
              {validAction('filterListProvince') &&
                <Col className="pl-1" span={6}>
                  <FormItem
                    className="mb-1"
                    label={translate('districts.province')}
                    labelAlign="left"
                  >
                    <AdvancedIdFilter
                      filter={filter.provinceId}
                      filterType={nameof(filter.provinceId.equal)}
                      value={filter.provinceId.equal}
                      onChange={handleFilter(nameof(filter.provinceId))}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      getList={districtRepository.filterListProvince}
                      searchType={nameof(provinceFilter.name.contain)}
                      searchField={nameof(provinceFilter.name)}
                      placeholder={translate('provinces.placeholder.province')}
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
          // bordered
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
        <DistrictPreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
        />
      </Card>
      {visible === true && (
        <DistrictDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListDistrict={districtRepository.list}
          setListDistrict={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default DistrictMaster;
