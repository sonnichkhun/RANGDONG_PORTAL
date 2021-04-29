import { Col, Row } from 'antd';
import Form from 'antd/lib/form';
import SelectAutoComplete from 'components/SelectAutoComplete/SelectAutoComplete';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { District } from 'models/District';
import { DistrictFilter } from 'models/DistrictFilter';
import { Ward } from 'models/Ward';
import { WardFilter } from 'models/WardFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { wardRepository } from 'views/WardView/WardRepository';
import './WardDetail.scss';
import { formService } from 'core/services/FormService';
import { API_WARD_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;
export interface WardDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListWard?: (filter: TFilter) => Promise<T[]>;
  setListWard?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}



function WardDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: WardDetailProps<T, TFilter>) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListWard,
    setListWard,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('ward', API_WARD_ROUTE, 'portal');

  // Hooks, useDetail, useChangeHandler
  const [
    ward,
    setWard,
    ,
    ,
    handleSave,
    // handleClose,
  ] = crudService.usePopupDetail(
    Ward,
    WardFilter,
    isDetail,
    currentItem,
    setVisible,
    wardRepository.get,
    wardRepository.save,
    getListWard,
    setListWard,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Ward>(ward, setWard);

  // Enums  -----------------------------------------------------------------------------------------------------------------------------------------

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

  const [districtFilter, setDistrictFilter] = React.useState<DistrictFilter>(
    new DistrictFilter(),
  );

  // Default List -----------------------------------------------------------------------------------------------------------------------------------

  const defaultDistrictList: District[] = crudService.useDefaultList<District>(
    ward.district,
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
    <div>
      <Modal isOpen={visible} toggle={handleCancel} className="form-modal-detail">
        <ModalHeader>
          {isDetail === false
            ? translate('wards.detail.title')
            : translate('wards.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form >
            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Ward>(
                    ward.errors,
                    nameof(ward.code),
                  )}
                  help={ward.errors?.code}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('wards.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={ward.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(ward.code))}
                    placeholder={translate('wards.placeholder.code')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col >
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Ward>(
                    ward.errors,
                    nameof(ward.name),
                  )}
                  help={ward.errors?.name}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('wards.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={ward.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(ward.name))}
                    placeholder={translate('wards.placeholder.name')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              {validAction('singleListDistrict') &&
                <Col >
                  <FormItem
                    className="mb-3"
                  >
                    <span className="label-input mr-3 ml-2">
                      {translate('wards.district')}
                    </span>
                    <SelectAutoComplete
                      value={ward.district?.id}
                      onChange={handleChangeObjectField(nameof(ward.district))}
                      getList={wardRepository.singleListDistrict}
                      list={defaultDistrictList}
                      modelFilter={districtFilter}
                      setModelFilter={setDistrictFilter}
                      searchField={nameof(districtFilter.id)}
                      searchType={nameof(districtFilter.name.contain)}
                      placeholder={translate('districts.placeholder.district')}
                      allowClear={true}
                    />
                  </FormItem>
                </Col>
              }
            </Row>

            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('districts.priority')}
                  </span>
                  <input
                    type="number"
                    defaultValue={ward.priority}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(ward.priority))}
                    placeholder={translate('wards.placeholder.priority')}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className="d-flex justify-content-end mt-4">
            {isDetail && validAction('update') &&
              <button className="btn btn-sm btn-primary" onClick={handleSave}>
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
            }
            {!isDetail && validAction('create') &&
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
        </ModalBody>
      </Modal>
    </div>
  );
}

export default WardDetail;
