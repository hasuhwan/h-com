"use client";

import cx from "classnames";
import styles from "@/app/(afterLogin)/messages/[room]/chatRoom.module.css";
import dayjs from "dayjs";
import {
  DefaultError,
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import getMessages from "../_lib/getMessages";
import { Imessage } from "@/model/message";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import useMessageStore from "@/store/messageModal";
import useSocket from "../_lib/useSocket";

type Props = { id: string };

export default function MessageList({ id }: Props) {
  const { data: session } = useSession();
  const listRef = useRef<HTMLDivElement>(null);
  const [pageRendered, setPageRendered] = useState(false);
  const [adjustingScroll, setAdjustingScroll] = useState(false);
  const { shouldGoDown, setGoDown } = useMessageStore();
  const {
    data: messages,
    hasPreviousPage,
    fetchPreviousPage,
    isFetching,
  } = useInfiniteQuery<
    Imessage[],
    DefaultError,
    InfiniteData<Imessage[]>,
    [
      string,
      {
        senderId: string;
        receiverId: string;
      },
      string
    ],
    number
  >({
    queryKey: [
      "rooms",
      { senderId: session?.user?.email!, receiverId: id },
      "messages",
    ],
    queryFn: getMessages,
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.at(0)?.messageId,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.messageId,
    enabled: !!(session?.user?.email && id),
  });

  const { ref, inView } = useInView({ threshold: 0, delay: 0 });

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasPreviousPage && !adjustingScroll) {
        const prevHeight = listRef.current?.scrollHeight || 0;
        fetchPreviousPage().then(() => {
          setAdjustingScroll(true);
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop =
                listRef.current.scrollHeight - prevHeight;
            }
            setAdjustingScroll(false);
          }, 0);
        });
      }
    }
  }, [inView, isFetching, hasPreviousPage, fetchPreviousPage, adjustingScroll]);
  let hasMessages = !!messages;

  useEffect(() => {
    if (hasMessages) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current?.scrollHeight;
      }

      setPageRendered(true);
    }
  }, [hasMessages]);

  useEffect(() => {
    if (shouldGoDown && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      setGoDown(false);
    }
  }, [shouldGoDown, setGoDown]);

  const [socket] = useSocket();
  const queryClient = useQueryClient();
  useEffect(() => {
    socket?.on("receiveMessage", (data) => {
      const prevMessages = queryClient.getQueryData([
        "rooms",
        { senderId: session?.user?.email, receiverId: id },
        "messages",
      ]) as InfiniteData<Imessage[]>;
      if (prevMessages && typeof prevMessages === "object") {
        const newMessages = { ...prevMessages, pages: [...prevMessages.pages] };
        const lastPage = newMessages.pages.at(-1);

        const newLastPage = lastPage ? [...lastPage] : [];
        newLastPage.push(data);
        newMessages.pages[newMessages.pages.length - 1] = newLastPage;
        queryClient.setQueryData(
          [
            "rooms",
            { senderId: session?.user?.email, receiverId: id },
            "messages",
          ],
          newMessages
        );
        setGoDown(true);
      }
    });
    return () => {
      socket?.off("receiveMessage");
    };
  }, [socket, id, queryClient, session, setGoDown]);
  return (
    <div className={styles.list} ref={listRef}>
      {!adjustingScroll && pageRendered && (
        <div ref={ref} style={{ height: 1 }} />
      )}

      {messages?.pages.map((page) => {
        return page.map((m) => {
          if (m.senderId === session?.user?.email) {
            return (
              <div
                key={m.messageId}
                className={cx(styles.message, styles.myMessage)}
              >
                <div className={styles.content}>{m.content}</div>
                <div className={styles.date}>
                  {dayjs(m.createdAt).format("YYYY년 MM월 DD일 mm분")}
                </div>
              </div>
            );
          }
          return (
            <div
              key={m.messageId}
              className={cx(styles.message, styles.yourMessage)}
            >
              <div className={styles.content}>{m.content}</div>
              <div className={styles.date}>
                {dayjs(m.createdAt).format("YYYY년 MM월 DD일 mm분")}
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}
