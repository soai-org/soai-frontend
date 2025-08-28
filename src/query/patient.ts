import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "./axios";
import { Dicom, Level } from "@/types/DICOM";
import { Patient, StudyCard } from "@/types/patient";
import { Pagination } from "@/types/pagination";

interface OrthancRequest {
  name: string;
  level: Level;
}

interface OrthancDetailRequest {
  patientUuid: string;
  level: Level;
}

const dashboardPath = "/api/dashboard";

// 환자 이름으로 대상 환자 찾는 REST API 요청
export function useSearchPatientByName(name: string) {
  return useQuery({
    queryKey: [name],
    queryFn: async () => {
      try {
        const requestUrl = dashboardPath + "/toolsfind";
        const data: OrthancRequest = { name, level: Level.Patient };
        const res = await axios.post(requestUrl, data);

        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    enabled: !!name,
    select: (data: Dicom[]): Patient[] => {
      return data.map((dicom) => ({
        uuid: dicom.MainDicomTags.PatientID,
        name: dicom.MainDicomTags.PatientName,
        birthdate: dicom.MainDicomTags.PatientBirthDate,
        gender: dicom.MainDicomTags.PatientSex,
        searchCount: dicom.Studies.length,
      }));
    },
  });
}

// export function useSearchStudiesByPatient(patientUUID: string) {
//   return useQuery({
//     queryKey: [patientUUID],
//     queryFn: async () => {
//       const requestUrl = dashboardPath + "/findbyuuid";
//       const data: OrthancDetailRequest = {
//         uuid: patientUUID,
//         level: Level.Patient,
//       };

//       try {
//         const res = await axios.post(requestUrl, data);
//         return res.data;
//       } catch (error) {
//         console.log(error);
//         return [];
//       }
//     },
//   });
// }

export function useStudiesByPatientUUID() {
  const requestUrl = dashboardPath + "/studycards";

  return useMutation({
    mutationFn: async ({
      patientUuid,
      page = 1,
      size = 10,
    }: { patientUuid: string } & Pagination) => {
      const data: OrthancDetailRequest & Pagination = {
        patientUuid,
        level: Level.Study,
        page,
        size,
      };

      try {
        const res = await axios.post<StudyCard[]>(requestUrl, data);
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });
}
