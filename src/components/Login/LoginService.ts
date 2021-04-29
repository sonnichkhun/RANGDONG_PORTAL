import { notification } from 'antd';
import { AxiosError } from 'axios';
import { LANDING_PAGE_ROUTE } from 'config/route-consts';
import { GlobalState } from 'core/config';
import { getParameterByName } from 'core/helpers/query';
import { AppUser } from 'models/AppUser';
import { Logo } from 'models/Logo';
import { ChangeEvent, useCallback, useState, useEffect, useRef } from 'react';
import { setGlobal } from 'reactn';
import authenticationService from 'services/AuthenticationService';
export default function useLogin(
  appUser,
  setAppUser,
  setErrorMessageUsername,
  setErrorMessagePass,
  setErrorMessageOtp,
): [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  string,
  () => void,
  (event: any) => void,
  (event: any) => void,
  () => void,
  () => void,
  (event: any) => void,
  (event: any) => void,
  () => void,
  () => void,
  () => void,
  (field: string) => (ev: any) => void,
  (ev: React.KeyboardEvent<HTMLInputElement>) => void,
  Logo,
  string,
] {
  const [loginVisible, setLoginVisible] = useState(true);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [getOtpVisible, setGetOtpVisible] = useState(false);
  const [changePassVisible, setChangePassVisible] = useState(false);
  const [email, setEmail] = useState<string>(null);
  const [otp, setOtp] = useState<string>(null);
  const [newPass, setNewPass] = useState<string>(null);
  const [confirmPass, setConfirmPass] = useState<string>(null);
  const [checkPass, setCheckPass] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<Logo>(new Logo());
  const ref = useRef<boolean>(true);

  useEffect(() => {
    if (ref) {
      authenticationService.get().then(item => {
        setLogo(item);
        ref.current = false;
      });
    }
  }, [setLogo]);

  const showForgotPassword = () => {
    setLoginVisible(false);
    setForgotPasswordVisible(true);
  };
  const showLogin = () => {
    setLoginVisible(true);
    setForgotPasswordVisible(false);
    setChangePassVisible(false);
    setGetOtpVisible(false);
  };

  const handleLogin = useCallback(() => {
    setLoading(true);
    authenticationService
      .login(appUser)
      .then((user: AppUser) => {
        setGlobal<GlobalState>({
          user,
        });
      })
      .then(() => {
        const redirect =
          getParameterByName('redirect') === null
            ? LANDING_PAGE_ROUTE
            : getParameterByName('redirect');
        window.location.href = `${redirect}`;
      })
      .catch((error: AxiosError<AppUser>) => {
        if (error.response && error.response.status === 400) {
          const { username, password } = error.response.data?.errors;
          if (typeof username !== 'undefined')
            setErrorMessageUsername(username);
          if (typeof password !== 'undefined') setErrorMessagePass(password);
        }
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 400);
      });
  }, [appUser, setErrorMessageUsername, setErrorMessagePass]);

  // handle change email
  const handleChangeEmail = useCallback(event => {
    setEmail(event.target.value);
  }, []);

  // handle change otp
  const handleChangeOtp = useCallback(event => {
    setOtp(event.target.value);
    setErrorMessageOtp(null);
  }, [setErrorMessageOtp]);

  // SendOtp

  const handleSendOtp = useCallback(() => {
    const obj = {
      email,
      otpCode: otp,
    };
    authenticationService
      .verifyOtpCode(obj)
      .then(() => {
        setGetOtpVisible(false);
        setChangePassVisible(true);
      })
      .catch((error: AxiosError<AppUser>) => {
        if (error.response && error.response.status === 400) {
          const { otpCode } = error.response.data?.errors;
          if (typeof otpCode !== 'undefined') setErrorMessageOtp(otpCode);
        }
        setChangePassVisible(false);
      });
  }, [email, otp, setErrorMessageOtp]);

  // Send mail to get otp
  const handleSendMail = useCallback(() => {
    authenticationService.forgotPassword(email).then(() => {
      setForgotPasswordVisible(false);
      setGetOtpVisible(true);
    });
  }, [email]);

  // Get new pass word
  const handleChangeNewPass = useCallback(event => {
    setNewPass(event.target.value);
    setCheckPass(false);
  }, []);

  const handleChangeConfirmPassword = useCallback(
    event => {
      const confirmPass: string = event.target.value;
      setConfirmPass(event.target.value);
      if (confirmPass === newPass) {
        setCheckPass(true);
      }
      else {
        setCheckPass(false);
      }
    },
    [newPass],
  );

  const handleChangePass = useCallback(() => {
    setLoading(true);
      authenticationService
        .recoveryPassword(confirmPass)
        .then(() => {
          setLoading(false);
          setLoginVisible(true);
          setChangePassVisible(false);
          setGetOtpVisible(false);
          notification.info({
            message: 'Thay đổi mập khẩu thành công',
            // description: error.response.statusText,
            placement: 'topRight',
          });
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        })
        .catch(() => {
          setLoading(false);
        });
  }, [confirmPass]);
  /* return handleChangePass, handleChangeNewPass, handleChangeConfirmPassword, handleChangeEmail, handleSendMail */

  const handleSetValue = useCallback(
    (field: string, value?: string | number | boolean | null) => {
      setAppUser({
        ...appUser,
        [field]: value,
        errors: undefined,
      });
      setErrorMessagePass(null);
      setErrorMessageUsername(null);
    },
    [appUser, setAppUser, setErrorMessagePass, setErrorMessageUsername],
  );

  const handleChangeField = useCallback(
    (field: string) => {
      return (ev: ChangeEvent<HTMLInputElement>) => {
        if (typeof ev === 'object' && ev !== null) {
          if ('target' in ev) {
            return handleSetValue(field, ev.target.value);
          }
        }
      };
    },
    [handleSetValue],
  );

  const handleEnter = useCallback(
    (ev: React.KeyboardEvent<HTMLInputElement>) => {
      if (ev.key === 'Enter') {
        handleLogin();
      }
    },
    [handleLogin],
  );

  return [
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
  ];
}
