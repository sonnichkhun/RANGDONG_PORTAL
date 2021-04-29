import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Menu } from 'models/Menu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import FieldTable from 'views/MenuView/MenuDetail/FieldTable/FieldTable';
import PageTable from 'views/MenuView/MenuDetail/PageTable/PageTable';
import { menuRepository } from 'views/MenuView/MenuRepository';
import './MenuDetail.scss';

const { TabPane } = Tabs;

const { Item: FormItem } = Form;

function MenuDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    menu,
    setMenu,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Menu, menuRepository.get, menuRepository.save);

  const [handleChangeSimpleField] = crudService.useChangeHandlers<Menu>(
    menu,
    setMenu,
  );

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="page detail-page">
      <Spin spinning={loading}>
        <Card
          title={
            <>
              <button className="btn btn-link mr-2" onClick={handleGoBack}>
                <i className="fa fa-arrow-left" />
              </button>
              {isDetail
                ? translate('menus.detail.title')
                : translate(generalLanguageKeys.actions.create)}
            </>
          }
        >
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
          <Form {...defaultDetailFormLayout}>
            <FormItem
              label={translate('menus.name')}
              validateStatus={formService.getValidationStatus<Menu>(
                menu.errors,
                nameof(menu.name),
              )}
              help={menu.errors?.name}
            >
              <input
                type="text"
                defaultValue={menu.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(menu.name))}
              />
            </FormItem>

            <FormItem
              label={translate('menus.path')}
              validateStatus={formService.getValidationStatus<Menu>(
                menu.errors,
                nameof(menu.path),
              )}
              help={menu.errors?.path}
            >
              <input
                type="text"
                defaultValue={menu.path}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(menu.path))}
              />
            </FormItem>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
        </Card>
        <Card className="mt-2">
          <Tabs defaultActiveKey="1">
            <TabPane key="fields" tab={translate('menus.tabs.fields.title')}>
              <FieldTable
                model={menu}
                setModel={setMenu}
                field={nameof(menu.fields)}
                onChange={handleChangeSimpleField(nameof(menu.fields))}
              />
            </TabPane>

            <TabPane key="pages" tab={translate('menus.tabs.pages.title')}>
              <PageTable
                model={menu}
                setModel={setMenu}
                field={nameof(menu.pages)}
                onChange={handleChangeSimpleField(nameof(menu.pages))}
              />
            </TabPane>
          </Tabs>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              <i className="fa mr-2 fa-save" />
              {translate(generalLanguageKeys.actions.save)}
            </button>
          </div>
        </Card>
      </Spin>
    </div>
  );
}

export default MenuDetail;
