// import React from 'react';
import { Download } from 'lucide-react';

interface ImagePreviewProps {
  imageUrl: string;
  title: string;
  onDownload?: () => void;
}

export function ImagePreview({ imageUrl, title, onDownload }: ImagePreviewProps) {
  return (
    <div className="relative group">
      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-900">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
      {onDownload && (
        <button
          onClick={onDownload}
          className="absolute top-4 right-4 p-2 bg-gray-900/80 hover:bg-gray-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Download image"
        >
          <Download className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}