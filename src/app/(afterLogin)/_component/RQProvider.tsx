"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: React.ReactNode;
};

function RQProvider({ children }: Props) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, //다른 탭 다녀왔을 때 새로 가져오겟다.
          retryOnMount: true, //컴포넌트가 마운트되는 순간에 가져오겠다.
          refetchOnReconnect: false, //인터넷 연결이 끊겼다가 다시 접속이 되는순간
          retry: false, //데이터가져오기를 실패했을 때 몇번이나 시도할건지
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={process.env.NEXT_PUBLIC_MODE === "local"}
      />
    </QueryClientProvider>
  );
}

export default RQProvider;
