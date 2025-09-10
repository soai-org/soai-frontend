"use client";

import { ViewerMetadata } from "@/types/viewer/metadata";
import { Separator } from "../ui/separator";

interface MetadataDisplayProps {
  metadata: ViewerMetadata;
}

export function MetadataDisplay({ metadata }: MetadataDisplayProps) {
  return (
    <div className="space-y-4 text-white mb-4">
      {/* Patient Information */}
      <div>
        <h3 className="text-md font-semibold mb-2 px-2">Patient Info</h3>
        <div className="space-y-1 text-xs px-2">
          <div className="flex justify-between overflow-hidden text-ellipsis">
            <span className="text-gray-400">Name</span>
            <span>{metadata.patientName}</span>
          </div>
          <div className="flex justify-between overflow-hidden text-ellipsis">
            <span className="text-gray-400">ID</span>
            <span>{metadata.patientId}</span>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-600" />

      {/* Image Information */}
      <div>
        <h3 className="text-md font-semibold mb-2 px-2">Image Info</h3>
        <div className="space-y-1 text-xs px-2">
          <div className="flex justify-between overflow-hidden text-ellipsis">
            <span className="text-gray-400">Study Date</span>
            <span>{metadata.studyDate}</span>
          </div>
          <div className="flex justify-between overflow-hidden text-ellipsis">
            <span className="text-gray-400">Description</span>
            <span>{metadata.studyDescription}</span>
          </div>
          <div className="flex justify-between overflow-hidden text-ellipsis">
            <span className="text-gray-400">Modality</span>
            <span>{metadata.modality}</span>
          </div>
          <div className="flex justify-between overflow-hidden text-ellipsis">
            <span className="text-gray-400">Size</span>
            <span>{metadata.size}</span>
          </div>
        </div>
      </div>
      <Separator className="bg-gray-600" />
    </div>
  );
}
