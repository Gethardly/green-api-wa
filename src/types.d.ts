export interface OutGoingMessage {
  type: string;
  chatId: string;
  textMessage: string;
  timestamp: number;
  idMessage: string;
  typeMessage: string;
}

export interface IncomingMessage extends OutGoingMessage {
  senderId: string;
  senderName: string;
  statusMessage: string;
}