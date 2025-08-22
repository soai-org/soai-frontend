import { dataTagErrorSymbol, useQuery } from "@tanstack/react-query";
import axios from "./axios";
import { Dicom } from "@/types/DICOM";
import { Patient } from "@/types/Patient";

interface OrthancRequest {
  name: string;
  level: string;
}

export function useSearchPatientByName(name: string) {
  return useQuery({
    queryKey: [name],
    queryFn: async () => {
      try {
        const requestUrl = "/api/dashboard/toolsfindbyname";
        const data: OrthancRequest = { name, level: "Patient" };
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
        name: dicom.MainDicomTags.PatientName,
        birthdate: dicom.MainDicomTags.PatientBirthDate,
        gender: dicom.MainDicomTags.PatientSex,
        searchCount: dicom.Studies.length,
      }));
    },
  });
}

export function useSearchStudiesByPatient(patiendId: string) {
  return useQuery({
    queryKey: [patiendId],
    // queryFn: async() => {
    //   const uri = "orthanc";
    //   const data: GetStudiesReqBody = { patiendId }
    //   const res =
    // }
  });
}
