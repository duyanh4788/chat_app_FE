import { AuthApi } from 'store/auth/constants/auth.constant';
import { HttpRequest } from 'store/services/request';
import { ApiRouter } from 'store/services/request.constants';

export class AuthHttp {
  request: any;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  public signInUser = (data: any): Promise<any> => {
    return this.request.post(AuthApi.SIGN_IN, data);
  };

  public signUpUser = (data: any): Promise<any> => {
    return this.request.post(AuthApi.SIGN_UP, data);
  };
}
