"use client";

import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/MainSidebar";
import { useStudiesByPatientUUID } from "@/query/patient";
import { Patient } from "@/types/patient";
import { ThumbnailByBase64 } from "@/components/dashboard/Thumbnail";
import { Card } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { convertToDate } from "@/lib/utils";

export default function Home() {
  const [selectedPatientForImages, setSelectedPatientForImages] =
    useState<Patient | null>(null);

  // Pagination을 위한 상태값
  const [since, setPage] = useState(0);
  const [limit, setSize] = useState(6);

  const {
    data: studiesData,
    mutateAsync,
    isPending,
  } = useStudiesByPatientUUID();

  const handleDataRequest = async (patient: Patient) => {
    setSelectedPatientForImages(patient);
    await mutateAsync({ patientUuid: patient.uuid, limit, since });
    setPage(0); // Reset to first page on new patient selection
  };

  return (
    <SidebarProvider>
      <MainSidebar onDataRequest={handleDataRequest} />
      <SidebarTrigger />
      <main className="w-full h-screen flex items-center">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 150,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          modules={[EffectCoverflow, Pagination]}
        >
          {studiesData && studiesData.length > 0 ? (
            studiesData.map((study) => (
              <SwiperSlide key={study.studyUuid} className={"!w-96"}>
                <Card className="w-full h-full">
                  <Link
                    href={`/viewer/${study.studyUuid}`}
                    className="group relative block w-full h-full"
                  >
                    <div className="w-full h-full">
                      <ThumbnailByBase64 imgBase64={study.thumbnailImage} />
                    </div>
                    <div className="absolute inset-0 grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-1 p-4 bg-black bg-opacity-60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="font-semibold border-b border-white">
                        Patient:
                      </p>
                      <p className="truncate">{study.patientName}</p>

                      <p className="font-semibold border-b border-white">
                        Description:
                      </p>
                      <p className="truncate">{study.studyDescription}</p>

                      <p className="font-semibold border-b border-white">
                        Date:
                      </p>
                      <p className="truncate">
                        {convertToDate(
                          study.studyDate,
                          study.studyTime,
                        ).toISOString()}
                      </p>

                      <p className="font-semibold border-b border-white">
                        Study UUID:
                      </p>
                      <p className="truncate">{study.studyUuid}</p>
                    </div>
                  </Link>
                </Card>
              </SwiperSlide>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              해당 환자의 이미지가 없습니다.
            </p>
          )}
        </Swiper>
      </main>
    </SidebarProvider>
  );
}
