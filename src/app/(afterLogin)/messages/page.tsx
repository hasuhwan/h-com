import styles from "./messages.module.css";

import { Metadata } from "next";
import getRooms from "./_lib/getRooms";
import { auth } from "@/auth";
import Room from "./_component/Room";

export const metadata: Metadata = {
  title: "쪽지 / H",
  description: "쪽지를 보내보세요.",
};

export default async function Page() {
  const session = await auth();
  const rooms = session?.user?.email
    ? await getRooms(session?.user?.email)
    : [];
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h3>쪽지</h3>
      </div>
      {rooms.map((room) => {
        return <Room key={room.room} room={room} />;
      })}
    </main>
  );
}
