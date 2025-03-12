import { useEffect } from "react";

export function useRTL(isRTL: boolean) {
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = isRTL ? "ar" : "en";

    // Add or remove RTL class on the html element
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [isRTL]);
}

export function getDirection(isRTL: boolean) {
  return isRTL ? "rtl" : "ltr";
}
