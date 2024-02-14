"use client";

import Image from "next/image";
import styles from "./logoutButton.module.css";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "@auth/core/types";

type Props = {
  me: Session | null;
};
export default function LogoutButton({ me }: Props) {
  const router = useRouter();

  const onLogout = () => {
    signOut({ redirect: false }).then(() => {
      router.replace("/");
    });
  };
  if (!me?.user) {
    return null;
  }
  return (
    <button className={styles.logoutButton} onClick={onLogout}>
      <div className={styles.logoutUserImage}>
        <Image
          src={me.user.image as string}
          alt={me.user.email as string}
          width={40}
          height={40}
        />
      </div>
      <div className={styles.logoutUserName}>
        <div>{me.user.name}</div>
        <div>@{me.user.email}</div>
      </div>
    </button>
  );
}
