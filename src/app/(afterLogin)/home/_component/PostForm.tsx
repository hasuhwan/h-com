"use client";

import {
  ChangeEventHandler,
  FormEventHandler,
  useRef,
  useState,
  useCallback,
  FormEvent,
} from "react";
import styles from "./postForm.module.css";
import Image from "next/image";
import { Session } from "@auth/core/types";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ipost } from "@/model/post";
type Props = {
  me: Session | null;
};

export default function PostForm({ me }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<
    Array<{ dataUrl: string; file: File } | null>
  >([]);
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("content", content);
      preview.forEach((p) => {
        p && formData.append("images", p.file);
      });
      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: "post",
        credentials: "include",
        body: formData,
      });
    },
    async onSuccess(response, variable) {
      const newPost = await response.json();
      setContent("");
      setPreview([]);
      if (queryClient.getQueryData(["posts", "recommends"])) {
        queryClient.setQueryData(
          ["posts", "recommends"],
          (prevData: { pages: Ipost[][] }) => {
            const shallow = { ...prevData, pages: [...prevData.pages] };
            shallow.pages[0] = [...shallow.pages[0]];
            shallow.pages[0].unshift(newPost);
            return shallow;
          }
        );
      }

      if (queryClient.getQueryData(["posts", "followings"])) {
        queryClient.setQueryData(
          ["posts", "followings"],
          (prevData: { pages: Ipost[][] }) => {
            const shallow = {
              ...prevData,
              pages: [...prevData.pages],
            };
            shallow.pages[0] = [...shallow.pages[0]];
            shallow.pages[0].unshift(newPost);
            return shallow;
          }
        );
      }
    },
    onError(error) {
      console.error(error);
      alert("업로드 중 에러가 발생했습니다.");
    },
  });
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setContent(e.target.value);
    },
    [content]
  );

  const onClickButton = useCallback(() => {
    imageRef.current?.click();
  }, []);
  const onUpload: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview((prevPreview) => {
            const prev = [...prevPreview];
            prev[idx] = { dataUrl: reader.result as string, file: file };
            return prev;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);
  const onRemoveImage = useCallback((index: number) => {
    setPreview((prevPreview) => {
      const prev = [...prevPreview];
      prev[index] = null;
      return prev;
    });
  }, []);
  return (
    <form className={styles.postForm} onSubmit={mutation.mutate}>
      <div className={styles.postUserSection}>
        <div className={styles.postUserImage}>
          <Image
            src={me?.user?.image as string}
            alt={(me?.user?.email as string) || "기본 이미지"}
            width={40}
            height={40}
          />
        </div>
      </div>
      <div className={styles.postInputSection}>
        <TextareaAutosize
          value={content}
          onChange={onChange}
          placeholder="무슨 일이 일어나고 있나요?"
        />
        <div style={{ display: "flex" }}>
          {preview.map(
            (v, idx) =>
              v && (
                <div
                  key={idx}
                  onClick={() => {
                    onRemoveImage(idx);
                  }}
                  className={styles.previewImageContainer}
                >
                  <img
                    src={v.dataUrl}
                    alt="미리보기"
                    style={{
                      width: "100%",
                      objectFit: "contain",
                      maxHeight: "100px",
                    }}
                  />
                </div>
              )
          )}
        </div>
        <div className={styles.postButtonSection}>
          <div className={styles.footerButtons}>
            <div className={styles.footerButtonLeft}>
              <input
                type="file"
                name="imageFiles"
                multiple
                hidden
                ref={imageRef}
                onChange={onUpload}
              />
              <button
                className={styles.uploadButton}
                type="button"
                onClick={onClickButton}
              >
                <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              </button>
            </div>
            <button className={styles.actionButton} disabled={!content}>
              게시하기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
