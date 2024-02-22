import { Ipost } from "@/model/post";
import { create } from "zustand";

interface ImodalStore {
  mode: "new" | "comment";
  data: Ipost | null;
  setMode(mode: "new" | "comment"): void;
  setData(data: Ipost | null): void;
  reset(): void;
}
const useModalStore = create<ImodalStore>((set) => {
  return {
    mode: "new",
    data: null,
    setMode(mode) {
      set({ mode });
    },
    setData(data) {
      set({ data });
    },
    reset() {
      set({ mode: "new", data: null });
    },
  };
});

export default useModalStore;
