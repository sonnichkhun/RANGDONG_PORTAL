import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import Tabs from 'antd/lib/tabs';
import Select from 'components/Select/Select';
import { defaultDetailFormLayout } from 'config/ant-design/form';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Menu } from 'models/Menu';
import { MenuFilter } from 'models/MenuFilter';
import { Permission } from 'models/Permission';
import { Role } from 'models/Role';
import { RoleFilter } from 'models/RoleFilter';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import PermissionFieldMappingTable from 'views/PermissionView/PermissionDetail/PermissionFieldMappingTable/PermissionFieldMappingTable';
import PermissionPageMappingTable from 'views/PermissionView/PermissionDetail/PermissionPageMappingTable/PermissionPageMappingTable';
import { permissionRepository } from 'views/PermissionView/PermissionRepository';
import './PermissionDetail.scss';

const { Item: FormItem } = Form;

function PermissionDetail() {
  const [translate] = useTranslation();

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    permission,
    setPermission,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    Permission,
    permissionRepository.get,
    permissionRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Permission>(permission, setPermission);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [statusList] = crudService.useEnumList<Status>(
    permissionRepository.singleListStatus,
  );

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [menuFilter, setMenuFilter] = React.useState<MenuFilter>(
    new MenuFilter(),
  );

  const [roleFilter, setRoleFilter] = React.useState<RoleFilter>(
    new RoleFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultMenuList: Menu[] = crudService.useDefaultList<Menu>(
    permission.menu,
  );

  const defaultRoleList: Role[] = crudService.useDefaultList<Role>(
    permission.role,
  );

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
                ? translate('permissions.detail.title')
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
              label={translate('permissions.name')}
              validateStatus={formService.getValidationStatus<Permission>(
                permission.errors,
                nameof(permission.name),
              )}
              help={permission.errors?.name}
            >
              <input
                type="text"
                defaultValue={permission.name}
                className="form-control form-control-sm"
                onChange={handleChangeSimpleField(nameof(permission.name))}
              />
            </FormItem>

            <FormItem
              label={translate('permissions.menu')}
              validateStatus={formService.getValidationStatus<Permission>(
                permission.errors,
                nameof(permission.menu),
              )}
              help={permission.errors?.menu}
            >
              <Select
                value={permission.menu?.id}
                onChange={handleChangeObjectField(nameof(permission.menu))}
                getList={permissionRepository.singleListMenu}
                list={defaultMenuList}
                modelFilter={menuFilter}
                setModelFilter={setMenuFilter}
                searchField={nameof(menuFilter.id)}
              />
            </FormItem>

            <FormItem
              label={translate('permissions.role')}
              validateStatus={formService.getValidationStatus<Permission>(
                permission.errors,
                nameof(permission.role),
              )}
              help={permission.errors?.role}
            >
              <Select
                value={permission.role?.id}
                onChange={handleChangeObjectField(nameof(permission.role))}
                getList={permissionRepository.singleListRole}
                list={defaultRoleList}
                modelFilter={roleFilter}
                setModelFilter={setRoleFilter}
                searchField={nameof(roleFilter.id)}
              />
            </FormItem>

            <FormItem
              label={translate('permissions.status')}
              validateStatus={formService.getValidationStatus<Permission>(
                permission.errors,
                nameof(permission.status),
              )}
              help={permission.errors?.status}
            >
              <Select
                value={permission.status?.id}
                onChange={handleChangeObjectField(nameof(permission.status))}
                list={statusList}
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
            <Tabs.TabPane
              key="1"
              tab={translate('permissions.permissionFieldMappings.list')}
            >
              <PermissionFieldMappingTable
                permission={permission}
                setPermission={setPermission}
              />
            </Tabs.TabPane>

            <Tabs.TabPane
              key="1"
              tab={translate('permissions.permissionPageMappings.list')}
            >
              <PermissionPageMappingTable
                permission={permission}
                setPermission={setPermission}
              />
            </Tabs.TabPane>
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

export default PermissionDetail;
