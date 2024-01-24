import type { Iuser } from "./user";

interface IpostImage {
  link: string;
  imageId: number;
  Post?: Ipost;
}

interface Ipost {
  postId: number;
  User: Iuser;
  content: string;
  createdAt: Date;
  Images: IpostImage[];
}
export type { Ipost, IpostImage };
