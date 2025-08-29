import { useCallback } from 'react';
import { useImageStore } from '../state/store';
import { ImageCompressorService } from '../services/service';

export const useImageProcessor = () => {
  const store = useImageStore();
  
  const processFiles = useCallback(async (files) => {
    store.setProcessing(true);
    
    try {
      const newImages = await ImageCompressorService.processFiles(
        Array.from(files), 
        store.quality
      );
      
      newImages.forEach(img => store.addImage(img));
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      store.setProcessing(false);
    }
  }, [store]);

  const recompressImages = useCallback(async (newQuality) => {
    if (store.images.length === 0) return;
    
    store.setProcessing(true);
    store.setQuality(newQuality);
    
    try {
      const updatedImages = await Promise.all(
        store.images.map(async (img) => {
          const compressedFile = await ImageCompressorService.compressImage(
            img.originalFile, 
            newQuality
          );
          const compressedSize = compressedFile.size;
          const savings = ((img.originalSize - compressedSize) / img.originalSize * 100);
          
          return {
            ...img,
            compressedFile,
            compressedSize,
            savings: parseFloat(savings.toFixed(1))
          };
        })
      );
      
      store.updateImages(updatedImages);
    } catch (error) {
      console.error('Error recompressing images:', error);
    } finally {
      store.setProcessing(false);
    }
  }, [store]);

  const downloadImage = useCallback((image) => {
    ImageCompressorService.downloadFile(
      image.compressedFile,
      `compressed_${image.name}`
    );
  }, []);

  const downloadAll = useCallback(() => {
    store.images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  }, [store.images, downloadImage]);

  return {
    processFiles,
    recompressImages,
    downloadImage,
    downloadAll
  };
};
