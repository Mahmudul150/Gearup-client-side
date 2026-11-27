"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}
