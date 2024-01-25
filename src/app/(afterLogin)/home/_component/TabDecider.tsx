"use client";

import { useContext } from "react";
import { Tabcontext } from "./TabProvider";
import PostRecommends from "./PostRecommends";
import FollowingPosts from "./FollowingPosts";

export default function TabDecider() {
  const { tab } = useContext(Tabcontext);

  if (tab === "rec") {
    return <PostRecommends />;
  }
  return <FollowingPosts />;
}
