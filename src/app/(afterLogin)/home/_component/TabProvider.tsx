"use client";

import { createContext, useState } from "react";

export const Tabcontext = createContext({
  tab: "rec",
  setTab: (value: "rec" | "fol") => {},
});

export default function TabProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState("rec");
  return (
    <Tabcontext.Provider value={{ tab, setTab }}>
      {children}
    </Tabcontext.Provider>
  );
}
