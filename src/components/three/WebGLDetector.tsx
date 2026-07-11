"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const WEBGL_DISABLED_CLASS = "webgl-disabled";
const MOBILE_USER_AGENT_PATTERN = /Android|iPhone|iPad|iPod|Mobile/i;

function isMobileUserAgent(): boolean {
  return MOBILE_USER_AGENT_PATTERN.test(navigator.userAgent);
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (isMobileUserAgent()) {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function useWebGL(): boolean {
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    const detected = detectWebGL();
    setHasWebGL(detected);
    document.documentElement.classList.toggle(WEBGL_DISABLED_CLASS, !detected);
  }, []);

  return hasWebGL;
}

interface WebGLOnlyProps {
  children: ReactNode;
  fallback: ReactNode;
}

export function WebGLOnly({ children, fallback }: WebGLOnlyProps) {
  const hasWebGL = useWebGL();
  if (hasWebGL) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
