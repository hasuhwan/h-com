import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import styles from "./post.module.css";
import "dayjs/locale/ko";
import Link from "next/link";
import Image from "next/image";
import ActionButtons from "./ActionButtons";
import PostArticle from "./PostArticle";

dayjs.locale("ko");
dayjs.extend(relativeTime);

export default function Post() {
  const target = {
    postId: 1,
    User: {
      id: "elonmusk",
      nickname: "Elon Musk",
      image: "/yRsRRjGO.jpg",
    },
    content: "클론코딩 더미데이터 체험하기",
    createdAt: new Date(),
    Images: [],
  };
  return (
    <PostArticle post={target}>
      <div className={styles.postWrapper}>
        <div className={styles.postUserSection}>
          <Link href={`/${target.User.id}`} className={styles.postUserImage}>
            <Image
              src={target.User.image}
              alt={target.User.nickname}
              width={40}
              height={40}
            />
          </Link>
          <div className={styles.postShade} />
        </div>
        <div className={styles.postBody}>
          <div className={styles.postMeta}>
            <Link href={`/${target.User.id}`}>
              <span className={styles.postUserName}>
                {target.User.nickname}
              </span>
              &nbsp;
              <span className={styles.postUserId}>@{target.User.id}</span>
              &nbsp; · &nbsp;
            </Link>

            <span className={styles.postDate}>
              {dayjs(target.createdAt).fromNow(true)}
            </span>
          </div>
          <div>{target.content}</div>
          <div className={styles.postImageSection}>
            {/* {target.Images.length > 0 && (
              <div className={styles.postImageSection}>
                <Image src={target.Images[0]?.link} alt="" />
              </div>
            )} */}
          </div>
          <ActionButtons />
        </div>
      </div>
    </PostArticle>
  );
}
