interface IuserID {
  id: string;
}

interface Iuser {
  id: string;
  nickname: string;
  image: string;
  Followers: IuserID[];
  _count: {
    Followers: number;
    Followings: number;
  };
}
export type { Iuser };
