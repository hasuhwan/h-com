import { Imessage } from "@/model/message";

type Props = {
  pageParam?: number;
  queryKey: [string, { senderId: string; receiverId: string }, string];
};

export default async function getMessages({ pageParam, queryKey }: Props) {
  const [_, userInfo] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userInfo.senderId}/rooms/${userInfo.receiverId}?cursor=${pageParam}`,
    {
      next: {
        tags: ["rooms"],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json() as Promise<Imessage[]>;
}
