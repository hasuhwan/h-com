type Props = { pageParam?: number };

export default async function getFollowingPosts({ pageParam }: Props) {
  const res = await fetch(
    `http://localhost:9090/api/posts/followings?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "followings"],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
}
