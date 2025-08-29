export class ImageCompressorService {
  static compressImage(file, quality) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          let { width, height } = img;
          const maxSize = 1920;
          
          if (width > maxSize || height > maxSize) {
            const ratio = Math.min(maxSize / width, maxSize / height);
            width *= ratio;
            height *= ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            file.type,
            quality / 100
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  static async processFiles(files, quality) {
    const processedImages = [];
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const id = Math.random().toString(36).substr(2, 9);
        const originalSize = file.size;
        const compressedFile = await this.compressImage(file, quality);
        const compressedSize = compressedFile.size;
        const savings = ((originalSize - compressedSize) / originalSize * 100);
        
        processedImages.push({
          id,
          name: file.name,
          originalFile: file,
          compressedFile,
          originalSize,
          compressedSize,
          savings: parseFloat(savings.toFixed(1)),
          preview: URL.createObjectURL(file)
        });
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      }
    }
    
    return processedImages;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static downloadFile(file, filename) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}