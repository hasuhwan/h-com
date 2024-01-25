"use client";
import Image from "next/image";
import styles from "./followRecommend.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Iuser } from "@/model/user";
type Prop = {
  user: Iuser;
};
export default function FollowRecommend({ user }: Prop) {
  const router = useRouter();
  const { data: session } = useSession();

  const onFollow = () => {
    if (!session?.user) {
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.userLogoSection}>
        <div className={styles.userLogo}>
          <Image src={user.image} alt={user.id} width={40} height={40} />
        </div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.title}>{user.nickname}</div>
        <div className={styles.count}>@{user.id}</div>
      </div>
      <div className={styles.followButtonSection}>
        <button onClick={onFollow}>팔로우</button>
      </div>
    </div>
  );
}
