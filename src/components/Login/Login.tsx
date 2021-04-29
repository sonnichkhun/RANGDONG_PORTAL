import FormItem from 'antd/lib/form/FormItem';
import Spin from 'antd/lib/spin';
import { AppUser } from 'models/AppUser';
import React, { useState } from 'react';
import nameof from 'ts-nameof.macro';
import ChangePassword from './ChangePassword';
import ForgotPassword from './ForgotPassword';
import GetOtp from './GetOtp';
import './Login.scss';
import useLogin from './LoginService';

function Login() {
  const [appUser, setAppUser] = useState<AppUser>({
    ...new AppUser(),
    username: '',
    password: '',
  });
  const [errorMessageUsername, setErrorMessageUsername] = useState<string>(null);
  const [errorMessagePass, setErrorMessagePass] = useState<string>(null);
  const [errorMessageOtp, setErrorMessageOtp] = useState<string>(null);
  const [
    loginVisible,
    forgotPasswordVisible,
    getOtpVisible,
    changePassVisible,
    loading,
    checkPass,
    confirmPass,
    showForgotPassword,
    handleChangeEmail,
    handleChangeOtp,
    handleSendOtp,
    handleSendMail,
    handleChangeNewPass,
    handleChangeConfirmPassword,
    handleChangePass,
    showLogin,
    handleLogin,
    handleChangeField,
    handleEnter,
    logo,
    otp,
  ] = useLogin(appUser, setAppUser, setErrorMessageUsername, setErrorMessagePass, setErrorMessageOtp);

  return (
    <>
      <div className="login-page">
        {/* <BackGround /> */}
        <div className="login-box">
          <div className="logo">
            <img src={logo.icon} alt={'noImage'} width="150px" />
            {/* <div>
            <span className="info-text">{logo.name}</span>
          </div> */}
          </div>
          <div className="flex-container flex-container-row mt-5">
            {/* <div className="flex-item mr-3 mt-5">
              <div className="gateway">
                <img className="mt-5" src="assets/img/brand/portal-login.png" alt={'noImage'} />
              </div>
            </div> */}
            <div className="flex-item mr-3 mt-5">
              <div className="title gateway">
                <img className="mt-5" src="assets/icons/portal.svg" alt={'noImage'} />
                <div className="title-content mt-1">Cổng thông tin ứng dụng doanh nghiệp</div>
              </div>
              <div className="login-frame mt-4">
                <Spin spinning={loading}>
                  {loginVisible === true && (
                    <div className="login-content">
                      {/* errors */}

                      <div className="user-name">
                        <FormItem>
                          <label htmlFor="username">
                            Tên đăng nhập <span className="text-danger"> *</span>
                          </label>

                          <div className="right-inner-addon input-container">
                            <img className="icon-search" src="assets/icons/user.svg" alt="" />
                            <input
                              type="text"
                              value={appUser.username}
                              className="ant-input ant-input-sm mb-3 input-login"
                              placeholder="Nhập tên đăng nhập"
                              onChange={handleChangeField(nameof(appUser.username))}
                              onKeyDown={handleEnter}
                              autoComplete={'off'}
                            />
                          </div>
                          {/* {errorMessageUsername !== null && (
                            <div className="login-error mt-1 p-1">{errorMessageUsername}</div>
                          )} */}
                          <div className="login-error mt-1 p-1">
                            {errorMessageUsername !== null && (
                              <>
                                {errorMessageUsername}
                              </>
                            )}
                          </div>

                        </FormItem>
                      </div>
                      <div className="password mt-4">
                        <FormItem>
                          <label htmlFor="username">
                            Mật khẩu <span className="text-danger"> *</span>
                          </label>
                          <div className="right-inner-addon input-container">
                            <img className="icon-search" src="assets/icons/lock.svg" alt="" />
                            <input
                              type="password"
                              value={appUser.password}
                              className="ant-input ant-input-sm  mb-3 input-login"
                              placeholder="Nhập mật khẩu"
                              onChange={handleChangeField(nameof(appUser.password))}
                              onKeyDown={handleEnter}
                            />
                            <div className="login-error mt-1 p-1">
                              {errorMessagePass !== null && (
                                <>
                                  {errorMessagePass}
                                </>
                              )}
                            </div>

                          </div>

                        </FormItem>
                      </div>
                      <div className="justify-content-end">
                        <div className="forgot-password pointer">
                          <span
                            className="mt-2 "
                            onClick={() => showForgotPassword()}
                          >
                            Quên mật khẩu
                    </span>
                        </div>
                      </div>
                      <div className="action-login">
                        <div className="login d-flex float-right ml-5">
                          <button
                            className="btn btn-primary btn-sm btn-login"
                            onClick={handleLogin}
                            disabled={errorMessagePass !== null || errorMessageUsername !== null}
                          >
                            Đăng nhập
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {forgotPasswordVisible === true && (
                    <ForgotPassword
                      onChangeEmail={handleChangeEmail}
                      onSendMail={handleSendMail}
                      showLogin={showLogin}
                    />
                  )}

                  {getOtpVisible === true && (
                    <GetOtp
                      onChangeOtp={handleChangeOtp}
                      showLogin={showLogin}
                      onSendOtp={handleSendOtp}
                      otp={otp}
                      errorMessageOtp={errorMessageOtp}
                    />
                  )}
                  {changePassVisible === true && (
                    <ChangePassword
                      onChangeNewPass={handleChangeNewPass}
                      onChangeConfirmPassword={handleChangeConfirmPassword}
                      onChangePass={handleChangePass}
                      checkPass={checkPass}
                      confirmPass={confirmPass}
                      showLogin={showLogin}
                    />
                  )}
                </Spin>
              </div>
            </div>

          </div>
        </div>


      </div>
    </>
  );
}

export default Login;
