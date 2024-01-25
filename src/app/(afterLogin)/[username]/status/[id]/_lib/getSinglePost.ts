import { Ipost } from "@/model/post";
import { QueryFunction } from "@tanstack/react-query";

const getSinglePost: QueryFunction<Ipost, [_1: string, _2: string]> = async ({
  queryKey,
}) => {
  const [_1, id] = queryKey;
  const res = await fetch(`http://localhost:9090/api/posts/${id}`, {
    next: {
      tags: ["posts", id],
    },
  });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};
export default getSinglePost;
