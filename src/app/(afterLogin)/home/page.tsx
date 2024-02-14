import styles from "./home.module.css";
import Tab from "./_component/Tab";
import TabProvider from "./_component/TabProvider";
import PostForm from "./_component/PostForm";
import TabDeciderSuspense from "./_component/TabDeciderSuspense";
import { Suspense } from "react";
import Loading from "./loading";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return (
    <main className={styles.main}>
      <TabProvider>
        <Tab />
        <PostForm me={session} />
        <Suspense fallback={<Loading />}>
          <TabDeciderSuspense />
        </Suspense>
      </TabProvider>
    </main>
  );
}
