"use client";

import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";

interface Patient {
  name: string;
  birthdate: string;
  gender: string;
  searchCount: number;
}

interface MedicalImage {
  id: string;
  url: string;
  alt: string;
  date: string; // Add date property
  patientName: string; // Add patientName for display below image
}

const IMAGES_PER_PAGE = 6;

// Helper function to generate dummy dates
const getRandomDate = () => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0]; // YYYY-MM-DD format
};

// Dummy data for medical images
const allMedicalImages: { [key: string]: MedicalImage[] } = {
  김철수: Array.from({ length: 20 }).map((_, i) => ({
    id: `kim-chul-soo-${i + 1}`,
    url: `https://via.placeholder.com/150/FF0000/FFFFFF?text=김철수+이미지+${i + 1}`,
    alt: `김철수 의료 이미지 ${i + 1}`,
    date: getRandomDate(),
    patientName: "김철수",
  })),
  이영희: Array.from({ length: 15 }).map((_, i) => ({
    id: `lee-young-hee-${i + 1}`,
    url: `https://via.placeholder.com/150/0000FF/FFFFFF?text=이영희+이미지+${i + 1}`,
    alt: `이영희 의료 이미지 ${i + 1}`,
    date: getRandomDate(),
    patientName: "이영희",
  })),
  박민수: Array.from({ length: 25 }).map((_, i) => ({
    id: `park-min-soo-${i + 1}`,
    url: `https://via.placeholder.com/150/00FF00/FFFFFF?text=박민수+이미지+${i + 1}`,
    alt: `박민수 의료 이미지 ${i + 1}`,
    date: getRandomDate(),
    patientName: "박민수",
  })),
  // Add more dummy data for other patients as needed
};

export default function Home() {
  const [selectedPatientForImages, setSelectedPatientForImages] =
    useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImages, setCurrentImages] = useState<MedicalImage[]>([]);
  const [totalImages, setTotalImages] = useState(0);

  const fetchImagesForPatient = (patientName: string, page: number) => {
    const patientImages = allMedicalImages[patientName] || [];
    setTotalImages(patientImages.length);

    const startIndex = (page - 1) * IMAGES_PER_PAGE;
    const endIndex = startIndex + IMAGES_PER_PAGE;
    setCurrentImages(patientImages.slice(startIndex, endIndex));
  };

  useEffect(() => {
    if (selectedPatientForImages) {
      fetchImagesForPatient(selectedPatientForImages.name, currentPage);
    } else {
      setCurrentImages([]);
      setTotalImages(0);
      setCurrentPage(1);
    }
  }, [selectedPatientForImages, currentPage]);

  const handleDataRequest = (patient: Patient) => {
    setSelectedPatientForImages(patient);
    setCurrentPage(1); // Reset to first page on new patient selection
  };

  const totalPages = Math.ceil(totalImages / IMAGES_PER_PAGE);

  return (
    <SidebarProvider>
      <AppSidebar onDataRequest={handleDataRequest} />
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
              {currentImages.length > 0 ? (
                currentImages.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="w-full aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 text-sm text-center">
                      <p className="font-semibold">{image.patientName}</p>
                      <p className="text-gray-500">{image.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  해당 환자의 이미지가 없습니다.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-auto">
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                <span>
                  페이지 {currentPage} / {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </SidebarProvider>
  );
}
