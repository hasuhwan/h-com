"use client";

import Image from "next/image";
import styles from "./logoutButton.module.css";

export default function LogoutButton() {
  const me = {
    id: "hasuhwan",
    nickname: "하수환",
    image: "/hasuhwan.jpeg",
  };
  const onLogout = () => {};
  return (
    <button className={styles.logoutButton} onClick={onLogout}>
      <div className={styles.logoutUserImage}>
        <Image src={me.image} alt={me.id} width={40} height={40} />
      </div>
      <div className={styles.logoutUserName}>
        <div>{me.nickname}</div>
        <div>@{me.id}</div>
      </div>
    </button>
  );
}
