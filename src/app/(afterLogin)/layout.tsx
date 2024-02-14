import Image from "next/image";
import styles from "./layout.module.css";
import Link from "next/link";
import hLogo from "@/../public/hlogo.png";
import NavMenu from "./_component/NavMenu";
import LogoutButton from "./_component/LogoutButton";
import TrendSection from "./_component/TrendSection";
import RightSearchZone from "./_component/RightSearchZone";
import { auth } from "@/auth";
import RQProvider from "./_component/RQProvider";
import FollowRecommendSection from "./_component/FollowRecommendSection";
export default async function AfterLoginLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await auth();
  return (
    <div className={styles.container}>
      <header className={styles.leftSectionWrapper}>
        <section className={styles.leftSection}>
          <div className={styles.leftSectionFixed}>
            <Link href={session?.user ? "/home" : "/"} className={styles.logo}>
              <div className={styles.logoPill}>
                <Image src={hLogo} alt="h.com로고" width={30} height={30} />
              </div>
            </Link>
            {session?.user && (
              <>
                <nav>
                  <ul>
                    <NavMenu />
                  </ul>
                  <Link href="/compose/tweet" className={styles.postButton}>
                    <span>게시하기</span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1472mwg r-lrsllp"
                    >
                      <g>
                        <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
                      </g>
                    </svg>
                  </Link>
                </nav>
                <LogoutButton me={session} />
              </>
            )}
          </div>
        </section>
      </header>
      <RQProvider>
        <div className={styles.rightSectionWrapper}>
          <div className={styles.rightSectionInner}>
            <main className={styles.main}>{children}</main>
            <section className={styles.rightSection}>
              <RightSearchZone />
              <TrendSection />
              <div className={styles.followRecommend}>
                <h3>팔로우 추천</h3>
                <FollowRecommendSection />
              </div>
            </section>
          </div>
        </div>
        {modal}
      </RQProvider>
    </div>
  );
}
