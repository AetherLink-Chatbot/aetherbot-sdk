import React, { useState } from "react";

export function AvatarImg({ src, alt = "Avatar", className }: { src: string; alt?: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc("https://picsum.photos/seed/aetherbot-fallback/80")}
    />
  );
}

