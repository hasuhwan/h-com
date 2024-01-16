import styles from "./home.module.css";
import Tab from "./_component/Tab";
import TabProvider from "./_component/TabProvider";
export default function Page() {
  return (
    <main className={styles.main}>
      <TabProvider>
        <Tab />
        {/* <PostForm/>
    <Post/> */}
      </TabProvider>
    </main>
  );
}
