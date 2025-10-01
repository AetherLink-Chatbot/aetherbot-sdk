import React from "react";

export function Banner({ bannerImageUrl, companyName }: { bannerImageUrl: string; companyName: string }) {
  const onErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/aetherbanner-fallback/800/200";
  };
  return (
    <div className="px-4">
      <div className="relative overflow-hidden rounded-2xl">
        {/* Placeholder/random banner image by default */}
        <img src={bannerImageUrl} alt="banner" onError={onErr} className="h-28 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--aether-primary)]/70 to-transparent" />
        <div className="absolute left-4 top-4 text-white">
          <p className="font-semibold">{companyName}</p>
          <p className="text-xs opacity-90 max-w-[240px]">
            Every conversation matters, and this chatbot makes it worthwhile.
          </p>
        </div>
      </div>
    </div>
  );
}
