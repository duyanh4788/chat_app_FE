import { ChatAppApi } from 'store/signIn/constants/chatApp.const';
import { HttpRequest } from 'store/services/request';
import { ApiRouter } from 'store/services/request.constants';

export class ChatAppHttp {
  request: any;
  constructor(endPoint = ApiRouter.LOCAL) {
    this.request = new HttpRequest(endPoint).request;
  }

  public postSigIn = (data: any): Promise<any> => {
    return this.request.post(ChatAppApi.SIGN_IN);
  };

  public postSigUp = (data: any): Promise<any> => {
    return this.request.post(ChatAppApi.SIGN_UP);
  };
}
