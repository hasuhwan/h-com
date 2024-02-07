type Props = { pageParam?: number };

export default async function getPostRecommends({ pageParam }: Props) {
  const res = await fetch(
    `http://localhost:9090/api/postRecommends?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "recommends"],
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
}
