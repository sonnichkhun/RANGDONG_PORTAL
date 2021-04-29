import { Col, DatePicker, Radio, Row, Switch } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import AvatarUploader from 'components/AvatarUploader/AvatarUploader';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import SwitchStatus from 'components/Switch/Switch';
import TreeSelectDropdown from 'components/TreeSelect/TreeSelect';
import { generalLanguageKeys, STANDARD_DATE_FORMAT_INVERSE } from 'config/consts';
import { formatInputDate } from 'core/helpers/date-time';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { AppUser } from 'models/AppUser';
import { AppUserSiteMapping } from 'models/AppUserSiteMapping';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Position } from 'models/Position';
import { PositionFilter } from 'models/PositionFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Sex } from 'models/Sex';
import { Site } from 'models/Site';
import { Status } from 'models/Status';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import nameof from 'ts-nameof.macro';
import { appUserRepository } from 'views/AppUserView/AppUserRepository';
import './AppUserDetail.scss';
import { API_APP_USER_PORTAL_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

function AppUserDetail() {
  const [translate] = useTranslation();
  const { id } = useParams();
  const { validAction } = crudService.useAction('app-user', API_APP_USER_PORTAL_ROUTE, 'portal');

  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    appUser,
    setAppUser,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(
    AppUser,
    appUserRepository.get,
    appUserRepository.save,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleUpdateDateField,
  ] = crudService.useChangeHandlers<AppUser>(appUser, setAppUser);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  const [userStatusList] = crudService.useEnumList<Status>(
    appUserRepository.singleListStatus,
  );

  const [userSexList] = crudService.useEnumList<Sex>(
    appUserRepository.singleListSex,
  );

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());
  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );
  const [positionFilter, setPositionFilter] = React.useState<PositionFilter>(
    new PositionFilter(),
  );

  const defaultProvinceList: Province[] = crudService.useDefaultList<Province>(
    appUser.province,
  );
  const defaultPositionList: Position[] = crudService.useDefaultList<Position>(
    appUser.position,
  );
  const [appUserSiteMappings, setAppUserSiteMappings] = React.useState<
    AppUserSiteMapping[]
  >([]);
  const [sex, setSex] = React.useState<Sex>(new Sex());
  const [isSite, setIsSite] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!isDetail && isSite) {
      appUserRepository.listSite().then((mapping: Site[]) => {
        if (mapping && mapping.length > 0) {
          mapping.forEach((site: Site) => {
            appUserSiteMappings.push({
              ...new AppUserSiteMapping(),
              site,
              siteId: site?.id,
            });
          });
          setAppUserSiteMappings([...appUserSiteMappings]);
          setAppUser({ ...appUser, appUserSiteMappings });
        }
      });
      setIsSite(false);
    }
    if (isDetail && isSite) {

      if (appUser?.appUserSiteMappings && appUser?.appUserSiteMappings.length > 0) {
        const appUserSite: AppUserSiteMapping[] = appUser.appUserSiteMappings;
        setAppUserSiteMappings([...appUserSite]);
        setIsSite(false);
      }
    }
  }, [setAppUser, id, appUser, setAppUserSiteMappings, isSite, isDetail, appUserSiteMappings]);

  const handleChangeImage = React.useCallback(
    (value: string) => {
      if (value) {
        setAppUser({
          ...appUser,
          avatar: value,
        });
      }
    },
    [appUser, setAppUser],
  );


  const handleChangeSiteMapping = React.useCallback(

    index => {
      return check => {
        appUserSiteMappings[index].enabled = check;
        setAppUserSiteMappings([...appUserSiteMappings]);
        setAppUser({
          ...appUser,
          appUserSiteMappings,
        });
      };
    },
    [appUserSiteMappings, setAppUser, appUser],
  );


  const handleChangeSex = React.useCallback(
    (checked) => {

      const sexId = checked.target.value;
      setSex({
        ...sex,
        id: sexId,
      });
      setAppUser(
        AppUser.clone<AppUser>({
          ...appUser,
          sex,
          sexId,
          errors: {
            ...appUser.errors,
            sex: null,
            sexId: null,
          },
        }),
      );

    }, [appUser, setAppUser, sex]);

  return (
    <div className="page detail-page app-user-detail">
      <Spin spinning={loading}>
        <Card
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <button
                  className="btn btn-link btn-back"
                  onClick={handleGoBack}
                >
                  <i className="fa fa-chevron-left"></i>
                </button>
                <div className="pt-1 pl-1">
                  {isDetail
                    ? translate('general.detail.title')
                    : translate(generalLanguageKeys.actions.create)}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary float-right ml-2 mr-2"
                  onClick={handleGoBack}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
                {!isDetail && validAction('create') &&
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                }
                {isDetail && validAction('update') &&
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                }
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <Col span={11}>
                {validAction('saveImage') &&
                  <FormItem>
                    <span className="label-input ml-3 mb-3 mt-2">
                      {translate('appUsers.avatar')}
                    </span>
                    <AvatarUploader
                      onUpload={appUserRepository.saveImage}
                      defaultValue={appUser?.avatar}
                      onChange={handleChangeImage}
                    />
                  </FormItem>
                }
              </Col>
            </Row>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.username),
                  )}
                  help={appUser.errors?.username}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.username')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={appUser.username}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.username))}
                    placeholder={translate('appUsers.placeholder.username')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.displayName),
                  )}
                  help={appUser.errors?.displayName}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.displayName')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={appUser.displayName}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(appUser.displayName),
                    )}
                    placeholder={translate('appUsers.placeholder.displayName')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.phone),
                  )}
                  help={appUser.errors?.phone}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.phone')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={appUser.phone}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.phone))}
                    placeholder={translate('appUsers.placeholder.phone')}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.email),
                  )}
                  help={appUser.errors?.email}
                >
                  <span className="label-input ml-3">

                    {translate('appUsers.email')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={appUser.email}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.email))}
                    placeholder={translate('appUsers.placeholder.email')}
                  />
                </FormItem>
                {validAction('singleListSex') &&
                  <FormItem
                    validateStatus={formService.getValidationStatus<AppUser>(
                      appUser.errors,
                      nameof(appUser.sex),
                    )}
                    help={appUser.errors?.sex}
                  >
                    <span className="label-input ml-3">
                      {translate('appUsers.sex')}
                      <span className="text-danger">*</span>
                    </span>
                    <Radio.Group
                      onChange={handleChangeSex}
                      defaultValue={appUser.sexId}
                    >
                      <Radio
                        value={userSexList[0]?.id}
                        checked={appUser.sexId === 1 ? true : false}
                      >
                        {userSexList[0]?.name}
                      </Radio>
                      <Radio
                        value={userSexList[1]?.id}
                        checked={appUser.sexId === 2 ? true : false}
                      >
                        {userSexList[1]?.name}
                      </Radio>
                      <Radio
                        value={userSexList[2]?.id}
                        checked={appUser.sexId === 3 ? true : false}
                      >
                        {userSexList[2]?.name}
                      </Radio>
                    </Radio.Group>
                  </FormItem>
                }
                {validAction('singleListStatus') &&
                  <FormItem
                    validateStatus={formService.getValidationStatus<AppUser>(
                      appUser.errors,
                      nameof(appUser.status),
                    )}
                    help={appUser.errors?.status}
                  >
                    <span className="label-input ml-3">
                      {translate('appUsers.status')}
                    </span>
                    <SwitchStatus
                      checked={
                        appUser.statusId === userStatusList[1]?.id
                      }
                      list={userStatusList}
                      onChange={handleChangeObjectField(nameof(appUser.status))}
                    />
                  </FormItem>
                }
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                {validAction('singleListOrganization') &&
                  <FormItem
                    validateStatus={formService.getValidationStatus<AppUser>(
                      appUser.errors,
                      nameof(appUser.organization),
                    )}
                    help={appUser.errors?.organization}
                  >
                    <span className="label-input ml-3">
                      {translate('appUsers.organization')}
                      <span className="text-danger">*</span>
                    </span>
                    <TreeSelectDropdown
                      defaultValue={
                        appUser.organization
                          ? translate('appUsers.placeholder.organization')
                          : appUser.organizationId
                      }
                      value={
                        appUser.organizationId === 0
                          ? null
                          : appUser.organizationId
                      }
                      mode="single"
                      onChange={handleChangeObjectField(
                        nameof(appUser.organization),
                      )}
                      modelFilter={organizationFilter}
                      setModelFilter={setOrganizationFilter}
                      getList={appUserRepository.singleListOrganization}
                      searchField={nameof(organizationFilter.id)}
                      placeholder={translate(
                        'appUsers.placeholder.organization',
                      )}
                    />
                  </FormItem>
                }
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.birthday),
                  )}
                  help={appUser.errors?.birthday}

                >
                  <span className="label-input ml-3">
                    {translate('appUsers.birthday')}
                  </span>
                  <DatePicker
                    value={formatInputDate(appUser.birthday)}
                    onChange={handleUpdateDateField(nameof(appUser.birthday))}
                    className="w-100 input-date"
                    placeholder={translate('appUsers.placeholder.birthday')}
                    format={STANDARD_DATE_FORMAT_INVERSE}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<AppUser>(
                    appUser.errors,
                    nameof(appUser.address),
                  )}
                  help={appUser.errors?.address}
                >
                  <span className="label-input ml-3">
                    {translate('appUsers.address')}
                  </span>
                  <input
                    type="text"
                    defaultValue={appUser.address}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(appUser.address))}
                    placeholder={translate('appUsers.placeholder.address')}
                  />
                </FormItem>
                {validAction('singleListProvince') &&
                  <FormItem
                    validateStatus={formService.getValidationStatus<AppUser>(
                      appUser.errors,
                      nameof(appUser.province),
                    )}
                    help={appUser.errors?.province}
                  >
                    <span className="label-input ml-3">
                      {translate('appUsers.province')}
                    </span>
                    <SelectAutoComplete
                      value={appUser.province?.id}
                      onChange={handleChangeObjectField(nameof(appUser.province))}
                      getList={appUserRepository.singleListProvince}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      searchField={nameof(provinceFilter.name)}
                      searchType={nameof(provinceFilter.name.contain)}
                      placeholder={translate('appUsers.placeholder.province')}
                      list={defaultProvinceList}
                      allowClear={true}
                    />
                  </FormItem>
                }
                {validAction('singleListPosition') &&
                  <FormItem
                    validateStatus={formService.getValidationStatus<AppUser>(
                      appUser.errors,
                      nameof(appUser.position),
                    )}
                    help={appUser.errors?.position}
                  >
                    <span className="label-input ml-3">
                      {translate('appUsers.position')}
                    </span>
                    <SelectAutoComplete
                      value={appUser.position?.id}
                      onChange={handleChangeObjectField(nameof(appUser.position))}
                      getList={appUserRepository.singleListPosition}
                      modelFilter={positionFilter}
                      setModelFilter={setPositionFilter}
                      searchField={nameof(positionFilter.name)}
                      searchType={nameof(positionFilter.name.contain)}
                      placeholder={translate('appUsers.placeholder.position')}
                      list={defaultPositionList}
                      allowClear={true}
                    />
                  </FormItem>
                }
              </Col>
            </Row>
          </Form>
          {validAction('listSite') &&
            <>
              <div className="title mt-3 mb-4">
                {translate('appUsers.permisitions')}
              </div>
              {
                appUserSiteMappings.length > 0 &&
                appUserSiteMappings.map(
                  (appUserSiteMapping: AppUserSiteMapping, index: number) => (

                    <Row key={index} className="ml-4 mt-3">
                      <Col lg={3}>
                        <label className="label-input ml-2">
                          {appUserSiteMapping?.site.name}
                        </label>
                      </Col>
                      <Col lg={2} className="switch-permisition ml-2">
                        <Switch
                          checked={appUserSiteMapping.enabled === true}
                          onChange={handleChangeSiteMapping(index)}
                        />
                      </Col>
                    </Row>
                  ),
                )
              }
            </>
          }
        </Card>
      </Spin>
    </div>
  );
}

export default AppUserDetail;
