"use client";

import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import styles from "./messageForm.module.css";
import TextareaAutosize from "react-textarea-autosize";
import useSocket from "../_lib/useSocket";
import { useSession } from "next-auth/react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Imessage } from "@/model/message";
import useMessageStore from "@/store/messageModal";

type Props = { id: string };

export default function MessageForm({ id }: Props) {
  const [content, setContent] = useState("");
  const [socket] = useSocket();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { setGoDown } = useMessageStore();

  const onChangeContent: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };
  const onSubmit = () => {
    if (!session?.user?.email) {
      return;
    }
    const ids = [session.user.email, id].sort().join("-");
    socket?.emit("sendMessage", {
      senderId: session.user.email,
      receiverId: id,
      content,
    });
    const prevMessages = queryClient.getQueryData([
      "rooms",
      { senderId: session.user.email, receiverId: id },
      "messages",
    ]) as InfiniteData<Imessage[]>;
    if (prevMessages && typeof prevMessages === "object") {
      const newMessages = { ...prevMessages, pages: [...prevMessages.pages] };
      const lastPage = newMessages.pages.at(-1);
      const lastMessageId = lastPage?.at(-1)?.messageId;
      const newLastPage = lastPage ? [...lastPage] : [];
      newLastPage.push({
        senderId: session.user.email,
        receiverId: id,
        content,
        messageId: lastMessageId ? lastMessageId + 1 : 1,
        room: ids,
        createdAt: new Date(),
      });
      newMessages.pages[newMessages.pages.length - 1] = newLastPage;
      queryClient.setQueryData(
        ["rooms", { senderId: session.user.email, receiverId: id }, "messages"],
        newMessages
      );
      setGoDown(true);
    }
    setContent("");
  };
  const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      if (!content?.trim()) {
        return;
      }
      onSubmit();
    }
  };
  return (
    <div className={styles.formZone}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <TextareaAutosize
          onChange={onChangeContent}
          onKeyDown={onEnter}
          value={content}
          placeholder="새 쪽지 작성하기"
        />
        <button
          className={styles.submitButton}
          type="submit"
          disabled={!content}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            aria-hidden="true"
            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
          >
            <g>
              <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z"></path>
            </g>
          </svg>
        </button>
      </form>
    </div>
  );
}
