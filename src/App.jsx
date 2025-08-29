import { useState, useCallback } from "react";
import { useImageStore } from "./state/store";
import { useImageProcessor } from "./hooks/hooks";
import {
  Header,
  QualityControl,
  DropZone,
  ProcessingIndicator,
  ResultsSection,
  EmptyState,
} from "./components/components";

const App = () => {
  const store = useImageStore();
  const { processFiles, recompressImages, downloadImage, downloadAll } =
    useImageProcessor();
  const [dragActive, setDragActive] = useState(false);

  const handleQualityChange = useCallback(
    (newQuality) => {
      store.setQuality(newQuality);
      recompressImages(newQuality);
    },
    [store, recompressImages]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <QualityControl
          quality={store.quality}
          onQualityChange={handleQualityChange}
          disabled={store.processing}
        />

        <DropZone
          onDrop={processFiles}
          onFileSelect={processFiles}
          dragActive={dragActive}
          setDragActive={setDragActive}
          disabled={store.processing}
        />

        {store.processing && <ProcessingIndicator />}

        {store.images.length > 0 ? (
          <ResultsSection
            images={store.images}
            onDownloadImage={downloadImage}
            onRemoveImage={store.removeImage}
            onDownloadAll={downloadAll}
            onClearAll={store.clearImages}
          />
        ) : (
          !store.processing && <EmptyState />
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default App;
