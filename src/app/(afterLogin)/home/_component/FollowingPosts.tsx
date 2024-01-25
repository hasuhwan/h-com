"use client";

import { useQuery } from "@tanstack/react-query";
import Post from "../../_component/Post";
import { Ipost } from "@/model/post";
import getFollowingPosts from "../_lib/getFollwingPosts";

export default function FollowingPosts() {
  const { data } = useQuery<Ipost[]>({
    queryKey: ["posts", "followings"],
    queryFn: getFollowingPosts,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  return data?.map((post) => {
    return <Post key={post.postId} post={post} />;
  });
}
