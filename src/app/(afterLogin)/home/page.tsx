import styles from "./home.module.css";
import Tab from "./_component/Tab";
import TabProvider from "./_component/TabProvider";
import PostForm from "./_component/PostForm";

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import getPostRecommends from "./_lib/getPostRecommends";
import TabDecider from "./_component/TabDecider";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <main className={styles.main}>
      <HydrationBoundary state={dehydratedState}>
        <TabProvider>
          <Tab />
          <PostForm />
          <TabDecider />
        </TabProvider>
      </HydrationBoundary>
    </main>
  );
}
