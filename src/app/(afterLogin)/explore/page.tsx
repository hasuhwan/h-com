import { Metadata } from "next";
import SearchForm from "../_component/SearchForm";
import TrendSection from "./_component/TrendSection";
import styles from "./explore.module.css";

export const metadata: Metadata = {
  title: "탐색하기 / H",
  description: "탐색해 보세요.",
};

export default function Page() {
  return (
    <main className={styles.main}>
      <div className={styles.formZone}>
        <SearchForm />
      </div>
      <div className={styles.trend}>
        <h3>나를 위한 트렌드</h3>
        <TrendSection />
      </div>
    </main>
  );
}
