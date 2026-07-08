"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Theme toggle — Light / Dark хооронд click-аар шилжүүлэх.
 * Анхны утга нь system preference дагаж тогтоогдоно (layout.tsx-д
 * defaultTheme="system" + enableSystem), хэрэглэгчийн дарсны дараа explicit
 * light/dark болж тогтоогдоно.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Theme солих"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Theme солих</span>
    </Button>
  );
}
