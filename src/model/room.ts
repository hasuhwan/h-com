import { Iuser } from "./user";

interface Iroom {
  room: string;
  Receiver: Iuser;
  Sender: Iuser;
  content: string;
  createdAt: Date;
}

export type { Iroom };
