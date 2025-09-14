"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { MetadataDisplay } from "./MetadataDisplay";
import { signOut } from "next-auth/react";
import { SeriesCard } from "@/types/viewer/series";
import { SeriesThumbnail } from "./SeriesThumbnail";
import { ViewerMetadata } from "@/types/viewer/metadata";

interface ViewerLeftSidebarProps {
  metadata: ViewerMetadata;
  seriesList?: SeriesCard[];
  isSeriesLoading: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  currentSeriesId: string | null;
  onSeriesSelect: (seriesId: string) => void;
}

export function ViewerLeftSidebar({
  metadata,
  seriesList,
  isSeriesLoading,
  isCollapsed,
  toggleSidebar,
  currentSeriesId,
  onSeriesSelect,
}: ViewerLeftSidebarProps) {
  useEffect(() => {
    if (seriesList && seriesList.length > 0) {
      onSeriesSelect(seriesList[0].id);
    }
  }, [seriesList, onSeriesSelect]);

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
          <MetadataDisplay metadata={metadata} />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Series</h3>
            <div className="w-full grid gap-2">
              {isSeriesLoading && <p>Loading...</p>}
              {seriesList &&
                seriesList.map((series) => (
                  <SeriesThumbnail
                    key={series.id}
                    series={series}
                    isSelected={currentSeriesId === series.id}
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
          className={`w-full mt-2 text-left hover:bg-red-600/50 hover:cursor-pointer ${
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
