import { Col, Row } from 'antd';
import Form from 'antd/lib/form';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { formService } from 'core/services/FormService';
import { Province } from 'models/Province';
import { ProvinceFilter } from 'models/ProvinceFilter';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { provinceRepository } from 'views/ProvinceView/ProvinceRepository';
import './ProvinceDetail.scss';
import { API_PROVINCE_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;

export interface ProvinceDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListProvince?: (filter: TFilter) => Promise<T[]>;
  setListProvince?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function ProvinceDetail<
  T extends Model,
  TFilter extends ModelFilter
>(props: ProvinceDetailProps<T, TFilter>) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListProvince,
    setListProvince,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('province', API_PROVINCE_ROUTE, 'portal');

  // Hooks, useDetail, useChangeHandler
  const [
    province,
    setProvince,
    ,
    ,
    handleSave,
    // handleClose,
  ] = crudService.usePopupDetail(
    Province,
    ProvinceFilter,
    isDetail,
    currentItem,
    setVisible,
    provinceRepository.get,
    provinceRepository.save,
    getListProvince,
    setListProvince,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
  ] = crudService.useChangeHandlers<Province>(province, setProvince);

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
      <Modal isOpen={visible} toggle={handleCancel} className="form-modal-detail">
        <ModalHeader>
          {isDetail === false
            ? translate('provinces.detail.title')
            : translate('provinces.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form >
            <Row>
              <Col>
                <FormItem
                  className="mb-3"

                  validateStatus={formService.getValidationStatus<Province>(
                    province.errors,
                    nameof(province.code),
                  )}
                  help={province.errors?.code}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('provinces.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={province.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(province.code))}
                    placeholder={translate('provinces.placeholder.code')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col >
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Province>(
                    province.errors,
                    nameof(province.name),
                  )}
                  help={province.errors?.name}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('provinces.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={province.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(province.name))}
                    placeholder={translate('provinces.placeholder.name')}
                  />
                </FormItem>

              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Province>(
                    province.errors,
                    nameof(province.priority),
                  )}
                  help={province.errors?.priority}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('provinces.priority')}
                  </span>
                  <input
                    type="number"
                    defaultValue={province.priority}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(province.priority))}
                    placeholder={translate('provinces.placeholder.priority')}
                  />
                </FormItem>
              </Col>
            </Row>
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
          </Form>

        </ModalBody>

      </Modal>
    </>
  );
}

export default ProvinceDetail;
