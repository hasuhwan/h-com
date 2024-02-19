import styles from "./profile.module.css";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import UserPosts from "./_component/UserPosts";
import UserInfo from "./_component/UserInfo";
import getUserPosts from "./_lib/getUserPosts";
import getUserServer from "./_lib/getUserServer";
import { auth } from "@/auth";
import { Metadata } from "next";
import { Iuser } from "@/model/user";

type Props = {
  params: {
    username: string;
  };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user: Iuser = await getUserServer({
    queryKey: ["users", params.username],
  });
  return {
    title: `${user.nickname} (${user.id}) / H`,
    description: `${user.nickname} (${user.id}) 프로필`,
  };
}

export default async function Page({ params }: Props) {
  const { username } = params;
  const session = await auth();
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users", username],
    queryFn: getUserServer,
  });
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "users", username],
    queryFn: getUserPosts,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <main className={styles.main}>
      <HydrationBoundary state={dehydratedState}>
        <UserInfo username={username} session={session} />
        <div>
          <UserPosts username={username} />
        </div>
      </HydrationBoundary>
    </main>
  );
}
