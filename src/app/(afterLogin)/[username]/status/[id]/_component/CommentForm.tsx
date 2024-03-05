"use client";

import Image from "next/image";
import styles from "./commentForm.module.css";
import {
  useState,
  useRef,
  ChangeEventHandler,
  useCallback,
  FormEventHandler,
  FormEvent,
} from "react";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import TextareaAutosize from "react-textarea-autosize";
import { Ipost } from "@/model/post";
type Props = {
  id: string;
};
export default function CommentForm({ id }: Props) {
  const [content, setContent] = useState("");
  const imageRef = useRef<HTMLInputElement>(null);
  const { data: me } = useSession();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<
    Array<{ dataUrl: string; file: File } | null>
  >([]);

  const comment = useMutation({
    mutationFn: (e: FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("content", content);
      preview.forEach((p) => {
        p && formData.append("images", p.file);
      });
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments`,
        {
          method: "post",
          credentials: "include",
          body: formData,
        }
      );
    },
    async onSuccess(response, variable) {
      const newPost = await response.json();
      setContent("");
      setPreview([]);
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: Ipost | InfiniteData<Ipost[]> | undefined =
            queryClient.getQueryData(queryKey);
          if (value && "pages" in value) {
            const obj = value.pages.flat().find((v) => v.postId === Number(id));
            if (obj) {
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === Number(id)
              );
              const shallow = { ...value };
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Comments: [{ userId: me?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Comments: shallow.pages[pageIndex][index]._count.Comments + 1,
                },
              };
              shallow.pages[0].unshift(newPost);
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            if (value.postId === Number(id)) {
              const shallow = {
                ...value,
                Comments: [{ userId: me?.user?.email as string }],
                _count: {
                  ...value._count,
                  Comments: value._count.Comments + 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
      await queryClient.invalidateQueries({
        queryKey: ["posts", id],
      });
    },
  });

  const onClickButton = () => {
    imageRef.current?.click();
  };
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    comment.mutate(e);
  };
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (e) => {
      setContent(e.target.value);
    },
    [content]
  );
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
  const post = queryClient.getQueryData(["posts", id]);
  if (!post) {
    return null;
  }
  if (!me?.user) {
    return null;
  }
  return (
    <form className={styles.postForm} onSubmit={onSubmit}>
      <div className={styles.postUserSection}>
        <div className={styles.postUserImage}>
          <Image
            src={me?.user?.image as string}
            alt={me?.user?.email as string}
            width={40}
            height={40}
          />
        </div>
      </div>
      <div className={styles.postInputSection}>
        <TextareaAutosize
          value={content}
          onChange={onChange}
          placeholder="답글 게시하기"
          className={styles.input}
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
                  <Image
                    src={v.dataUrl}
                    alt="미리보기"
                    style={{
                      objectFit: "contain",
                      maxHeight: "100px",
                    }}
                    fill={true}
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
              답글
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
