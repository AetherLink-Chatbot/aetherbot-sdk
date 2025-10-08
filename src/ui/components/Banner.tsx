import React from "react";

export function Banner({
  bannerImageUrl,
  companyName,
  taglineText,
}: {
  bannerImageUrl: string;
  companyName: string;
  taglineText?: string;
}) {
  const onErr = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      "https://picsum.photos/seed/aetherbanner-fallback/800/200";
  };

  return (
    <div className="px-4">
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--aether-secondary)" }}
      >
        {/* Banner image */}
        <img
          src={bannerImageUrl}
          alt="banner"
          onError={onErr}
          className="h-28 w-full object-cover"
        />

        {/* Text overlay */}
        <div
          className="absolute left-4 top-4"
          style={{ color: "var(--aether-banner-text)" } as React.CSSProperties}
        >
          <p className="font-semibold">{companyName}</p>
          <p className="text-xs opacity-90 max-w-[240px]">
            {taglineText ||
              "Every conversation matters, and this chatbot makes it worthwhile."}
          </p>
        </div>
      </div>
    </div>
  );
}
