import { ApisauceInstance } from 'apisauce';
import { HttpRequest } from 'store/services/request';
import { ApiRouter } from 'store/services/request.constants';
import { FriendsApi } from '../constants/friends.constant';

export class FriendsHttp {
  request: ApisauceInstance;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  public getListFriends = (): Promise<any> => {
    return this.request.get(FriendsApi.GET_LIST_FRIEND);
  };

  public addFriend = (payload: any): Promise<any> => {
    return this.request.post(FriendsApi.ADD_FRIEND, payload);
  };

  public acceptFriends = (payload: any): Promise<any> => {
    return this.request.post(FriendsApi.ACCEPT_FRIENDS, payload);
  };

  public declineFriends = (payload: any): Promise<any> => {
    return this.request.post(FriendsApi.DECLINE_FRIENDS, payload);
  };
}
