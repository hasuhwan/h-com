"use client";

import Image from "next/image";
import styles from "./logoutButton.module.css";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "@auth/core/types";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  me: Session | null;
};
export default function LogoutButton({ me }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const onLogout = () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    signOut({ redirect: false }).then(() => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
        method: "post",
        credentials: "include",
      });
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
