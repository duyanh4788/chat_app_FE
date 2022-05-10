export interface MessagesModel {
  conversationId: string;
  senderId: string;
  reciverId: string;
  text: string;
}

export interface ConvertStation {
  senderId: string;
  reciverId: string;
}

export interface StatusUser {
  id: string;
}
