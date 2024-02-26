"use client";
import styles from "../messages.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import "dayjs/locale/ko";
import { Iroom } from "@/model/room";
import { useSession } from "next-auth/react";
import Image from "next/image";
dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  room: Iroom;
};

export default function Room({ room }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const onClick = () => {
    router.push(`/messages/${room.room}`);
  };

  const user =
    room.Receiver.id === session?.user?.email ? room.Sender : room.Receiver;
  return (
    <div className={styles.room} onClickCapture={onClick}>
      <div className={styles.roomUserImage}>
        <Image src={user.image} alt="" width={40} height={40} />
      </div>
      <div className={styles.roomChatInfo}>
        <div className={styles.roomUserInfo}>
          <b>{user.nickname}</b>
          &nbsp;
          <span>@{user.id}</span>
          &nbsp; · &nbsp;
          <span className={styles.postDate}>
            {dayjs(room.createdAt).fromNow(true)}
          </span>
        </div>
        <div className={styles.roomLastChat}>{room.content}</div>
      </div>
    </div>
  );
}
