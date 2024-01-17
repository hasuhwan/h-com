"use client";

import { useState, useCallback } from "react";
import styles from "../search.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Tab() {
  const [tab, setTab] = useState("hot");
  const router = useRouter();
  const searchParams = useSearchParams();
  const onClickTab = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const name = target.dataset.name;
      if (name) {
        setTab(name);
        if (name === "hot") {
          router.replace(`/search?q=${searchParams.get("q")}`);
        } else if (name === "new") {
          router.replace(`/search?${searchParams.toString()}&f=live`);
        }
      }
    },
    [router, searchParams]
  );
  return (
    <div className={styles.homeFixed}>
      <div
        className={styles.homeTab}
        onClick={(e) => {
          onClickTab(e);
        }}
      >
        <div data-name="hot">
          인기
          <div className={styles.tabIndicator} hidden={tab === "new"}></div>
        </div>

        <div data-name="new">
          최신
          <div className={styles.tabIndicator} hidden={tab === "hot"}></div>
        </div>
      </div>
    </div>
  );
}
