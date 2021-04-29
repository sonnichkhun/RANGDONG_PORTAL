import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { errorInterceptor, responseInterceptor } from 'config/http';
import { LOGIN_ROUTE } from 'config/route-consts';
import { GlobalState } from 'core/config';
import * as Cookie from 'js-cookie';
import { AppUser } from 'models/AppUser';
import { Logo } from 'models/Logo';
import { setGlobal } from 'reactn';
class AuthenticationService {
  protected http: AxiosInstance;

  constructor() {
    this.http = createHttpService();
  }

  public checkAuth() {
    return this.http
      .post('rpc/portal/profile-web/get')
      .then((response: AxiosResponse<AppUser>) => response.data);
  }
  public login(appUser: AppUser) {
    return this.http
      .post('rpc/portal/account/login', appUser)
      .then((response: AxiosResponse<AppUser>) => response.data);
  }

  public async logout() {
    Cookie.remove('Token');
    await setGlobal<GlobalState>({
      user: null,
    });
    window.location.href = LOGIN_ROUTE;
  }

  public forgotPassword = (email: string): Promise<AppUser> => {
    return this.http
      .post('rpc/portal/profile/forgot-password', { email })
      .then((response: AxiosResponse<AppUser>) => response.data);
  };

  public verifyOtpCode = (appUser): Promise<AppUser> => {
    return this.http
      .post('rpc/portal/profile/verify-otp-code', appUser)
      .then((response: AxiosResponse<AppUser>) => response.data);
  };

  public recoveryPassword = (password: string): Promise<AppUser> => {
    return this.http
      .post('rpc/portal/profile/recovery-password', { password })
      .then((response: AxiosResponse<AppUser>) => response.data);
  };

  public get = (): Promise<Logo> => {
    return this.http
      .post('rpc/portal/login-page/get')
      .then((response: AxiosResponse<Logo>) => response.data);
  };
}

const createHttpService = () => {
  const instance: AxiosInstance = axios.create(httpConfig);
  instance.interceptors.response.use(responseInterceptor, errorInterceptor); // register fullfill and reject handler for http promise
  return instance;
};

const httpConfig: AxiosRequestConfig = {
  baseURL: window.location.origin,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export default new AuthenticationService();
