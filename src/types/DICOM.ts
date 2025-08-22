export interface MainDicomTags {
  PatientName: string;
  PatientID: string;
  PatientBirthDate: string;
  PatientSex: string;
}

export interface Dicom {
  ID: string;
  IsProtected: boolean;
  IsStable: boolean;
  Labels: string[];
  LastUpdate: string;
  MainDicomTags: MainDicomTags;
  Studies: string[];
  Type: "Patient";
}
