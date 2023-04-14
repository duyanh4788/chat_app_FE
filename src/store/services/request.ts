import apisauce, { ApiResponse, ApisauceInstance } from 'apisauce';
import { get, snakeCase } from 'lodash';
import { LocalStorageService, LocalStorageKey } from './localStorage';

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
    return { message: '404 Not Found', code: 401 };
  }
  const { data, code, message, status } = response.data;
  if (!response.ok) {
    if (code === 400 || code === 401 || code === 403 || code === 404 || code === 500) {
      return { message, code };
    }
  }
  if (status === 'success') {
    return { data, message, code };
  }
}
