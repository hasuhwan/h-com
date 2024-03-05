import CommentForm from "@/app/(afterLogin)/[username]/status/[id]/_component/CommentForm";

import styles from "./photoModal.module.css";
import PhotoModalCloseButton from "./_component/PhotoModalCloseButton";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import getSinglePost from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost";
import getComments from "@/app/(afterLogin)/[username]/status/[id]/_lib/getComments";
import SinglePosts from "@/app/(afterLogin)/[username]/status/[id]/_component/SinglePost";
import Comments from "@/app/(afterLogin)/[username]/status/[id]/_component/Comments";
import ImageZone from "./_component/ImageZone";
type Props = {
  params: {
    username: string;
    id: string;
    photoId: string;
  };
};
export default async function PhotoModal({ params }: Props) {
  const { id, photoId, username } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["posts", id],
    queryFn: getSinglePost,
  });
  await queryClient.prefetchQuery({
    queryKey: ["posts", id, "comments"],
    queryFn: getComments,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className={styles.container}>
      <HydrationBoundary state={dehydratedState}>
        <PhotoModalCloseButton />
        <ImageZone id={id} photoId={photoId} username={username} />
        <div className={styles.commentZone}>
          <SinglePosts noImage id={id} />
          <CommentForm id={id} />
          <Comments id={id} />
        </div>
      </HydrationBoundary>
    </div>
  );
}
