import { ChatAppApi } from 'store/chatApp/constants/chatapp.constant';
import { ConvertStation, MessagesModel } from 'store/model/ChatApp.model';
import { HttpRequest } from 'store/services/request';
import { ApiRouter } from 'store/services/request.constants';

export class ChatAppHttp {
  request: any;
  constructor(endPoint = ApiRouter.CHAT_APP_API) {
    this.request = new HttpRequest(endPoint).request;
  }

  private configNewMessage = (message: MessagesModel) => {
    return {
      conversationId: message.conversationId,
      senderId: message.senderId,
      text: message.text,
    };
  };

  private configConverStation = (users: ConvertStation) => {
    return {
      senderId: users.senderId,
      reciverId: users.reciverId,
    };
  };

  public getListUsers = (): Promise<any> =>
    this.request.get(ChatAppApi.LIST_USER);

  public getListMessages = (sernderId: any): Promise<any> =>
    this.request.post(ChatAppApi.LIST_MESSAGE, sernderId);

  public postNewMessage = (data: MessagesModel): Promise<any> =>
    this.request.post(ChatAppApi.NEW_MESSAGE, {
      ...this.configNewMessage(data),
    });

  public saveConvertStation = (data: ConvertStation): Promise<any> =>
    this.request.post(ChatAppApi.SAVE_CONVERT_STATION, {
      ...this.configConverStation(data),
    });

  // ======================================================= //

  public convertStationMyFriend = (data: MessagesModel): Promise<any> =>
    this.request.post(ChatAppApi.CONVERT_STATION_MY_FRIEND, {
      ...this.configNewMessage(data),
    });

  public getUserById = (id: any): Promise<any> =>
    this.request.get(ChatAppApi.GET_USER_BY_ID + id);

  public getFriendById = (id: any): Promise<any> =>
    this.request.get(ChatAppApi.GET_FRIEND_BY_ID + id);

  public convertStationByUserId = (id: any): Promise<any> =>
    this.request.post(ChatAppApi.CONVERT_STATION_BY_USER_ID, id);

  public findTwoUserById = (id: any): Promise<any> =>
    this.request.get(
      ChatAppApi.FIRST_USER_ID + id + ChatAppApi.SECONDARY_USER_ID + id,
    );
}
