import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "./axios";
import { Dicom, Level } from "@/types/DICOM";
import { InstanceCard, Patient, SeriesCard, StudyCard } from "@/types/patient";
import { Pagination } from "@/types/pagination";
import { getSession } from "next-auth/react";

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
  const requestUrl = dashboardPath + "/toolsfind";

  return useQuery({
    queryKey: [requestUrl, name],
    queryFn: async () => {
      const session = await getSession();
      if (!session?.accessToken) return [];

      try {
        const data: OrthancRequest = { name, level: Level.Patient };
        const res = await axios.post(requestUrl, data, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

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

      const session = await getSession();
      if (!session?.accessToken) return [];

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

export function useSeriesByStudyUUID() {
  const requestUrl = dashboardPath + "/seriescards";

  return useMutation({
    mutationFn: async ({
      studyUuid,
      page = 1,
      size = 10,
    }: { studyUuid: string } & Pagination) => {
      const data: { studyUuid: string; level: Level } & Pagination = {
        studyUuid,
        level: Level.Series,
        page,
        size,
      };

      const session = await getSession();
      if (!session?.accessToken) return [];

      try {
        const res = await axios.post<SeriesCard[]>(requestUrl, data);
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });
}

export function useInstancesBySeriesUUID() {
  const requestUrl = dashboardPath + "/instances";

  return useMutation({
    mutationFn: async ({ seriesUuid }: { seriesUuid: string }) => {
      const data = {
        seriesUuid,
        level: Level.Instance,
      };

      const session = await getSession();
      if (!session?.accessToken) return [];

      try {
        const res = await axios.post<InstanceCard[]>(requestUrl, data);
        return res.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  });
}
