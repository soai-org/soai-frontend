"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { MetadataDisplay } from "./MetadataDisplay";
import { signOut } from "next-auth/react";
import { useSeriesByStudyUUID } from "@/query/patient";
import { SeriesCard } from "@/types/patient";
import { SeriesThumbnail } from "./viewer/SeriesThumbnail";

interface ViewerLeftSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  currentSeriesId: string | null;
  onSeriesSelect: (seriesId: string) => void;
}

export function ViewerLeftSidebar({
  isCollapsed,
  toggleSidebar,
  currentSeriesId,
  onSeriesSelect,
}: ViewerLeftSidebarProps) {
  const searchParams = useSearchParams();
  const studyId = searchParams.get("studyUID");

  const [seriesList, setSeriesList] = useState<SeriesCard[]>([]);
  const { mutate: getSeries, isPending } = useSeriesByStudyUUID();

  useEffect(() => {
    if (studyId) {
      getSeries(
        { studyUuid: studyId, page: 1, size: 10 },
        {
          onSuccess: (data) => {
            if (data) {
              setSeriesList(data);
              if (data.length > 0) {
                onSeriesSelect(data[0].seriesUuid);
              }
            }
          },
        },
      );
    }
  }, [studyId, getSeries, onSeriesSelect]);

  return (
    <aside
      className={`absolute flex flex-col h-screen bg-secondary z-10 text-white p-4 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {!isCollapsed && (
          <a href="#" className="text-2xl font-bold px-2">
            SOAI Viewer
          </a>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-gray-700"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <MetadataDisplay />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Series</h3>
            <div className="grid grid-cols-2 gap-2">
              {isPending && <p>Loading...</p>}
              {seriesList.map((series) => (
                <SeriesThumbnail
                  key={series.seriesUuid}
                  series={series}
                  isSelected={currentSeriesId === series.seriesUuid}
                  onSelect={onSeriesSelect}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-auto">
        <Button
          variant="ghost"
          className={`w-full text-left hover:bg-primary ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          asChild
        >
          <Link href="/">
            <ChevronLeft className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
            {!isCollapsed && <span>돌아가기</span>}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={`w-full mt-2 text-left hover:bg-red-600/50 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          onClick={() => signOut({ redirectTo: "/signin" })}
        >
          <LogOut className={`w-5 h-5 ${!isCollapsed ? "mr-3" : ""}`} />
          {!isCollapsed && "로그아웃"}
        </Button>
      </div>
    </aside>
  );
}
