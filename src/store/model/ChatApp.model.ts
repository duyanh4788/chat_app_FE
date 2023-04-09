export interface Messages {
  conversationId: string;
  senderId: string;
  reciverId: string;
  text: string;
  _id?: string;
  createdAt: Date;
}

export interface ListMessages {
  listMessages: Messages[];
  skip?: number;
  totalPage?: number;
}

export interface ConvertStations {
  _id: string;
  avataReciver: string;
  members: string[];
}

export interface PostConvertStation {
  senderId: string;
  reciverId: string;
}
