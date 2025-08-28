"use client";

import { ThumbnailByBase64 } from "@/components/dashboard/Thumbnail";
import { SeriesCard } from "@/types/patient";
import { cn } from "@/lib/utils";

interface SeriesThumbnailProps {
  series: SeriesCard;
  isSelected: boolean;
  onSelect: (seriesUuid: string) => void;
}

export function SeriesThumbnail({
  series,
  isSelected,
  onSelect,
}: SeriesThumbnailProps) {
  return (
    <div
      className={cn(
        "cursor-pointer border-2 border-transparent rounded-md hover:border-primary",
        isSelected && "border-primary",
      )}
      onClick={() => onSelect(series.seriesUuid)}
    >
      <div className="rounded-md overflow-hidden">
        <ThumbnailByBase64 imgByteString={series.thumbnailImage} />
      </div>
      <p className="text-xs text-center mt-1">{series.seriesDescription}</p>
    </div>
  );
}
