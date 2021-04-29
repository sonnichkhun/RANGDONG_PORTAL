import React from 'react';
import { withRouter } from 'react-router';
import { Card, Table, Form, Row, Col, Switch, Tooltip } from 'antd';
import { crudService, formService, routerService } from 'core/services';
import { Site } from 'models/Site';
import { SiteFilter } from 'models/SiteFilter';
import { ColumnProps } from 'antd/lib/table';
import { generalLanguageKeys, generalColumnWidths } from 'config/consts';
import { renderMasterIndex, getOrderTypeForTable } from 'helpers/ant-design/table';
import { tableService } from 'services';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import CollapsibleCard from 'components/CollapsibleCard/CollapsibleCard';
import AdvancedStringFilter from 'components/AdvancedStringFilter/AdvancedStringFilter';
import { API_SITE_ROUTE } from 'config/api-consts';
import { siteRepository } from '../SiteRepository';
import { SITE_DETAIL_ROUTE } from 'config/route-consts';


const { Item: FormItem } = Form;


function SiteMaster() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('site', API_SITE_ROUTE, 'portal');
  const [
    filter,
    setFilter,
    list,
    ,
    loading,
    ,
    total,
    ,
    ,
    previewModel,
    ,
    ,
    handleFilter,
    handleSearch,
    handleReset,
    ,
    ,
    handleDefaultSearch,
  ] = crudService.useMaster<Site, SiteFilter>(
    Site,
    SiteFilter,
    siteRepository.count,
    siteRepository.list,
    siteRepository.get,
  );

  const [pagination, sorter, handleTableChange] = tableService.useMasterTable(
    filter,
    setFilter,
    total,
    handleSearch,
  );

  const [, handleGoDetail] = routerService.useMasterNavigation(
    SITE_DETAIL_ROUTE,
  );

  const handleChangeStatus = React.useCallback((params) => {
    return () => {
      params[1].isDisplay = !params[1].isDisplay;
      siteRepository.update(params[1]).then((res) => {
        if (res) {
          handleDefaultSearch();
        }

      });
    };
  }, [handleDefaultSearch]);

  const columns: ColumnProps<Site>[] = React.useMemo(
    () => {
      return [
        {
          title: translate(generalLanguageKeys.columns.index),
          key: nameof(generalLanguageKeys.index),
          width: generalColumnWidths.index,
          render: renderMasterIndex<Site>(pagination),
        },
        {
          title: translate('sites.code'),
          key: nameof(list[0].code),
          dataIndex: nameof(list[0].code),
          sorter: true,
          ellipsis: true,
          sortOrder: getOrderTypeForTable<Site>(nameof(list[0].code), sorter),
        },
        {
          title: translate('sites.name'),
          key: nameof(list[0].name),
          dataIndex: nameof(list[0].name),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<Site>(nameof(list[0].name), sorter),
        },
        {
          title: translate('sites.description'),
          key: nameof(list[0].description),
          dataIndex: nameof(list[0].description),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<Site>(nameof(list[0].description), sorter),
        },
        {
          title: translate('sites.icon'),
          key: nameof(list[0].icon),
          dataIndex: nameof(list[0].icon),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<Site>(nameof(list[0].icon), sorter),
          render(...[icon]) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                <img src={icon} width={50} alt="" />
              </div>
            );
          },
          align: 'center',
        },

        {
          title: translate('sites.logo'),
          key: nameof(list[0].logo),
          dataIndex: nameof(list[0].logo),
          ellipsis: true,
          sorter: true,
          sortOrder: getOrderTypeForTable<Site>(nameof(list[0].logo), sorter),
          render(...[logo]) {
            return (
              <div className="d-flex justify-content-center button-action-table">
                <img src={logo} width={50} alt="" />
              </div>
            );
          },
          align: 'center',
        },

        // {
        //   title: translate('sites.favicon'),
        //   key: nameof(list[0].favicon),
        //   dataIndex: nameof(list[0].favicon),
        //   ellipsis: true,
        //   sorter: true,
        //   sortOrder: getOrderTypeForTable<Site>(nameof(list[0].favicon), sorter),
        //   render(...[favicon]) {
        //     return (
        //       <div className="d-flex justify-content-center button-action-table">
        //         <img src={'data:image/png;base64,' + favicon} width={50} alt="" />
        //       </div>
        //     );
        //   },
        //   align: 'center',
        // },

        {
          title: translate('sites.isDisplay'),
          key: nameof(list[0].isDisplay),
          dataIndex: nameof(list[0].isDisplay),
          width: generalColumnWidths.actions,
          align: 'center',
          render(...params) {
            return (<>
              {validAction('update') &&
                <FormItem
                  validateStatus={formService.getValidationStatus<
                    Site
                  >(params[1].errors, nameof(params[1].isDisplay))}
                  help={params[1].errors?.status}
                >
                  <Switch
                    checked={params[1].isDisplay === true}
                    onChange={handleChangeStatus(params)}
                  />
                </FormItem>}
            </>
            );
          },
        },
        {
          title: translate(generalLanguageKeys.actions.label),
          key: nameof(generalLanguageKeys.columns.actions),
          dataIndex: nameof(list[0].id),
          width: generalColumnWidths.actions,
          align: 'center',
          render(id: number) {
            return (
              <div className="d-flex justify-content-center button-action-table">
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
              </div>
            );
          },
        },
      ];
    },
    [handleChangeStatus, handleGoDetail, list, pagination, sorter, translate, validAction]);

  return (
    <div className="page master-page">
      <Card title={translate('sites.master.title')}>
        <CollapsibleCard
          className="head-borderless mb-3"
          title={translate(generalLanguageKeys.actions.search)}
        >
          <Form>
            <Row>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('sites.code')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.code.contain)}
                    filter={filter.code}
                    onChange={handleFilter(nameof(filter.code))}
                    className="w-100"
                    placeholder={translate('sites.placeholder.code')}
                  />
                </FormItem>
              </Col>
              <Col className="pl-1" span={6}>
                <FormItem
                  className="mb-1"
                  label={translate('sites.name')}
                  labelAlign="left"
                >
                  <AdvancedStringFilter
                    filterType={nameof(filter.name.contain)}
                    filter={filter.name}
                    onChange={handleFilter(nameof(filter.name))}
                    className="w-100"
                    placeholder={translate('sites.placeholder.name')}
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
          onChange={handleTableChange}
          title={() => (
            <>
              <div className="d-flex justify-content-between">
                <div className="flex-shrink-1 d-flex align-items-center">
                  {/* <button
                    className="btn btn-sm btn-primary mr-2"
                    onClick={handleCreate}
                  >
                    <i className="fa mr-2 fa-plus" />
                    {translate(generalLanguageKeys.actions.create)}
                  </button>
                  <button
                    className="btn btn-sm btn-danger mr-2"
                    disabled={!hasSelected}
                    onClick={handleBulkDelete}
                  >
                    <i className="fa mr-2 fa-trash" />
                    {translate(generalLanguageKeys.actions.delete)}
                  </button> */}
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
      </Card>
    </div>
  );
}


export default withRouter(SiteMaster);
