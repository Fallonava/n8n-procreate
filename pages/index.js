import { BatchCreator } from '../components/BatchCreator';
import { BatchHistory } from '../components/BatchHistory';
import { ProgressTracker } from '../components/ProgressTracker';
import { ThemeToggle } from '../components/ThemeToggle';
import { ImageGrid } from '../components/ImageGrid';
import { ImageModal } from '../components/ImageModal';
import { useState } from 'react';

export default function Home() {
  const [activeBatch, setActiveBatch] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBatchStart = (batchInfo) => {
    setActiveBatch(batchInfo);
  };

  const handleImageGenerated = (image) => {
    setGeneratedImages(prev => [image, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto p-6 lg:p-12">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              AI Stock Studio
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Professional Image Generation Pipeline
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center px-3 py-1 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-medium text-green-500">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              System Operational
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Panel: Generator (Fixed/Sticky on large screens) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <BatchCreator
              onBatchStart={handleBatchStart}
              onImageGenerated={handleImageGenerated}
            />

            {/* Active Progress */}
            {activeBatch && activeBatch.status === 'processing' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ProgressTracker
                  progress={activeBatch.progress}
                  currentStep={activeBatch.currentStep}
                  status={activeBatch.status}
                />
              </div>
            )}

            <div className="hidden lg:block">
              <BatchHistory />
            </div>
          </div>

          {/* Right Panel: Results Grid */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="bg-white dark:bg-[#1c1c1e] rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">Latest Generations</h2>
                <span className="text-sm text-gray-400">{generatedImages.length} items</span>
              </div>

              <ImageGrid
                images={generatedImages}
                onImageClick={setSelectedImage}
                isLoading={activeBatch?.status === 'processing'}
              />

              {generatedImages.length === 0 && !activeBatch && (
                <div className="h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p>Ready to generate. Configure your batch on the left.</p>
                </div>
              )}
            </div>

            <div className="lg:hidden">
              <BatchHistory />
            </div>
          </div>

        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}