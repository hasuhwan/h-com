import { Ipost } from "@/model/post";
import { QueryFunction } from "@tanstack/react-query";

const getUserPosts: QueryFunction<
  Ipost[],
  [_1: string, _2: string, string]
> = async ({ queryKey }) => {
  const [_1, _2, username] = queryKey;
  const res = await fetch(
    `http://localhost:9090/api/users/${username}/posts/`,
    {
      next: {
        tags: ["posts", "users", username],
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};
export default getUserPosts;
