const getSinglePost = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [_1, id] = queryKey;
  const res = await fetch(`http://localhost:9090/api/posts/${id}`, {
    next: {
      tags: ["posts", id],
    },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};
export default getSinglePost;
