import { Card, Col, DatePicker, Form, Input, Radio, Row } from 'antd';
import Tabs from 'antd/lib/tabs';
import classNames from 'classnames';
import AvatarBase64Uploader from 'components/AvatarUploader/AvatarBase64Uploader';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import {
  generalLanguageKeys,
  STANDARD_DATE_FORMAT_INVERSE,
} from 'config/consts';
import { CHANGE_PASSWORD_ROUTE, PROFILE_ROUTE } from 'config/route-consts';
import { formatInputDate } from 'core/helpers/date-time';
import { crudService, formService } from 'core/services';
import { AppUser } from 'models/AppUser';
import { AppUserSiteMapping } from 'models/AppUserSiteMapping';
import { Organization } from 'models/Organization';
import { OrganizationFilter } from 'models/OrganizationFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import { Sex } from 'models/Sex';
import path from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import nameof from 'ts-nameof.macro';
import { notification } from '../../helpers/notification';
import './Profile.scss';
import { profileRepository } from './ProfileRepository';

const { Item: FormItem } = Form;
function Profile() {
  const [translate] = useTranslation();
  const history = useHistory();
  const [appUser, setUser] = React.useState<AppUser>(new AppUser());

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
    handleUpdateDateField,
  ] = crudService.useChangeHandlers<AppUser>(appUser, setUser);

  const [organizationFilter, setOrganizationFilter] = React.useState<
    OrganizationFilter
  >(new OrganizationFilter());

  const defaultOrganizationList: Organization[] = crudService.useDefaultList<
    Organization
  >(appUser.organization);

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );

  const defaultProvinceList: Province[] = crudService.useDefaultList<Province>(
    appUser.province,
  );

  const [userSexList] = crudService.useEnumList<Sex>(
    profileRepository.singleListSex,
  );

  const [newPass, setNewPass] = React.useState<string>(null);
  const [confirmPass, setConfirmPass] = React.useState<string>(null);
  const [checkPass, setCheckPass] = React.useState<boolean>(false);
  const [changePass, setchangePass] = React.useState<AppUser>(null);
  const [activeKey, setActiveKey] = React.useState<string>('1');
  React.useEffect(() => {
    profileRepository.get().then(respon => {
      setUser(respon);
    });
  }, []);

  const handleChangeSex = React.useCallback(
    event => {
      const sexId: number = event.target.value;
      setUser({
        ...appUser,
        sexId,
      });
    },
    [appUser, setUser],
  );

  const handleSave = React.useCallback(() => {
    profileRepository
      .update(appUser)
      .then(respon => {
        setUser(respon);
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
      })
      .catch((error: Error) => {
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [appUser, translate]);

  const handleChangeNewPass = React.useCallback(event => {
    setNewPass(event.target.value);
    setCheckPass(false);
  }, []);

  const handleChangeConfirmPassword = React.useCallback(
    event => {
      const confirmPass: string = event.target.value;
      setConfirmPass(event.target.value);
      if (confirmPass === newPass) {
        setUser({
          ...appUser,
          newPassword: confirmPass,
        });
        setchangePass({
          ...changePass,
          id: appUser?.id,
          oldPassword: appUser?.oldPassword,
          newPassword: confirmPass,
        });
        setCheckPass(true);
      }
    },
    [appUser, newPass, changePass],
  );

  const handleChangeImage = React.useCallback(
    (value: string) => {
      if (value) {
        setUser({
          ...appUser,
          avatar: value,
        });
      }
    },
    [appUser],
  );

  const handleSaveChangePass = React.useCallback(() => {
    profileRepository
      .changePassword(changePass)
      .then(repon => {
        setUser({
          ...repon,
          oldPassword: null,
        });
        setNewPass(null);
        setConfirmPass(null);
        notification.success({
          message: translate(generalLanguageKeys.update.success),
        });
      })
      .catch((error: Error) => {
        notification.error({
          message: translate(generalLanguageKeys.update.error),
          description: error.message,
        });
      });
  }, [changePass, translate]);

  React.useEffect(() => {
    const url = document.URL;
    if (url.includes('/change-password')) {
      setActiveKey('2');
    }
  }, []);

  const handleClickTabs = React.useCallback(
    key => {
      if (key === '1') {
        history.push(path.join(PROFILE_ROUTE));
        setActiveKey('1');
      }
      if (key === '2') {
        history.push(path.join(CHANGE_PASSWORD_ROUTE));
        setActiveKey('2');
      }
    },
    [history],
  );

  return (
    <>
      <div className="page detail-page profile">
        <Card>
          <Tabs activeKey={activeKey} onChange={handleClickTabs}>
            <Tabs.TabPane key="1" tab={translate('profiles.general.title')}>
              <Form>
                <Row>
                  <Col className="ml-4">
                    <div className="ml-2">
                      <AvatarBase64Uploader
                        defaultValue={appUser?.avatar}
                        onCroppedComplete={handleChangeImage}
                        onUploadImage={profileRepository.saveImage}
                      />
                    </div>
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
                        placeholder={translate('appUsers.placeholder.username')}
                        disabled
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
                        placeholder={translate(
                          'appUsers.placeholder.displayName',
                        )}
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
                      </span>
                      <input
                        type="text"
                        defaultValue={appUser.phone}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(appUser.phone),
                        )}
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
                      </span>
                      <input
                        type="text"
                        defaultValue={appUser.email}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(appUser.email),
                        )}
                        placeholder={translate('appUsers.placeholder.email')}
                      />
                    </FormItem>
                  </Col>
                  <Col lg={2}></Col>
                  <Col lg={11}>
                    <FormItem
                      validateStatus={formService.getValidationStatus<AppUser>(
                        appUser.errors,
                        nameof(appUser.organization),
                      )}
                      help={appUser.errors?.organization}
                    >
                      <span className="label-input ml-3">
                        {translate('stores.organization')}
                      </span>
                      <SelectAutoComplete
                        value={appUser.organization?.id}
                        onChange={handleChangeObjectField(
                          nameof(appUser.organization),
                        )}
                        getList={profileRepository.singleListOrganization}
                        modelFilter={organizationFilter}
                        setModelFilter={setOrganizationFilter}
                        searchField={nameof(organizationFilter.name)}
                        searchType={nameof(organizationFilter.name.contain)}
                        placeholder={translate(
                          'stores.placeholder.organization',
                        )}
                        list={defaultOrganizationList}
                        allowClear={true}
                        disabled
                      />
                    </FormItem>
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
                        onChange={handleUpdateDateField(
                          nameof(appUser.birthday),
                        )}
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
                        onChange={handleChangeSimpleField(
                          nameof(appUser.address),
                        )}
                        placeholder={translate('appUsers.placeholder.address')}
                      />
                    </FormItem>
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
                        onChange={handleChangeObjectField(
                          nameof(appUser.province),
                        )}
                        getList={profileRepository.singleListProvince}
                        modelFilter={provinceFilter}
                        setModelFilter={setProvinceFilter}
                        searchField={nameof(provinceFilter.name)}
                        searchType={nameof(provinceFilter.name.contain)}
                        placeholder={translate('appUsers.placeholder.province')}
                        list={defaultProvinceList}
                        allowClear={true}
                      />
                    </FormItem>
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
                      </Radio.Group>
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Row className="mb-3">
                <div className="mr-2">
                  <button
                    className="btn btn-sm btn-primary float-right mr-4"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                </div>
              </Row>
            </Tabs.TabPane>

            <Tabs.TabPane key="2" tab={translate('profiles.changePass.title')}>
              <Form>
                <Row>
                  <Col lg={11}>
                    <FormItem
                      validateStatus={formService.getValidationStatus<AppUser>(
                        appUser.errors,
                        nameof(appUser.oldPassword),
                      )}
                      help={appUser.errors?.oldPassword}
                    >
                      <span className="label-input ml-3">
                        {translate('profiles.oldPassword')}
                      </span>
                      <Input
                        type="password"
                        value={appUser.oldPassword || null}
                        className="form-control form-control-sm"
                        onChange={handleChangeSimpleField(
                          nameof(appUser.oldPassword),
                        )}
                        placeholder={translate(
                          'profiles.placeholder.oldPassword',
                        )}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col lg={11}>
                    <FormItem
                      validateStatus={formService.getValidationStatus<AppUser>(
                        appUser.errors,
                        nameof(appUser.newPassword),
                      )}
                      help={appUser.errors?.newPassword}
                    >
                      <span className="label-input ml-3">
                        {translate('profiles.newPassword')}
                      </span>
                      <Input
                        type="password"
                        value={newPass || null}
                        className="form-control form-control-sm"
                        onChange={handleChangeNewPass}
                        placeholder={translate(
                          'profiles.placeholder.newPassword',
                        )}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col lg={11}>
                    <FormItem>
                      <span className="label-input ml-3">
                        {translate('profiles.confirmPass')}
                      </span>
                      <Input
                        type="password"
                        className="form-control form-control-sm"
                        onChange={handleChangeConfirmPassword}
                        placeholder={translate(
                          'profiles.placeholder.confirmPass',
                        )}
                        value={confirmPass || null}
                      />
                      <i
                        className={classNames(' ml-2 mt-2', {
                          'tio-done': checkPass && confirmPass !== null,
                          'tio-clear': !checkPass && confirmPass !== null,
                        })}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Form>
              <Row className="mb-2">
                <div className="mr-2">
                  <button
                    className="btn btn-sm btn-primary float-right mr-4"
                    onClick={handleSaveChangePass}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                </div>
              </Row>
            </Tabs.TabPane>
          </Tabs>
        </Card>
        <Card
          className="mt-3"
          title={
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-start">
                <div className="pt-1 pl-1 ml-4">
                  {translate('profiles.permission.title')}
                </div>
              </div>
            </div>
          }
        >
          {appUser.appUserSiteMappings &&
            appUser.appUserSiteMappings.length > 0 &&
            appUser.appUserSiteMappings.map(
              (appUserSiteMapping: AppUserSiteMapping, index: number) => (
                <Row key={index} className="ml-4 mt-3">
                  <Col lg={3}>
                    <label>{appUserSiteMapping?.site?.name}</label>
                  </Col>
                  <Col lg={2}>
                    <div
                      className={
                        appUserSiteMapping?.enabled === true ? 'active' : ''
                      }
                    >
                      <i className="fa fa-check-circle d-flex align-items-center justify-content-end"></i>
                    </div>
                  </Col>
                </Row>
              ),
            )}
        </Card>
      </div>
    </>
  );
}

export default Profile;
