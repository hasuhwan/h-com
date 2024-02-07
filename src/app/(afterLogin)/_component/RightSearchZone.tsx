"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./rightSearchZone.module.css";
import SearchForm from "./SearchForm";
import { useEffect, useState } from "react";

export default function RightSearchZone() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFollowChecked, setIsFollowChecked] = useState(false);
  const onChangeFollow = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("pf", "on");
    setIsFollowChecked(true);
    router.replace(`/search?${newSearchParams.toString()}`);
  };
  const onChangeAll = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("pf");
    setIsFollowChecked(false);
    router.replace(`/search?${newSearchParams.toString()}`);
  };
  useEffect(() => {
    if (searchParams.has("pf")) {
      setIsFollowChecked(true);
    }
  }, [searchParams]);
  if (pathname === "/explore") {
    return null;
  }
  if (pathname === "/search") {
    return (
      <div>
        <h5 className={styles.filterTitle}>검색 필터</h5>
        <div className={styles.filterSection}>
          <div>
            <label>사용자</label>
            <div className={styles.radio}>
              <div>모든 사용자</div>
              <input
                type="radio"
                name="pf"
                checked={!isFollowChecked}
                onChange={onChangeAll}
              />
            </div>
            <div className={styles.radio}>
              <div>내가 팔로우하는 사람들</div>
              <input
                type="radio"
                name="pf"
                onChange={onChangeFollow}
                checked={isFollowChecked}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 60, width: "inherit" }}>
      <SearchForm />
    </div>
  );
}
