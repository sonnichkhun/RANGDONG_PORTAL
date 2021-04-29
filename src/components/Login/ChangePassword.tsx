import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
export interface ChangePasswordProps {
  onChangeNewPass?: (ev: ChangeEvent<HTMLInputElement>) => void;
  onChangeConfirmPassword?: (ev: ChangeEvent<HTMLInputElement>) => void;
  onChangePass?: () => void;
  checkPass?: boolean;
  confirmPass?: string;
  showLogin?: () => void;

}
export default function ChangePassword({ checkPass, onChangeNewPass, onChangeConfirmPassword, confirmPass, showLogin, onChangePass }: ChangePasswordProps) {
  const [translate] = useTranslation();
  return (
    <div className="login-content">
      <div className="title-content ">{translate('login.resetPassword')}</div>
      <div className="user-name mt-3">
        <label htmlFor="username">
          {translate('login.newPass')} <span className="text-danger"> *</span>
        </label>
        <input
          type="password"
          className="ant-input ant-input-sm  mb-3 input-login"
          placeholder="Nhập mật khẩu"
          onChange={onChangeNewPass}
        />
      </div>
      <div className="password">
        <label htmlFor="username">
          {translate('login.confirmPass')}{' '}
          <span className="text-danger"> *</span>
        </label>
        <div className="confirm d-flex">
          <input
            type="password"
            className="ant-input ant-input-sm mb-3 input-login input-confirm"
            placeholder="Nhập lại mật khẩu"
            onChange={onChangeConfirmPassword}
          />
          <i
            className={classNames(' ml-2 mt-2', {
              'tio-done': checkPass && confirmPass !== null,
              'tio-clear': !checkPass && confirmPass !== null,
            })}
          />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col pointer" onClick={showLogin}>
          <i className="tio-arrow_backward mr-2"></i>
          <span>{translate('login.goBack')}</span>
        </div>
        <div className="col forgot-pass d-flex justify-content-end">
          <button
            className="btn btn-primary btn-sm btn-login"
            onClick={onChangePass}
            disabled={!checkPass}
          >
            {translate('login.changePass')}
          </button>
        </div>
      </div>
    </div>
  );
}
