"use client";

import { useQuery } from "@tanstack/react-query";
import getPostRecommends from "../_lib/getPostRecommends";
import Post from "../../_component/Post";
import { Ipost } from "@/model/post";

export default function PostRecommends() {
  const { data } = useQuery<Ipost[]>({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    staleTime: 60 * 1000, //fresh stale time
  });
  return data?.map((post) => {
    return <Post key={post.postId} post={post} />;
  });
}
