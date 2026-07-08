"use client";

import { useEffect } from "react";

export function AxeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      Promise.all([import("@axe-core/react"), import("react"), import("react-dom")]).then(
        ([axe, React, ReactDOM]) => {
          axe.default(React.default, ReactDOM, 1000);
        },
      );
    }
  }, []);

  return <>{children}</>;
}
