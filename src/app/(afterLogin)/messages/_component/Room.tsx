"use client";
import { faker } from "@faker-js/faker";
import styles from "../messages.module.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import "dayjs/locale/ko";
import { Iroom } from "@/model/room";
dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  room: Iroom;
};

export default function Room({ room }: Props) {
  const router = useRouter();

  const onClick = () => {
    router.push(`/messages/${room.room}`);
  };
  return (
    <div className={styles.room} onClickCapture={onClick}>
      <div className={styles.roomUserImage}>
        <img src={faker.image.avatar()} alt="" />
      </div>
      <div className={styles.roomChatInfo}>
        <div className={styles.roomUserInfo}>
          <b>{room.Reciver.nickname}</b>
          &nbsp;
          <span>@{room.Reciver.id}</span>
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
