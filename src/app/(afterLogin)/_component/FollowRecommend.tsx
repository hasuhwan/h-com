"use client";
import Image from "next/image";
import styles from "./followRecommend.module.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export default function FollowRecommend() {
  const router = useRouter();
  const { data: session } = useSession();
  const onFollow = () => {
    if (!session?.user) {
      router.push("/login");
    }
  };
  const user = {
    id: "elonmusk",
    nickname: "Elon Musk",
    image: "/yRsRRjGO.jpg",
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
