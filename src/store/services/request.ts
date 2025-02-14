// eslint-disable-next-line
import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import { get, snakeCase } from 'lodash';
import { LocalStorageService, LocalStorageKey } from './localStorage';
import { config } from '../../config';

export class HttpRequest {
  request: ApisauceInstance;
  localService: LocalStorageService;
  constructor(APIEndpoint: string | any) {
    this.localService = new LocalStorageService();
    this.request = apisauce.create({
      baseURL: APIEndpoint,
      headers: {
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '***',
        Accept: '*/*',
      },
      timeout: 25000,
    });
    const infoUser = this.localService.getItem(LocalStorageKey.info);
    const token = get(infoUser, 'toKen');
    if (token) {
      this.request.setHeaders({
        Authorization: token,
      });
    }
  }
}

export const httpRequest = () => {
  const localService = new LocalStorageService();
  const request: ApisauceInstance = apisauce.create({
    baseURL: config.CHAT_API_URL,
    headers: {
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '***',
      Accept: '*/*',
    },
    timeout: 25000,
  });
  const infoUser = localService.getItem(LocalStorageKey.info);
  const token = get(infoUser, 'toKen');
  if (token) {
    request.setHeaders({
      Authorization: token,
    });
  }
  return request;
};

export function configRequest(request: any): any {
  const typeRequest = typeof request;
  let formatRequest: any = {};
  if (typeRequest === 'string') return snakeCase(request);
  if (typeRequest === 'object') {
    for (let i in request) {
      formatRequest[snakeCase(i)] = request[i];
    }
    return formatRequest;
  }
}

export function configResponse(response: ApiResponse<any>): any {
  if (!response.data) {
    return { message: 'server not found', code: 401 };
  }
  const { data, code, message, status } = response.data;
  if (!response.ok) {
    if (code >= 400 && code <= 500) {
      throw Object.assign(new Error(message), { code });
    }
  }
  if (status === 'success') {
    return { data, message, code };
  }
}

export function configResponseError(errors: any): any {
  if (!errors) {
    return { message: 'request server not found', code: 404 };
  }
  const { code, message } = errors;
  if (!message && code) {
    return { code, message: 'request server not found' };
  }
  if (message && !code) {
    return { code: 404, message };
  }
  return { message, code };
}
