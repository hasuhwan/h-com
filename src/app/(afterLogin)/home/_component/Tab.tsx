"use client";

import styles from "./tab.module.css";
import { useState, useCallback } from "react";
export default function Tab() {
  const [tab, setTab] = useState("rec");
  const onClickTab = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const name = target.dataset.name;
    if (name) {
      setTab(name);
    }
  }, []);
  return (
    <div className={styles.homeFixed}>
      <div className={styles.homeText}>홈</div>
      <div
        className={styles.homeTab}
        onClick={(e) => {
          onClickTab(e);
        }}
      >
        <div data-name="rec">
          추천
          <div className={styles.tabIndicator} hidden={tab === "fol"}></div>
        </div>
        <div data-name="fol">
          팔로우 중
          <div className={styles.tabIndicator} hidden={tab === "rec"}></div>
        </div>
      </div>
    </div>
  );
}
