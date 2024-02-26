import { Ipost } from "@/model/post";
import { create } from "zustand";

interface ImodalState {
  shouldGoDown: boolean;
  setGoDown(bool: boolean): void;
  reset(): void;
}
const useMessageStore = create<ImodalState>((set) => {
  return {
    shouldGoDown: false,
    setGoDown(bool) {
      set({ shouldGoDown: bool });
    },

    reset() {
      set({ shouldGoDown: false });
    },
  };
});

export default useMessageStore;
