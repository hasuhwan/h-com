"use client";

import { Ipost } from "@/model/post";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getSinglePost from "../_lib/getSinglePost";
import Post from "@/app/(afterLogin)/_component/Post";
import styles from "../singlePost.module.css";

type Props = {
  id: string;
  noImage?: boolean;
};
export default function SinglePosts({ id, noImage }: Props) {
  const { data: post, error } = useQuery<
    Ipost,
    Object,
    Ipost,
    [_1: string, _2: string]
  >({
    queryKey: ["posts", id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  if (error) {
    return <div className={styles.userError}>게시글을 찾을 수 없습니다.</div>;
  }
  if (!post) {
    return null;
  }
  return <Post key={post.postId} post={post} noImage={noImage} />;
}
