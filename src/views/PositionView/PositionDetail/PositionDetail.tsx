import { Col, Row } from 'antd';
import Form from 'antd/lib/form';
import Switch from 'components/Switch/Switch';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { crudService } from 'core/services';
import { Position } from 'models/Position';
import { PositionFilter } from 'models/PositionFilter';
import { Status } from 'models/Status';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import nameof from 'ts-nameof.macro';
import { positionRepository } from 'views/PositionView/PositionRepository';
import './PositionDetail.scss';
import { formService } from 'core/services/FormService';
import { API_POSITION_ROUTE } from 'config/api-consts';

const { Item: FormItem } = Form;
export interface PositionDetailProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListPosition?: (filter: TFilter) => Promise<T[]>;
  setListPosition?: Dispatch<SetStateAction<T[]>>;
  currentItem?: T;
  onClose?: (event) => void;
  isDetail?: boolean;
  setLoadList?: Dispatch<SetStateAction<boolean>>;
}

function PositionDetail<T extends Model, TFilter extends ModelFilter>(
  props: PositionDetailProps<T, TFilter>,
) {
  const {
    isDetail,
    currentItem,
    visible,
    setVisible,
    getListPosition,
    setListPosition,
    setLoadList,
  } = props;
  const [translate] = useTranslation();
  const { validAction } = crudService.useAction('position', API_POSITION_ROUTE, 'portal');
  const [statusList] = crudService.useEnumList<Status>(
    positionRepository.singleListStatus,
  );
  // Hooks, useDetail, useChangeHandler
  const [position, setPosition, , , handleSave] = crudService.usePopupDetail(
    Position,
    PositionFilter,
    isDetail,
    currentItem,
    setVisible,
    positionRepository.get,
    positionRepository.save,
    getListPosition,
    setListPosition,
    setLoadList,
  );

  const [
    handleChangeSimpleField,
    handleChangeObjectField,
  ] = crudService.useChangeHandlers<Position>(position, setPosition);

  // Reference  -------------------------------------------------------------------------------------------------------------------------------------

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
            ? translate('positions.detail.title')
            : translate('positions.detail.edit', props?.currentItem)}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Position>(
                    position.errors,
                    nameof(position.code),
                  )}
                  help={position.errors?.code}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('positions.code')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={position.code}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(position.code))}
                    placeholder={translate('positions.placeholder.code')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem
                  className="mb-3"
                  validateStatus={formService.getValidationStatus<Position>(
                    position.errors,
                    nameof(position.name),
                  )}
                  help={position.errors?.name}
                >
                  <span className="label-input mr-3 ml-2">
                    {translate('positions.name')}
                    <span className="text-danger">*</span>
                  </span>
                  <input
                    type="text"
                    defaultValue={position.name}
                    className="form-control form-control-sm"
                    onChange={handleChangeSimpleField(nameof(position.name))}
                    placeholder={translate('positions.placeholder.name')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              {validAction('singleListStatus') &&
                <Col>
                  <FormItem
                    validateStatus={formService.getValidationStatus<Position>(
                      position.errors,
                      nameof(position.status),
                    )}
                    help={position.errors?.status}
                  >
                    <span className="label-input mr-3 ml-2">
                      {translate('positions.status')}
                    </span>
                    <Switch
                      checked={
                        position.statusId === statusList[1]?.id
                      }
                      list={statusList}
                      onChange={handleChangeObjectField(nameof(position.status))}
                    />
                  </FormItem>
                </Col>
              }
            </Row>
            <Row>

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

export default PositionDetail;
