import Link from "next/link";
import styles from "./trend.module.css";
import { IhashTag } from "@/model/hashTag";
type Prop = { trend: IhashTag };
export default function Trend({ trend }: Prop) {
  return (
    <Link href={`/search?q=${trend.title}`} className={styles.container}>
      <div className={styles.count}>실시간트렌드</div>
      <div className={styles.title}>{trend.title}</div>
      <div className={styles.count}>{trend.count.toLocaleString()}</div>
    </Link>
  );
}
