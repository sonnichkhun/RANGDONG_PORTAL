import { Col, Row, Switch } from 'antd';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import Spin from 'antd/lib/spin';
import { IImage } from 'components/ImageUpload/ImageUpload';
import { API_SITE_ROUTE } from 'config/api-consts';
import { generalLanguageKeys } from 'config/consts';
import { crudService, routerService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Site } from 'models/Site';
import React from 'react';
import { useTranslation } from 'react-i18next';
import nameof from 'ts-nameof.macro';
import { siteRepository } from '../SiteRepository';
import './SiteDetail.scss';
import TextArea from 'antd/lib/input/TextArea';
import AvatarBase64Uploader from 'components/AvatarUploader/AvatarBase64Uploader';

const { Item: FormItem } = Form;

function SiteDetail() {
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('site', API_SITE_ROUTE, 'portal');
  // Service goback
  const [handleGoBack] = routerService.useGoBack();

  // Hooks, useDetail, useChangeHandler
  const [
    site,
    setSite,
    loading,
    ,
    isDetail,
    handleSave,
  ] = crudService.useDetail(Site, siteRepository.get, siteRepository.save);
  const handleChangeIcon = React.useCallback(
    (value: IImage) => {
      if (value) {
        setSite({
          ...site,
          icon: value.url,
        });
      }
    },
    [setSite, site],
  );

  const handleChangeLogo = React.useCallback(
    (value: IImage) => {
      if (value) {
        setSite({
          ...site,
          logo: value.url,
        });
      }
    },
    [setSite, site],
  );
  const [handleChangeSimpleField] = crudService.useChangeHandlers<Site>(
    site,
    setSite,
  );

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
                {isDetail && validAction('update') && (
                  <button
                    className="btn btn-sm btn-primary float-right"
                    onClick={handleSave}
                  >
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                )}
              </div>
            </div>
          }
        >
          <Form>
            <Row>
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Site>(
                    site.errors,
                    nameof(site.code),
                  )}
                  help={site.errors?.code}
                >
                  <span className="label-input ml-3">
                    {translate('sites.code')}
                  </span>
                  <input
                    type="text"
                    defaultValue={site.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(site.code))}
                    placeholder={translate('sites.placeholder.code')}
                    disabled={true}
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3 mb-3 mt-2">
                    {translate('sites.icon')}
                  </span>
                  <AvatarBase64Uploader
                    defaultValue={site?.icon}
                    onCroppedComplete={handleChangeIcon}
                  />
                </FormItem>
                <FormItem className="mt-1">
                  <span className="label-input ml-3">
                    {translate('sites.description')}
                  </span>
                  <TextArea
                    rows={4}
                    placeholder={translate(`sites.placeholder.description`)}
                    onChange={handleChangeSimpleField(nameof(site.description))}
                    value={site.description}
                  />
                </FormItem>
              </Col>
              <Col lg={2} />
              <Col lg={11}>
                <FormItem
                  validateStatus={formService.getValidationStatus<Site>(
                    site.errors,
                    nameof(site.name),
                  )}
                  help={site.errors?.name}
                >
                  <span className="label-input ml-3">
                    {translate('sites.name')}
                  </span>
                  <input
                    type="text"
                    defaultValue={site.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(site.name))}
                    placeholder={translate('sites.placeholder.name')}
                  />
                </FormItem>
                <FormItem>
                  <span className="label-input ml-3 mb-3 mt-2">
                    {translate('sites.logo')}
                  </span>
                  <AvatarBase64Uploader
                    defaultValue={site?.logo}
                    onCroppedComplete={handleChangeLogo}
                  />
                </FormItem>
                <FormItem
                  validateStatus={formService.getValidationStatus<Site>(
                    site.errors,
                    nameof(site.icon),
                  )}
                  help={site.errors?.icon}
                >
                  <span className="label-input ml-3">
                    {translate('sites.isDisplay')}
                  </span>
                  <Switch
                    checked={site.isDisplay === true}
                    onChange={handleChangeSimpleField(nameof(site.isDisplay))}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default SiteDetail;
