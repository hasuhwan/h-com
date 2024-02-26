"use client";

import styles from "../profile.module.css";
import BackButton from "@/app/(afterLogin)/_component/BackButton";
import { Iuser } from "@/model/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cx from "classnames";
import Image from "next/image";
import getUser from "../_lib/getUser";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Session } from "@auth/core/types";
import e from "express";
type Props = {
  username: string;
  session: Session | null;
};
export default function UserInfo({ username, session }: Props) {
  const router = useRouter();
  const { data: user, error } = useQuery<
    Iuser,
    Object,
    Iuser,
    [_1: string, _2: string]
  >({
    queryKey: ["users", username],
    queryFn: getUser,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  const followed = !!user?.Followers?.find(
    (v) => v.id === session?.user?.email
  );
  const queryClient = useQueryClient();
  const follow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: "include",
          method: "post",
        }
      );
    },
    onMutate(userId: string) {
      const value: Iuser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        if (index > -1) {
          const shallow = [...value];
          shallow[index] = {
            ...shallow[index],
            Followers: [{ id: session?.user?.email as string }],
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers + 1,
            },
          };
          queryClient.setQueryData(["users", "followRecommends"], shallow);
        }
      }
      const value2: Iuser | undefined = queryClient.getQueryData([
        "users",
        userId,
      ]);
      if (value2) {
        const shallow: Iuser = {
          ...value2,
          Followers: [{ id: session?.user?.email as string }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
    onError(error, userId: string) {
      console.error(error);
      const value: Iuser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        if (index > -1) {
          const shallow = [...value];
          shallow[index] = {
            ...shallow[index],
            Followers: shallow[index].Followers.filter(
              (v) => v.id !== session?.user?.email
            ),
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers - 1,
            },
          };
          queryClient.setQueryData(["users", "followRecommends"], shallow);
        }
        const value2: Iuser | undefined = queryClient.getQueryData([
          "users",
          userId,
        ]);
        if (value2) {
          const shallow = {
            ...value2,
            Followers: value2.Followers.filter(
              (v) => v.id !== session?.user?.email
            ),
            _count: {
              ...value2._count,
              Followers: value2._count?.Followers - 1,
            },
          };
          queryClient.setQueryData(["users", userId], shallow);
        }
      }
    },
  });
  const unfollow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: "include",
          method: "delete",
        }
      );
    },
    onMutate(userId: string) {
      const value: Iuser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        if (index > -1) {
          const shallow = [...value];
          shallow[index] = {
            ...shallow[index],
            Followers: shallow[index].Followers.filter(
              (v) => v.id !== session?.user?.email
            ),
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers - 1,
            },
          };
          queryClient.setQueryData(["users", "followRecommends"], shallow);
        }
        const value2: Iuser | undefined = queryClient.getQueryData([
          "users",
          userId,
        ]);
        if (value2) {
          const shallow = {
            ...value2,
            Followers: value2.Followers.filter(
              (v) => v.id !== session?.user?.email
            ),
            _count: {
              ...value2._count,
              Followers: value2._count?.Followers - 1,
            },
          };
          queryClient.setQueryData(["users", userId], shallow);
        }
      }
    },
    onError(error, userId: string) {
      console.error(error);
      const value: Iuser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);

        if (index > -1) {
          const shallow = [...value];
          shallow[index] = {
            ...shallow[index],
            Followers: [{ id: session?.user?.email as string }],
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers + 1,
            },
          };
          queryClient.setQueryData(["users", "followRecommends"], shallow);
        }
      }
      const value2: Iuser | undefined = queryClient.getQueryData([
        "users",
        userId,
      ]);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: [{ userId: session?.user?.email as string }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
  });
  if (error) {
    return (
      <>
        <div className={styles.header}>
          <BackButton />
          <h3 className={styles.headerTitle}>프로필</h3>
        </div>
        <div className={styles.userZone}>
          <div className={styles.userImage}></div>
          <div className={styles.userName}>
            <div>@{username}</div>
          </div>
        </div>
        <div className={styles.userError}>계정이 존재하지 않음</div>
      </>
    );
  }
  if (!user) {
    return null;
  }

  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
    }
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  };
  const onMessage: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const ids = [session?.user?.email, user.id].sort().join("-");
    router.push(`/messages/${ids}`);
  };
  return (
    <>
      {" "}
      <div className={styles.header}>
        <BackButton />
        <h3 className={styles.headerTitle}>{user.nickname}</h3>
      </div>
      <div className={styles.userZone}>
        <div className={styles.userRow}>
          <div className={styles.userImage}>
            <Image src={user.image} alt={user.id} width={134} height={134} />
          </div>
          <div className={styles.userName}>
            <div>{user.nickname}</div>
            <div>@{user.id}</div>
          </div>
          {user.id !== session?.user?.email && (
            <>
              <button onClick={onMessage} className={styles.messageButton}>
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  aria-hidden="true"
                  className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
                >
                  <g>
                    <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z"></path>
                  </g>
                </svg>
              </button>
              <button
                className={cx(styles.followButton, followed && styles.followed)}
                onClick={onFollow}
              >
                {followed ? "팔로잉" : "팔로우"}
              </button>
            </>
          )}
        </div>
        <div className={styles.userFollower}>
          <div>{user._count.Followers} 팔로워</div>
          &nbsp;
          <div>{user._count.Followings} 팔로우 중</div>
        </div>
      </div>
    </>
  );
}
