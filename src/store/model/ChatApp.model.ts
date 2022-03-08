export interface MessagesModel {
  senderId: string;
  senderName: string;
  reciverId: string;
  reciverName: string;
  text: string;
}

export interface ConvertStation {
  senderId: string;
  reciverId: string;
}
