import BackButton from "@/app/(afterLogin)/_component/BackButton";
import styles from "./singlePost.module.css";
import CommentForm from "./_component/CommentForm";
import SinglePosts from "./_component/SinglePost";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import getComments from "./_lib/getComments";
import Comments from "./_component/Comments";
import { Metadata } from "next";
import { Iuser } from "@/model/user";
import getUserServer from "../../_lib/getUserServer";
import { Ipost } from "@/model/post";
import getSinglePostServer from "./_lib/getSinglePostServer";
type Props = {
  params: { id: string; username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user: Iuser = await getUserServer({
    queryKey: ["users", params.username],
  });
  const post: Ipost = await getSinglePostServer({
    queryKey: ["posts", params.id],
  });
  return {
    title: `H에서 ${user.nickname} (${user.id} 님 : ${post.content}`,
    description: post.content,
  };
}

export default async function SinglePostPage({ params }: Props) {
  const { id } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["posts", id],
    queryFn: getSinglePostServer,
  });
  await queryClient.prefetchQuery({
    queryKey: ["posts", id, "comments"],
    queryFn: getComments,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={styles.main}>
      <HydrationBoundary state={dehydratedState}>
        <div className={styles.header}>
          <BackButton />
          <h3 className={styles.headerTitle}>게시하기</h3>
        </div>
        <SinglePosts id={id} />
        <CommentForm id={id} />
        <div>
          <Comments id={id} />
        </div>
      </HydrationBoundary>
    </div>
  );
}
