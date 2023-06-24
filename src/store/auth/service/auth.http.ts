import { AuthApi } from 'store/auth/constants/auth.constant';
import { Users } from 'store/model/Users.model';
import { httpRequest } from 'store/services/request';

export class AuthHttp {
  private configSingIn = (user: Users) => {
    return {
      account: user.account,
      passWord: user.passWord,
    };
  };

  private configSignUp = (user: Users) => {
    return {
      account: user.account,
      passWord: user.passWord,
      fullName: user.fullName,
      email: user.email,
    };
  };

  private configUpdateInfor = (user: Users) => {
    return {
      fullName: user.fullName,
      avatar: user.avatar,
      _id: user._id,
      type2FA: user.type2FA,
      twofa: user.twoFA,
    };
  };

  private configResetPassWord = (body: any) => {
    return {
      email: body.email,
      newPassWord: body.newPassWord,
      authCode: body.authCode,
    };
  };

  public signInUser = (data: Users): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_IN, {
      ...this.configSingIn(data),
    });
  };

  public sigInUserWithCode = (authCode: string): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_IN_WITH_CODE, authCode);
  };

  public sigInUserWithApp = (otp: number): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_IN_WITH_APP, otp);
  };

  public signUpUser = (data: Users): Promise<any> => {
    return httpRequest().post(AuthApi.SIGN_UP, {
      ...this.configSignUp(data),
    });
  };

  public signUpWithFB = (data: any): Promise<any> => {
    return httpRequest().post(AuthApi.LOGIN_FB, {});
  };

  public signUpWithGG = (data: any): Promise<any> => {
    return httpRequest().post(AuthApi.LOGIN_GG, {});
  };

  public getUserById = ({ id }): Promise<any> => {
    return httpRequest().get(AuthApi.GET_USER_BY_ID + id);
  };

  public changeStatusOnline = (id: string): Promise<any> => {
    return httpRequest().post(AuthApi.CHANGE_STATUS_IS_ONLINE, id);
  };

  public updateInfo = (body: any): Promise<any> => {
    const config = this.configUpdateInfor(body);
    return httpRequest().put(AuthApi.UPDATE_INFOR, config);
  };

  public activeAuthCode = (code: string): Promise<any> => {
    return httpRequest().get(`${AuthApi.ACTIVE_AUTH_CODE}/${code}`);
  };

  public forgotPassword = (email: any): Promise<any> => {
    return httpRequest().post(AuthApi.FORGOT_PW, email);
  };

  public resendOrderForgotPassword = (email: any): Promise<any> => {
    return httpRequest().post(AuthApi.RESEND_ORDER_RESET_PASSWORD, email);
  };

  public resetPassword = (body: any): Promise<any> => {
    return httpRequest().post(AuthApi.RESET_PASSWORD, this.configResetPassWord(body));
  };

  public getAuthPair = (): Promise<any> => {
    return httpRequest().get(AuthApi.GET_AUTH_PAIR);
  };

  public pairAuth = (payload): Promise<any> => {
    const { token } = payload;
    return httpRequest().post(AuthApi.PAIR_AUTH, token);
  };
}
