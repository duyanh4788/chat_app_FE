import { AuthApi } from 'store/auth/constants/auth.constant';
import { SignInModel, SignUpModel } from 'store/model/Auth.model';
import { HttpRequest } from 'store/services/request';
import { ApiRouter } from 'store/services/request.constants';

export class AuthHttp {
  request: any;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  private configSingIn = (user: SignInModel) => {
    return {
      account: user.account,
      passWord: user.passWord,
    };
  };

  private configSignUp = (user: SignUpModel) => {
    return {
      account: user.account,
      passWord: user.passWord,
      fullName: user.fullName,
      email: user.email,
    };
  };

  public signInUser = (data: SignInModel): Promise<any> => {
    return this.request.post(AuthApi.SIGN_IN, {
      ...this.configSingIn(data),
    });
  };

  public signUpUser = (data: SignUpModel): Promise<any> => {
    return this.request.post(AuthApi.SIGN_UP, {
      ...this.configSignUp(data),
    });
  };

  public getUserById = (id: string): Promise<any> => {
    return this.request.get(AuthApi.GET_USER_BY_ID + id);
  };

  public changeStatusOnline = (id: string): Promise<any> =>
    this.request.post(AuthApi.CHANGE_STATUS_IS_ONLINE, id);
}
