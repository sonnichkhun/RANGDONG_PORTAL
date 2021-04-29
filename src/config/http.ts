import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import {
  MATTERMOST_WEBHOOK_URL,
} from 'config/consts';
import {createMattermostErrorMessage} from 'config/mattermost';
import { transformAPIContent } from 'core/helpers/data';
import { Repository } from 'core/repositories/Repository';
import {
  transformAPIRequestValue,
  transformAPIResponseValue,
} from 'helpers/api';
import { BASE_URL } from 'core/config';
import { notification } from 'helpers';
import authenticationService from 'services/AuthenticationService';
import { FORBIDENT_ROUTE } from './route-consts';

Repository.defaultRequestInterceptor = requestInterceptor;

Repository.defaultResponseInterceptor = responseInterceptor;

Repository.defaultErrorInterceptor = errorInterceptor;

export function requestInterceptor(
  config: AxiosRequestConfig,
): AxiosRequestConfig {
  if (typeof config.params === 'object' && config.params !== null) {
    config.params = transformAPIContent(
      config.params,

      undefined,
      transformAPIRequestValue,
    );
  }
  if (typeof config.data === 'object' && config.data !== null) {
    if (config.headers['Content-Type'] === 'application/json') {
      config.data = transformAPIContent(
        config.data,
        undefined,
        transformAPIRequestValue,
      );
    }
  }
  return config;
}

export function responseInterceptor<T>(response: AxiosResponse<T>) {
  if (typeof response.data === 'object' && response.data !== null) {
    if (response.headers['content-type']?.startsWith('application/json')) {
      response.data = transformAPIContent(
        response.data as any,
        undefined,
        transformAPIResponseValue,
      );
    }
  }
  return response;
}

export async function errorInterceptor(error: AxiosError) {
  axios
  .post(MATTERMOST_WEBHOOK_URL, {
    text: createMattermostErrorMessage(error),
  });
  // log error if dev environment
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        // tslint:disable-next-line:no-console
        console.error(`error 400, message: `, error.response);
        notification.error({
          message: 'lỗi nhập dữ liệu',
          description: error.response.statusText,
        });
        break;
      case 401:
        // tslint:disable-next-line:no-console
        console.error(`error 401, message: `, error.response.statusText);
        handleUnAuthorized(error);
        break;
      case 403:
        // tslint:disable-next-line:no-console
        console.error(`error 403, message: `, error.response.statusText);
        handleForbidden();
        break;
      case 420:
        // tslint:disable-next-line:no-console
        console.error(`error 420, message: `, error.response.statusText);
        notification.error({
          message: 'lỗi BE',
          description: error.response.statusText,
        });
        break;
      case 500:
        // tslint:disable-next-line:no-console
        console.error(`error 500, message `, error.response.statusText);
        notification.error({
          message: 'Lỗi hệ thống',
          description: error.response.statusText,
        });
        break;
      case 502:
        // tslint:disable-next-line:no-console
        console.error(`error 502, message `, error.response.statusText);
        notification.error({
          message: 'Server BE không hoạt động',
          description: error.response.statusText,
        });
        break;
      default:
        // tslint:disable-next-line:no-console
        console.error(
          `undefined error, message `,
          error.response.data?.Message,
        );
        break;
    }
  }
  // tslint:disable-next-line:no-console
  throw error;
}

async function handleUnAuthorized(error: AxiosError<any>) {
  notification.error({
    message: 'Bạn chưa đăng nhập hoặc không có quyền vào trang này',
    description: error.response.statusText,
  });
  await authenticationService.logout();
}

function handleForbidden() {
  window.location.href = FORBIDENT_ROUTE;
}

export const httpConfig: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};
