import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
class PermissionService {
  protected http: AxiosInstance;

  constructor() {
    this.http = createHttpService();
  }
  public listPath(){
    return this.http.post('rpc/portal/permission/list-path', {}).then((response: AxiosResponse<string[]>) => response.data);
  }

  // public listPathMDM(){
  //   return this.http.post('rpc/mdm/permission/list-path', {}).then((response: AxiosResponse<string[]>) => response.data);
  // }
}

const createHttpService = () => {
  const instance: AxiosInstance = axios.create(httpConfig);
  return instance;
};

const httpConfig: AxiosRequestConfig = {
  baseURL: window.location.origin,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

export default new PermissionService();
