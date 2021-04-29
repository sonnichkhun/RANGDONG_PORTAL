import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import './Login.scss';

export interface ForgotPasswordProps {
  onChangeEmail?: (event: ChangeEvent<HTMLInputElement>) => void;
  onSendMail?: () => void;
  showLogin?: () => void;
}

export default function ForgotPassword({ onChangeEmail, onSendMail, showLogin }: ForgotPasswordProps) {
  const [translate] = useTranslation();

  return (
    <div className="forgot-password-content login-content">
      <div className="title-content ">Lấy lại mật khẩu!</div>
      <div className="mt-3 under-title">
        <span>
          Vui lòng nhập email của bạn để nhận hướng dẫn lấy lại mật khẩu
        </span>
      </div>
      <div className="email mt-2">
        <input
          type="text"
          className="ant-input ant-input-sm mb-3 input-login"
          placeholder="Email"
          onChange={onChangeEmail}
        />
      </div>
      <div className="row mt-3">
        <div className="col pointer forgot-password" onClick={showLogin}>
          <i className="tio-arrow_backward mr-2"></i>
          <span>{translate('login.goBack')}</span>
        </div>
        <div className="col forgot-pass d-flex justify-content-end">
          <button
            className="btn btn-primary btn-sm btn-login "
            onClick={onSendMail}
          >
            {translate('login.sendMail')}
          </button>
        </div>
      </div>
    </div>
  );
}
