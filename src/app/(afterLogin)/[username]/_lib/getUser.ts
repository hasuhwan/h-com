import { Iuser } from "@/model/user";
import { QueryFunction } from "@tanstack/react-query";

const getUser: QueryFunction<Iuser, [_1: string, string]> = async ({
  queryKey,
}) => {
  const [_1, username] = queryKey;
  const res = await fetch(`http://localhost:9090/api/users/${username}`, {
    next: {
      tags: ["users", username],
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("failed to fetch data");
  }
  return res.json();
};
export default getUser;
