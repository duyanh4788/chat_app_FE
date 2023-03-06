import apisauce, { ApiResponse } from 'apisauce';
import { isEmpty, get, snakeCase } from 'lodash';
import { LocalStorageService, LocalStorageKey } from './localStorage';

export class HttpRequest {
  request: any;
  localService: any;
  constructor(APIEndpoint) {
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
  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      throw !isEmpty(response.data) ? response.data : '404 Not Found';
    }
    const message = get(response.data, 'message');
    if (isEmpty(response.data) || !message) {
      throw new Error(response.problem);
    }
  }
  const { data, code, message } = response.data;
  if (code === 400 || code === 500) {
    throw new Error(message);
  }
  if (code === 200) {
    return data;
  }
}
