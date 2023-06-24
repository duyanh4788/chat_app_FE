import { ChatAppApi } from 'store/chatApp/constants/chatapp.constant';
import { PostConvertStation, Messages } from 'store/model/ChatApp.model';
import { httpRequest } from 'store/services/request';

export class ChatAppHttp {
  private configNewMessage = (message: Messages) => {
    return {
      conversationId: message.conversationId,
      senderId: message.senderId,
      reciverId: message.reciverId,
      text: message.text,
    };
  };

  private configConverStation = (users: PostConvertStation) => {
    return {
      senderId: users.senderId,
      reciverId: users.reciverId,
    };
  };

  public getListUsers = (): Promise<any> => httpRequest().get(ChatAppApi.LIST_USER);

  public saveConvertStation = (data: PostConvertStation): Promise<any> =>
    httpRequest().post(ChatAppApi.SAVE_CONVERT_STATION, {
      ...this.configConverStation(data),
    });

  public getListMessages = (sernderId: any): Promise<any> => {
    return httpRequest().post(ChatAppApi.GET_LIST_MESSAGE, sernderId);
  };

  public postNewMessage = (data: Messages): Promise<any> =>
    httpRequest().post(ChatAppApi.NEW_MESSAGE, {
      ...this.configNewMessage(data),
    });

  public changeStatusoffline = (id: string): Promise<any> =>
    httpRequest().post(ChatAppApi.CHANGE_STATUS_OFFLINE, id);

  public postUploadAWS3 = (data: FormData): Promise<any> =>
    httpRequest().post(ChatAppApi.UPLOAD_AWS_S3, data);

  public removeUploadAWS3 = (idImage: any): Promise<any> =>
    httpRequest().post(ChatAppApi.REMOVE_IMG_AWS3, idImage);
}
