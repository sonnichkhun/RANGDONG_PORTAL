import { Col, Form } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { generalLanguageKeys } from 'config/consts';
import { Model, ModelFilter } from 'core/models';
import { AppUser } from 'models/AppUser';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody } from 'reactstrap';
import Modal from 'reactstrap/lib/Modal';
import './Modal.scss';

export interface ChangePasswordModalProps<T, TFilter> {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getListAppUser?: (filter: TFilter) => Promise<T[]>;
  setListAppUser?: Dispatch<SetStateAction<T[]>>;
  currentItem?: AppUser;
  setCurrentItem: Dispatch<SetStateAction<AppUser>>;
  onClose?: (event) => void;
  onSave?: (event) => void;
}

export default function ChangePasswordModal<
  T extends Model,
  TFilter extends ModelFilter
>(props: ChangePasswordModalProps<T, TFilter>) {
  const {
    currentItem,
    visible,
    // setVisible,
    // getListAppUser,
    // setListAppUser,
    setCurrentItem,
    onSave,
  } = props;
  const [translate] = useTranslation();
  const [pass, setPass] = React.useState<string>('');
  const [cfPass, setCfPass] = React.useState<string>('');
  const [errorVisible, setErrorVisible] = React.useState<boolean>(false);
  const [errorName, setErrorName] = React.useState<string>('');

  const handleChangePassword = React.useCallback(
    event => {
      const newPass: string = event.target.value;
      setPass(newPass);
      setErrorVisible(false);
    },
    [setPass],
  );
  const handleChangeConfirmPassword = React.useCallback(
    event => {
      const newPass: string = event.target.value;
      setCfPass(newPass);
      setErrorVisible(false);
    },
    [setCfPass],
  );

  const SaveNewPassword = React.useCallback(({ pass, cfPass, onSave }) => {
    if (pass === '') {
      setErrorVisible(true);
      setErrorName(translate('appUsers.changePassword.notHavePassword'));
    }
    else if (cfPass === '') {
      setErrorVisible(true);
      setErrorName(translate('appUsers.changePassword.notHaveREPassword'));
    }
    else if (pass !== cfPass) {
      setErrorVisible(true);
      setErrorName(translate('appUsers.changePassword.passWordNotSame'));
    }
    else if (pass === cfPass) {
      currentItem.newPassword = pass;
      setCurrentItem(currentItem);
      onSave(currentItem);
    }
  }, [currentItem, setCurrentItem, translate]);

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
        className="form-modal-detail"
        isOpen={visible}
        toggle={handleCancel}
      >
        <ModalBody>
          <div className="title">
            {translate('appUsers.changePassword.title')}: {currentItem.username}
          </div>
          <Form>
            <Col>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('appUsers.changePassword.newPass')}
                </span>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  onChange={handleChangePassword}
                  placeholder={translate('appUsers.changePassword.newPass')}
                />
              </FormItem>
              <FormItem>
                <span className="label-input mr-3">
                  {translate('appUsers.changePassword.confirmPass')}
                </span>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  onChange={handleChangeConfirmPassword}
                  placeholder={translate('appUsers.changePassword.confirmPass')}
                />
              </FormItem>
              {errorVisible === true ?
                <div className="text-danger mt-2 erorr-pass">{errorName}</div> : <br />
              }
            </Col>
            <div className="d-flex justify-content-end mt-4">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => SaveNewPassword({ pass, cfPass, onSave })}
              // disabled={!formIsValid}
              >
                <i className="fa mr-2 fa-save" />
                {translate(generalLanguageKeys.actions.save)}
              </button>
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
