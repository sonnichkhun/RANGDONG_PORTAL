import React from 'react';
import { positionRepository } from 'views/PositionView/PositionRepository';
import { generalLanguageKeys, generalColumnWidths } from 'config/consts';
import { Form, Row, Col, Card, Tooltip } from 'antd';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import { useTranslation } from 'react-i18next';
import { crudService } from 'core/services';

import { PositionFilter } from 'models/PositionFilter';
import { Position } from 'models/Position';
import { Status } from 'models/Status';
import nameof from 'ts-nameof.macro';
import { StatusFilter } from 'models/StatusFilter';
import {
  renderMasterIndex,
  getOrderTypeForTable,
} from 'helpers/ant-design/table';
import Table, { ColumnProps } from 'antd/lib/table';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import AdvancedIdFilter from 'components/AdvancedIdFilter/AdvancedIdFilter';
import PositionDetail from 'views/PositionView/PositionDetail/PositionDetail';
import { tableService } from 'services';
import PositionPreview from 'views/PositionView/PositionMaster/PositionPreview';
import { API_POSITION_ROUTE } from 'config/api-consts';
const { Item: FormItem } = Form;
function PositionMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('position', API_POSITION_ROUTE, 'portal');

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
  ] = crudService.useMaster<Position, PositionFilter>(
    Position,
    PositionFilter,
    positionRepository.count,
    positionRepository.list,
    positionRepository.get,
  );

  const [rowSelection, hasSelected] = tableService.useRowSelection<Position>();
  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  // Delete handlers -------------------------------------------------------------------------------------------------------------------------------
  const [handleDelete] = tableService.useDeleteHandler<Position>(
    positionRepository.delete,
    setLoading,
    list,
    setList,
    handleDefaultSearch,
  );

  const [handleBulkDelete] = tableService.useBulkDeleteHandler(
    rowSelection.selectedRowKeys,
    positionRepository.bulkDelete,
    setLoading,
    handleDefaultSearch,
  );
  const [visible, setVisible] = React.useState<boolean>(false);
  const [isDetail, setIsDetail] = React.useState<boolean>(false);

  const handleCreate = React.useCallback(() => {
    setVisible(true);
    setIsDetail(false);
  }, [setVisible, setIsDetail]);
  const handlePopupCancel = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const [currentItem, setCurrentItem] = React.useState<any>(null);

  const handleGoDetail = React.useCallback(
    (position: Position) => {
      setCurrentItem(position);
      setVisible(true);
      setIsDetail(true);
    },
    [setCurrentItem, setVisible, setIsDetail],
  );

  const [statusList, setStatusList] = React.useState<Status[]>([]);
  React.useEffect(() => {
    const filter = new StatusFilter();
    positionRepository.singleListStatus(filter).then((list: Status[]) => {
      setStatusList(list);
    });
  }, [setStatusList]);

  const columns: ColumnProps<Position>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Position>(pagination),
        },

        {
          title: translate('positions.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          sortOrder: getOrderTypeForTable<Position>(
            nameof(list[0].code),
            sorter,
          ),
        },

        {
          title: translate('positions.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          sorter: true,
          sortOrder: getOrderTypeForTable<Position>(
            nameof(list[0].name),
            sorter,
          ),
        },

        {
          title: translate('positions.status'),
          key: nameof(list[0].status),
          dataIndex: nameof(list[0].status),
          align: 'center',
          sorter: true,
          sortOrder: getOrderTypeForTable<Position>(
            nameof(list[0].status),
            sorter,
          ),
          render(status: Status) {
            return (
              <div className={status.id === 1 ? 'active' : ''}>
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
          render(id: number, position: Position) {
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
                      onClick={() => handleGoDetail(position)}
                    >
                      <i className="tio-edit" />
                    </button>
                  </Tooltip>
                }
                {!position.used && validAction('delete') &&
                  <Tooltip title={translate(generalLanguageKeys.actions.delete)}>
                    <button
                      className="btn btn-sm btn-link "
                      onClick={handleDelete(position)}
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
    // tslint:disable-next-line:max-line-length
    [
      handleDelete,
      handleOpenPreview,
      handleGoDetail,
      list,
      pagination,
      sorter,
      translate,
      validAction,
    ],
  );

  return (
    <div className="page master-page">
      <Card title={translate('positions.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('positions.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('positions.placeholder.code')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-0"
                  label={translate('positions.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('positions.placeholder.name')}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                </FormItem>
              </Col>
              {validAction('filterListStatus') &&
                <Col className="pl-1" span={6}>
                  <FormItem className="mb-0" label={translate('position.status')}>
                    <AdvancedIdFilter
                      filter={filter.statusId}
                      filterType={nameof(filter.statusId.equal)}
                      value={filter.statusId.equal}
                      placeholder={translate('general.placeholder.title')}
                      onChange={handleFilter(nameof(filter.statusId))}
                      list={statusList}
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
                  onClick={handleSearch}
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
        <PositionPreview
          previewModel={previewModel}
          previewVisible={previewVisible}
          onClose={handleClosePreview}
          previewLoading={previewLoading}
        />
      </Card>
      {visible === true && (
        <PositionDetail
          isDetail={isDetail}
          visible={visible}
          setVisible={setVisible}
          getListPosition={positionRepository.list}
          setListPosition={setList}
          currentItem={currentItem}
          onClose={handlePopupCancel}
          setLoadList={setLoadList}
        />
      )}
    </div>
  );
}

export default PositionMaster;
