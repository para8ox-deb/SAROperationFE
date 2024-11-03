import React, { useState, useCallback } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { ImagePreview } from './components/ImagePreview';
import { UploadZone } from './components/UploadZone';
import { config } from './config';

function App() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  }, []);

  const handleSubmit = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch(`${config.apiUrl}/detect`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Detection failed');

      const blob = await response.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError('Failed to download image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Search & Rescue Operation</h1>
          <p className="text-gray-400">Upload UAV imagery to detect people in search and rescue scenarios</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <UploadZone onFileInput={handleFileInput} onDrop={handleDrop} />

            {preview && (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Original Image</h2>
                  <ImagePreview 
                    imageUrl={preview} 
                    title="Original Image"
                    onDownload={() => image && downloadImage(preview, image.name)}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Detect People'
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-gray-800/50 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
            {result ? (
              <ImagePreview 
                imageUrl={result} 
                title="Detection Result"
                onDownload={() => downloadImage(result, 'detection-result.jpg')}
              />
            ) : (
              <div className="aspect-[16/10] rounded-lg bg-gray-900/50 flex items-center justify-center">
                <p className="text-gray-500">Detection results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;