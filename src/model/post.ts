import type { Iuser } from "./user";

interface IpostImage {
  link: string;
  imageId: number;
  Post?: Ipost;
}
interface IuserID {
  userId: string;
}
interface Ipost {
  postId: number;
  User: Iuser;
  content: string;
  createdAt: Date;
  Images: IpostImage[];
  Hearts: IuserID[];
  Reposts: IuserID[];
  Comments: IuserID[];
  _count: {
    Hearts: number;
    Reposts: number;
    Comments: number;
  };
  Parent?: Ipost;
  Original?: Ipost;
}
export type { Ipost, IpostImage };
