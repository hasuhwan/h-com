"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "../photoModal.module.css";
import { Ipost } from "@/model/post";
import getSinglePost from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost";
import ActionButtons from "@/app/(afterLogin)/_component/ActionButtons";
import Image from "next/image";
type Props = {
  id: string;
};
export default function ImageZone({ id }: Props) {
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
  if (!post?.Images[0]) {
    return null;
  }
  return (
    <div className={styles.imageZone}>
      <Image src={post?.Images[0].link} alt={post?.content} fill={true} />
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${post.Images[0].link})` }}
      />
      <div className={styles.buttonZone}>
        <div className={styles.buttonInner}>
          <ActionButtons white post={post} />
        </div>
      </div>
    </div>
  );
}
