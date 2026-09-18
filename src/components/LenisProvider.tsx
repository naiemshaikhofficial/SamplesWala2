"use client";

import React from "react";
import { ReactLenis } from "lenis/react";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ autoRaf: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
