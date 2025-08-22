"use client";

import { Separator } from "./ui/separator";

export function MetadataDisplay() {
  return (
    <div className="space-y-4 text-white mb-4">
      {/* Patient Information */}
      <div>
        <h3 className="text-md font-semibold mb-2 px-2">Patient Info</h3>
        <div className="space-y-1 text-xs px-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span>John Doe</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">ID</span>
            <span>P12345678</span>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-600" />

      {/* Image Information */}
      <div>
        <h3 className="text-md font-semibold mb-2 px-2">Image Info</h3>
        <div className="space-y-1 text-xs px-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Study ID</span>
            <span>S98765</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Modality</span>
            <span>CT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Size</span>
            <span>512x512</span>
          </div>
        </div>
      </div>
      <Separator className="bg-gray-600" />
    </div>
  );
}
