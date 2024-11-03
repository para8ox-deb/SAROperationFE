import React from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function UploadZone({ onFileInput, onDrop }: UploadZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
    >
      <input
        type="file"
        accept="image/*"
        onChange={onFileInput}
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer flex flex-col items-center"
      >
        <Upload className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-lg mb-2">Drag & drop an image or click to browse</p>
        <p className="text-sm text-gray-500">Supports JPG, PNG files</p>
      </label>
    </div>
  );
}