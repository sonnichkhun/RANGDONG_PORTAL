import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

export interface GetOtpProps {
  onChangeOtp?: (ev: ChangeEvent<HTMLInputElement>) => void;
  showLogin?: () => void;
  onSendOtp?: () => void;
  otp?: string;
  errorMessageOtp?: any;
}

export default function GetOtp({
  onChangeOtp,
  showLogin,
  onSendOtp,
  otp,
  errorMessageOtp,
}: GetOtpProps) {
  const [translate] = useTranslation();
  return (
    <div className="forgot-password-content login-content">
      <div className="title-content text-transform-uppercase">OTP</div>
      <div className="mt-3 under-title">
        <span>
          {translate('login.getOtp.title')}
          {/* Vui lòng nhập email của bạn để nhận hướng dẫn lấy lại mật khẩu */}
        </span>
      </div>
      <div className="email mt-2">
        <input
          type="text"
          className="ant-input ant-input-sm  mb-3 input-login"
          placeholder={translate('login.placeholder.getOtp')}
          onChange={onChangeOtp}
        />
        {errorMessageOtp !== null && (
          <div className="login-error mt-3 p-2">{errorMessageOtp}</div>
        )}
      </div>
      <div className="row mt-3">
        <div className="col pointer" onClick={showLogin}>
          <i className="tio-arrow_backward mr-2"></i>
          <span>{translate('login.goBack')}</span>
        </div>
        <div className="col forgot-pass d-flex justify-content-end">
          <button
            className="btn btn-primary btn-sm btn-login"
            onClick={onSendOtp}
            disabled={otp === null}
          >
            {translate('login.getPassword')}
          </button>
        </div>
      </div>
    </div>
  );
}
