"use client";

import getUser from "@/app/(afterLogin)/[username]/_lib/getUser";
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import styles from "./../chatRoom.module.css";
import Image from "next/image";

type Props = { id: string };

export default function UserInfo({ id }: Props) {
  const { data: user } = useQuery({
    queryKey: ["users", id],
    queryFn: getUser,
  });
  if (!user) {
    return null;
  }

  return (
    <>
      <div className={styles.header}>
        <BackButton />
        <div>
          <h2>{user.nickname}</h2>
        </div>
      </div>
      <Link href={"/" + user.id} className={styles.userInfo}>
        <Image src={user.image} alt={user.id} width={40} height={40} />
        <div>
          <b>{user.nickname}</b>
        </div>
        <div>@{user.id}</div>
      </Link>
    </>
  );
}
