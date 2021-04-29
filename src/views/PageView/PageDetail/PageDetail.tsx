import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { Page } from 'models/Page';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { pageRepository } from 'views/PageView/PageRepository';
import './PageDetail.scss';

const { Item: FormItem } = Form;

function PageDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    page,
    setPage,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Page, pageRepository.get, pageRepository.save);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Page>(page, setPage);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultMenuList: Menu[] = crudService.useDefaultList<Menu>(page.menu);

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
                ? translate('pages.detail.title')
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
              label={translate('pages.name')}
              validateStatus={formService.getValidationStatus<Page>(
                page.errors,
                nameof(page.name),
              )}
              help={page.errors?.name}
            >
              <input
                type="text"
                defaultValue={page.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(page.name))}
              />
            </FormItem>

            <FormItem
              label={translate('pages.path')}
              validateStatus={formService.getValidationStatus<Page>(
                page.errors,
                nameof(page.path),
              )}
              help={page.errors?.path}
            >
              <input
                type="text"
                defaultValue={page.path}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(page.path))}
              />
            </FormItem>

            <FormItem
              label={translate('pages.menu')}
              validateStatus={formService.getValidationStatus<Page>(
                page.errors,
                nameof(page.menu),
              )}
              help={page.errors?.menu}
            >
              <Select
                value={page.menu?.id}
                onChange={handleChangeObjectField(nameof(page.menu))}
                getList={pageRepository.singleListMenu}
                list={defaultMenuList}
                modelFilter={menuFilter}
                setModelFilter={setMenuFilter}
                searchField={nameof(menuFilter.id)}
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

export default PageDetail;
