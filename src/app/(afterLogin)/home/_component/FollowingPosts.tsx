"use client";

import {
  InfiniteData,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import Post from "../../_component/Post";
import { Ipost } from "@/model/post";
import getFollowingPosts from "../_lib/getFollwingPosts";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";

export default function FollowingPosts() {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      Ipost[],
      Object,
      InfiniteData<Ipost[]>,
      [_1: string, _2: string],
      number
    >({
      queryKey: ["posts", "followings"],
      queryFn: getFollowingPosts,
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
