"use client";

import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/MainSidebar";
import { useStudiesByPatientUUID } from "@/query/patient";
import { Patient } from "@/types/patient";
import { ThumbnailByBase64 } from "@/components/dashboard/Thumbnail";

export default function Home() {
  const [selectedPatientForImages, setSelectedPatientForImages] =
    useState<Patient | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);

  const { data: studiesData, mutateAsync } = useStudiesByPatientUUID();

  const handleDataRequest = async (patient: Patient) => {
    setSelectedPatientForImages(patient);
    await mutateAsync({ patientUuid: patient.uuid, page, size });
    setPage(1); // Reset to first page on new patient selection
  };

  return (
    <SidebarProvider>
      <MainSidebar onDataRequest={handleDataRequest} />
      <main className="flex flex-col flex-1 p-4">
        <div className="flex items-center mb-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold ml-4 text-center flex-1">
            {selectedPatientForImages
              ? `${selectedPatientForImages.name} 환자의 의료 이미지`
              : "환자를 선택하여 의료 이미지를 확인하세요."}
          </h1>
        </div>

        {selectedPatientForImages && (
          <div className="flex-1 flex flex-col w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {studiesData && studiesData.length > 0 ? (
                studiesData.map((study) => (
                  <div
                    key={study.studyUuid}
                    className="border rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="w-full aspect-square relative">
                      <ThumbnailByBase64 imgByteString={study.thumbnailImage} />
                    </div>
                    <div className="p-2 text-sm text-center">
                      <p className="font-semibold">{study.patientName}</p>
                      <p className="text-gray-500">
                        {study.studyDate + study.studyTime}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  해당 환자의 이미지가 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}
