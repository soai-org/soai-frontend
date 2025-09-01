export interface SeriesCard {
  id: string;
  instances: string[];
  mainDicomTags: MainDicomTags;
  thumbnailImage: string;
}

export interface MainDicomTags {
  modality: string;
  seriesInstanceUID: string;
}
