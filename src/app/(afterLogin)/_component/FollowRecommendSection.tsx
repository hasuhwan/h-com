"use client";

import type { Iuser } from "@/model/user";
import { useQuery } from "@tanstack/react-query";
import getFollowRecommends from "../_lib/getFollowRecommends";
import FollowRecommend from "./FollowRecommend";

export default function FollowRecommendSection() {
  const { data } = useQuery<Iuser[]>({
    queryKey: ["users", "followRecommends"],
    queryFn: getFollowRecommends,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });

  return data?.map((user) => {
    return <FollowRecommend user={user} key={user.id} />;
  });
}
