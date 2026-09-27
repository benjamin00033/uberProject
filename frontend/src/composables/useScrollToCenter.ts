import { useRafFn } from "@vueuse/core";

// 與emit id 做對應內容, scrollTo Item 動作

export function useScrollToCenter() {
  const scrollTo = (id: string) => {
    const { pause } = useRafFn(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(`Element with id ${id} not found.`);
      }
      pause(); // Run only once
    });
  };
  return { scrollTo };
}
