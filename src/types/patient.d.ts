export interface Patient {
  uuid: string;
  name: string;
  birthdate: string;
  gender: string;
  searchCount: number;
}

export interface StudyCard {
  studyUuid: string;
  studyDate: string;
  studyTime: string;
  studyDescription: string;

  thumbnailImage: string;
  patientId: string;
  patientName: string;
  patientSex: string;
}
