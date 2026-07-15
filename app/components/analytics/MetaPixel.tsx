"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getMetaPixelBootstrap, getMetaPixelNoscriptUrl } from "@/lib/integrations/meta-pixel";

export function MetaPixel({ pixelId }: { pixelId?: string }) {
  const pathname = usePathname();
  const lastPath = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!pixelId || lastPath.current === pathname) return;
    let attempts = 0;
    let timer: number | undefined;
    const pageView = () => {
      if (typeof window.fbq === "function") { window.fbq("track", "PageView"); lastPath.current = pathname; return; }
      if (++attempts < 20) timer = window.setTimeout(pageView, 250);
    };
    pageView();
    return () => { if (timer) window.clearTimeout(timer); };
  }, [pathname, pixelId]);
  if (!pixelId) return null;
  return <><Script id="ebia-meta-pixel" strategy="afterInteractive">{getMetaPixelBootstrap(pixelId)}</Script><noscript><img className="tracking-pixel" height="1" width="1" src={getMetaPixelNoscriptUrl(pixelId)} alt="" /></noscript></>;
}
