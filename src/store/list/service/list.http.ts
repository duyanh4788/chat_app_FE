import { ListApi } from 'store/list/constants/list.constant';
import { HttpRequest } from 'store/services/request';
import { ApiRouter } from 'store/services/request.constants';

export class ListHttp {
  request: any;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  getListUsers = (): Promise<any> => this.request.get(ListApi.LIST_USER);

  getListMessages = (): Promise<any> => this.request.get(ListApi.LIST_MESSAGE);
}
