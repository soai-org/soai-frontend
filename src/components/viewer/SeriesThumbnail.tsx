"use client";

import { ThumbnailByURL } from "@/components/dashboard/Thumbnail";
import { SeriesCard } from "@/types/viewer/series";
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
        "flex items-center w-full cursor-pointer border-2 border-transparent rounded-md hover:border-primary",
        isSelected && "border-primary",
      )}
      onClick={() => onSelect(series.id)}
    >
      <div className="rounded-md overflow-hidden">
        <ThumbnailByURL imgUrl={series.thumbnailImage} />
      </div>
      <p className="text-xs text-center mt-1 w-full">
        {series.mainDicomTags.modality}
      </p>
    </div>
  );
}
