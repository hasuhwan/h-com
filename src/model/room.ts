import { Iuser } from "./user";

interface Iroom {
  room: string;
  Reciver: Iuser;
  content: string;
  createdAt: Date;
}

export type { Iroom };
