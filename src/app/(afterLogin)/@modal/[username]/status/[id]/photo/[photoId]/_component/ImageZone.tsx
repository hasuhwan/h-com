"use client";

import { useQuery } from "@tanstack/react-query";

import { Ipost } from "@/model/post";
import getSinglePost from "@/app/(afterLogin)/[username]/status/[id]/_lib/getSinglePost";
import ActionButtons from "@/app/(afterLogin)/_component/ActionButtons";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import styles from "../photoModal.module.css";
import { useMemo } from "react";

type Props = {
  username: string;
  id: string;
  photoId: string;
};
export default function ImageZone({ id, photoId, username }: Props) {
  const { data: post, error } = useQuery<
    Ipost,
    Object,
    Ipost,
    [_1: string, _2: string]
  >({
    queryKey: ["posts", id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000, //fresh stale time
    gcTime: 300 * 1000,
  });
  const idx = useMemo(() => {
    return post?.Images.findIndex((image) => image.imageId === Number(photoId));
  }, [photoId, post]);
  if (!post?.Images[0]) {
    return null;
  }

  return (
    <div className={styles.imageZone}>
      <div className={styles.imageContainer}>
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          navigation
          initialSlide={idx}
        >
          {post?.Images
            ? post.Images.map((image) => {
                return (
                  <SwiperSlide key={image.imageId}>
                    <Image src={image.link} alt={image.link} fill={true} />
                  </SwiperSlide>
                );
              })
            : null}
        </Swiper>
      </div>
      <div className={styles.buttonZone}>
        <div className={styles.buttonInner}>
          <ActionButtons white post={post} />
        </div>
      </div>
    </div>
  );
}
