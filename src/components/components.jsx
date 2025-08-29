import { useRef, useCallback } from 'react';
import { Upload, Download, FileImage, Trash2, Settings } from 'lucide-react';
import { ImageCompressorService } from '../services/service';

export const Header = () => (
  <div className="text-center mb-12">
    <div className="flex justify-center mb-4">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
        <FileImage className="h-8 w-8 text-white" />
      </div>
    </div>
    <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text ">
      Image Compressor
    </h1>
    <p className="text-slate-300 text-lg">Compress your images with smart quality control</p>
  </div>
);

export const QualityControl = ({ quality, onQualityChange, disabled }) => (
  <div className="max-w-md mx-auto mb-8">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="h-5 w-5 text-blue-400" />
        <h3 className="text-white font-semibold">Quality Settings</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Quality</span>
          <span className="text-blue-400 font-medium">{quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="95"
          value={quality}
          onChange={(e) => onQualityChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${quality}%, rgb(51 65 85) ${quality}%, rgb(51 65 85) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>High compression</span>
          <span>High quality</span>
        </div>
      </div>
    </div>
  </div>
);

export const DropZone = ({ onDrop, onFileSelect, dragActive, setDragActive, disabled }) => {
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    if (!disabled) {
      onDrop(e.dataTransfer.files);
    }
  }, [onDrop, setDragActive, disabled]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setDragActive(true);
    }
  }, [setDragActive, disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragActive(false);
    }
  }, [setDragActive]);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && !disabled) {
      onFileSelect(e.target.files);
      e.target.value = '';
    }
  }, [onFileSelect, disabled]);

  return (
    <div
      className={`max-w-2xl mx-auto mb-8 transition-all duration-300 ${
        dragActive && !disabled ? 'scale-105' : ''
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        dragActive && !disabled
          ? 'border-blue-400 bg-blue-400/10' 
          : 'border-slate-600 bg-white/5 hover:bg-white/10'
      }`}>
        <div className="flex justify-center mb-4">
          <Upload className={`h-12 w-12 transition-colors duration-300 ${
            dragActive && !disabled ? 'text-blue-400' : 'text-slate-400'
          }`} />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {dragActive && !disabled ? 'Drop your images here' : 'Upload Images'}
        </h3>
        <p className="text-slate-300 mb-6">
          Drag & drop your images or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-xs text-slate-400 mt-4">
          Supports JPG, PNG, WebP and more
        </p>
      </div>
    </div>
  );
};

export const ProcessingIndicator = () => (
  <div className="max-w-2xl mx-auto mb-8">
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
        <span className="text-white">Processing images...</span>
      </div>
    </div>
  </div>
);

export const ImageCard = ({ image, onDownload, onRemove }) => (
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
    <div className="grid md:grid-cols-3 gap-6 items-center">
      {/* Image Preview */}
      <div className="space-y-3">
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-32 object-cover rounded-xl border border-white/20"
        />
        <p className="text-white font-medium truncate">{image.name}</p>
      </div>

      {/* File Info */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-300">Original:</span>
          <span className="text-white font-medium">
            {ImageCompressorService.formatFileSize(image.originalSize)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Compressed:</span>
          <span className="text-green-400 font-medium">
            {ImageCompressorService.formatFileSize(image.compressedSize)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Saved:</span>
          <span className={`font-medium ${image.savings > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
            {image.savings > 0 ? '-' : '+'}{Math.abs(image.savings).toFixed(1)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-2 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
            style={{ width: `${Math.min(100 - image.savings, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onDownload(image)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          onClick={() => onRemove(image.id)}
          className="flex items-center justify-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-xl hover:bg-red-600/30 transition-colors border border-red-600/30"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  </div>
);

export const SummaryStats = ({ images }) => {
  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressedSize = images.reduce((sum, img) => sum + img.compressedSize, 0);
  const averageSavings = images.reduce((sum, img) => sum + img.savings, 0) / images.length;

  return (
    <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30">
      <h3 className="text-white font-semibold mb-4">Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-400">{images.length}</p>
          <p className="text-slate-300 text-sm">Images</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            {ImageCompressorService.formatFileSize(totalOriginalSize)}
          </p>
          <p className="text-slate-300 text-sm">Original Size</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">
            {ImageCompressorService.formatFileSize(totalCompressedSize)}
          </p>
          <p className="text-slate-300 text-sm">Compressed Size</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-400">
            {averageSavings.toFixed(1)}%
          </p>
          <p className="text-slate-300 text-sm">Avg. Savings</p>
        </div>
      </div>
    </div>
  );
};

export const EmptyState = () => (
  <div className="max-w-lg mx-auto text-center">
    <div className="text-slate-400 mb-4">
      <FileImage className="h-16 w-16 mx-auto opacity-50" />
    </div>
    <p className="text-slate-400 text-lg">
      No images uploaded yet. Start by dropping some images above!
    </p>
  </div>
);

export const ResultsSection = ({ images, onDownloadImage, onRemoveImage, onDownloadAll, onClearAll }) => (
  <div className="max-w-4xl mx-auto">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">
        Compressed Images ({images.length})
      </h2>
      <div className="flex gap-3">
        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download All
        </button>
        <button
          onClick={onClearAll}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>
    </div>

    <div className="grid gap-6">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onDownload={onDownloadImage}
          onRemove={onRemoveImage}
        />
      ))}
    </div>

    {images.length > 1 && <SummaryStats images={images} />}
  </div>
);