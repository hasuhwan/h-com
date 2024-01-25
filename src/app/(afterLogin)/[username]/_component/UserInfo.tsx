"use client";

import styles from "../profile.module.css";
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import { Iuser } from "@/model/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import getUser from "../_lib/getUser";
type Props = {
  username: string;
};
export default function UserInfo({ username }: Props) {
  const { data: user, error } = useQuery<
    Iuser,
    Object,
    Iuser,
    [_1: string, _2: string]
  >({
    queryKey: ["users", username],
    queryFn: getUser,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  if (error) {
    return (
      <>
        <div className={styles.header}>
          <BackButton />
          <h3 className={styles.headerTitle}>프로필</h3>
        </div>
        <div className={styles.userZone}>
          <div className={styles.userImage}></div>
          <div className={styles.userName}>
            <div>@{username}</div>
          </div>
        </div>
        <div className={styles.userError}>계정이 존재하지 않음</div>
      </>
    );
  }
  if (!user) {
    return null;
  }
  return (
    <>
      {" "}
      <div className={styles.header}>
        <BackButton />
        <h3 className={styles.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={styles.userZone}>
        <div className={styles.userImage}>
          <Image src={user.image} alt={user.id} width={134} height={134} />
        </div>
        <div className={styles.userName}>
          <div>{user.nickname}</div>
          <div>@{user.id}</div>
        </div>
        <button className={styles.followButton}>팔로우</button>
      </div>
    </>
  );
}
