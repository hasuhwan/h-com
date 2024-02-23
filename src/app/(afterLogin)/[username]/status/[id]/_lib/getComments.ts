import { Ipost } from "@/model/post";
import { QueryFunction } from "@tanstack/react-query";

const getComments: QueryFunction<
  Ipost[],
  [_1: string, _2: string, _3: string]
> = async ({ queryKey }) => {
  const [_1, id] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments`,
    {
      next: {
        tags: ["posts", id, "comments"],
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};
export default getComments;
