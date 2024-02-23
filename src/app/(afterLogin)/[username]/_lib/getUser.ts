import { Iuser } from "@/model/user";
import { QueryFunction } from "@tanstack/react-query";

const getUser: QueryFunction<Iuser, [_1: string, string]> = async ({
  queryKey,
}) => {
  const [_1, username] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: {
        tags: ["users", username],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};
export default getUser;
