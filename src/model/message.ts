interface Imessage {
  messageId: number;
  senderId: string;
  receiverId: string;
  room: string;
  content: string;
  createdAt: Date;
}

export type { Imessage };
