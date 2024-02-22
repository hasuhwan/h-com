"use client";
import { useRouter } from "next/navigation";
import styles from "./post.module.css";
import { MouseEventHandler } from "react";
import { Ipost } from "@/model/post";

type Props = {
  children: React.ReactNode;
  post: Ipost;
};
export default function PostArticle({ children, post }: Props) {
  const router = useRouter();
  let target = post;
  if (post.Original) {
    target = post.Original;
  }
  const onClick: MouseEventHandler = () => {
    router.push(`/${target.User.id}/status/${target.postId}`);
  };

  return (
    <article onClick={onClick} className={styles.post}>
      {children}
    </article>
  );
}
