import apisauce, { ApiResponse } from 'apisauce';
import { get, snakeCase } from 'lodash';
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
    const token = this.localService.getItem(LocalStorageKey.token);
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
  if (
    response.status === 404 ||
    response.status === 401 ||
    response.status === 400
  ) {
    throw new Error(
      get(response.data, 'messages')
        ? get(response.data, 'messages')
        : '404 Not found',
    );
  }
  return response.data;
}
