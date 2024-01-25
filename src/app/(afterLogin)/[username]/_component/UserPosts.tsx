"use client";

import { Ipost } from "@/model/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getUserPosts from "../_lib/getUserPosts";
import Post from "@/app/(afterLogin)/_component/Post";

type Props = {
  username: string;
};
export default function UserPosts({ username }: Props) {
  const { data } = useQuery<
    Ipost[],
    Object,
    Ipost[],
    [_1: string, _2: string, _3: string]
  >({
    queryKey: ["posts", "users", username],
    queryFn: getUserPosts,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["users", username]);
  if (user) {
    return data?.map((post) => {
      return <Post key={post.postId} post={post} />;
    });
  }
  return null;
}
