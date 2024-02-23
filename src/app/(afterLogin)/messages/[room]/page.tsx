import { faker } from "@faker-js/faker";
import styles from "./chatRoom.module.css";
import Link from "next/link";
import BackButton from "../../_component/BackButton";
import cx from "classnames";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import UserInfo from "./_component/UserInfo";
import { auth } from "@/auth";
import { QueryClient } from "@tanstack/react-query";
import getUserServer from "../../[username]/_lib/getUserServer";
import MessageForm from "./_component/MessageForm";
dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  params: { room: string };
};

export default async function ChatRoom({ params }: Props) {
  const session = await auth();
  const queryClient = new QueryClient();
  const receiver = params.room
    .split("-")
    .filter((v) => v !== session?.user?.email)[0];
  if (!receiver) {
    return null;
  }
  await queryClient.prefetchQuery({
    queryKey: ["users", receiver],
    queryFn: getUserServer,
  });

  return (
    <main className={styles.main}>
      <UserInfo id={receiver} />

      <MessageForm id={receiver} />
    </main>
  );
}
