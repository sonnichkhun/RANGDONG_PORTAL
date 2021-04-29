import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Field } from 'models/Field';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { fieldRepository } from 'views/FieldView/FieldRepository';

const { Item: FormItem } = Form;

function FieldDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    field,
    setField,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Field, fieldRepository.get, fieldRepository.save);

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    ,
  ] = crudService.useChangeHandlers<Field>(field, setField);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultMenuList: Menu[] = crudService.useDefaultList<Menu>(field.menu);

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
                ? translate('fields.detail.title')
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
              label={translate('fields.name')}
              validateStatus={formService.getValidationStatus<Field>(
                field.errors,
                nameof(field.name),
              )}
              help={field.errors?.name}
            >
              <input
                type="text"
                defaultValue={field.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(field.name))}
              />
            </FormItem>

            <FormItem
              label={translate('fields.type')}
              validateStatus={formService.getValidationStatus<Field>(
                field.errors,
                nameof(field.type),
              )}
              help={field.errors?.type}
            >
              <input
                type="text"
                defaultValue={field.type}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(field.type))}
              />
            </FormItem>

            <FormItem
              label={translate('fields.menu')}
              validateStatus={formService.getValidationStatus<Field>(
                field.errors,
                nameof(field.menu),
              )}
              help={field.errors?.menu}
            >
              <Select
                value={field.menu?.id}
                onChange={handleChangeObjectField(nameof(field.menu))}
                getList={fieldRepository.singleListMenu}
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
          <Tabs defaultActiveKey="1"></Tabs>
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

export default FieldDetail;
