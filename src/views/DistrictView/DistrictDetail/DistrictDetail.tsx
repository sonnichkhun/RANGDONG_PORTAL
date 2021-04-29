import { Col, Row } from 'antd';
import Form from 'antd/lib/form';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { districtRepository } from 'views/DistrictView/DistrictRepository';
import './DistrictDetail.scss';
import { formService } from 'core/services/FormService';
import { API_DISTRICT_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;
export interface DistrictDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListDistrict?: (filter: TFilter) => Promise<T[]>;
  setListDistrict?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function DistrictDetail<T extends Model, TFilter extends ModelFilter>(
  props: DistrictDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListDistrict,
    setListDistrict,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('district', API_DISTRICT_ROUTE, 'portal');

  // Hooks, useDetail, useChangeHandler
  const [district, setDistrict, , , handleSave] = crudService.usePopupDetail(
    District,
    DistrictFilter,
    isDetail,
    currentItem,
    setVisible,
    districtRepository.get,
    districtRepository.save,
    getListDistrict,
    setListDistrict,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<District>(district, setDistrict);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [provinceFilter, setProvinceFilter] = React.useState<ProvinceFilter>(
    new ProvinceFilter(),
  );
  const defaultProvinceList: Province[] = crudService.useDefaultList<Province>(
    district.province,
  );
  const handleCancel = React.useCallback(
    event => {
      if (props.onClose) {
        props.onClose(event);
      }
    },
    [props],
  );
  return (
    <>
      <Modal
        isOpen={visible}
        toggle={handleCancel}
        className="form-modal-detail"
      >
        <ModalHeader>
          {isDetail === false
            ? translate('districts.detail.title')
            : translate('districts.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col>
                <FormItem className="mb-3"
                  validateStatus={formService.getValidationStatus<District>(
                    district.errors,
                    nameof(district.code),
                  )}
                  help={district.errors?.code}
                >
                  <span className="label-input mr-3  ml-2">
                    {translate('districts.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={district.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(district.code))}
                    placeholder={translate('districts.placeholder.code')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem className="mb-3"
                  validateStatus={formService.getValidationStatus<District>(
                    district.errors,
                    nameof(district.name),
                  )}
                  help={district.errors?.name}
                >
                  <span className="label-input mr-3  ml-2">
                    {translate('districts.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={district.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(district.name))}
                    placeholder={translate('districts.placeholder.name')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              {validAction('singleListProvince') &&
                <Col>
                  <FormItem className="mb-3">
                    <span className="label-input mr-3  ml-2">
                      {translate('districts.province')}
                    </span>
                    <SelectAutoComplete
                      value={district.province?.id}
                      onChange={handleChangeObjectField(
                        nameof(district.province),
                      )}
                      getList={districtRepository.singleListProvince}
                      list={defaultProvinceList}
                      modelFilter={provinceFilter}
                      setModelFilter={setProvinceFilter}
                      searchField={nameof(provinceFilter.id)}
                      searchType={nameof(provinceFilter.name.contain)}
                      placeholder={translate('provinces.placeholder.province')}
                      allowClear={true}
                    />
                  </FormItem>
                </Col>
              }
            </Row>
            <Row>
              <Col>
                <FormItem className="mb-3">
                  <span className="label-input mr-3 ml-2">
                    {translate('districts.priority')}
                  </span>
                  <input
                    type="number"
                    defaultValue={district.priority}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(
                      nameof(district.priority),
                    )}
                    placeholder={translate('districts.placeholder.priority')}
                  />
                </FormItem>
              </Col>
              <div className="d-flex justify-content-end mt-4">
                {!isDetail && validAction('create') &&
                  <button className="btn btn-sm btn-primary" onClick={handleSave}>
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                }
                {isDetail && validAction('update') &&
                  <button className="btn btn-sm btn-primary" onClick={handleSave}>
                    <i className="fa mr-2 fa-save" />
                    {translate(generalLanguageKeys.actions.save)}
                  </button>
                }
                <button
                  className="btn btn-sm btn-outline-primary ml-2"
                  onClick={handleCancel}
                >
                  <i className="fa mr-2 fa-times-circle" />
                  {translate(generalLanguageKeys.actions.cancel)}
                </button>
              </div>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default DistrictDetail;
