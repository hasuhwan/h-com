"use client";

import type { IhashTag } from "@/model/hashTag";
import { useQuery } from "@tanstack/react-query";
import Trend from "../../_component/Trend";
import getTrends from "../../_lib/getTrends";

export default function TrendSection() {
  const { data } = useQuery<IhashTag[]>({
    queryKey: ["trends"],
    queryFn: getTrends,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  return data?.map((trend) => {
    return <Trend trend={trend} key={trend.tagId} />;
  });
}
