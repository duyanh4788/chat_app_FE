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
      reciverId: message.reciverId,
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

  public saveConvertStation = (data: ConvertStation): Promise<any> =>
    this.request.post(ChatAppApi.SAVE_CONVERT_STATION, {
      ...this.configConverStation(data),
    });

  public getListMessages = (sernderId: any): Promise<any> => {
    return this.request.post(ChatAppApi.GET_LIST_MESSAGE, sernderId);
  }


  public postNewMessage = (data: MessagesModel): Promise<any> =>
    this.request.post(ChatAppApi.NEW_MESSAGE, {
      ...this.configNewMessage(data),
    });

  public changeStatusoffline = (id: string): Promise<any> =>
    this.request.post(ChatAppApi.CHANGE_STATUS_OFFLINE, id);

  public postUploadAWS3 = (data: FormData): Promise<any> =>
    this.request.post(ChatAppApi.UPLOAD_AWS_S3, data);
}
