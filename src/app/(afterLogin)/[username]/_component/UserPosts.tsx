"use client";

import { Ipost } from "@/model/post";
import {
  InfiniteData,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import getUserPosts from "../_lib/getUserPosts";
import Post from "@/app/(afterLogin)/_component/Post";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type Props = {
  username: string;
};
export default function UserPosts({ username }: Props) {
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery<
    Ipost[],
    Object,
    InfiniteData<Ipost[]>,
    [_1: string, _2: string, _3: string],
    number
  >({
    queryKey: ["posts", "users", username],
    queryFn: getUserPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  const { ref, inView } = useInView({ threshold: 0, delay: 0.2 });
  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetching]);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["users", username]);
  if (user) {
    return (
      <>
        {data?.pages.map((page, idx) => {
          return (
            <Fragment key={idx}>
              {page.map((post) => {
                return <Post key={post.postId} post={post} />;
              })}
            </Fragment>
          );
        })}
        <div ref={ref} style={{ height: 50 }} />
      </>
    );
  }
  return null;
}
