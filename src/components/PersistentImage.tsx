import React, { useState, useEffect } from 'react';
import { getVideo } from '../lib/videoStorage';

interface PersistentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  storageKey: string;
  fallbackUrl: string;
}

export const PersistentImage: React.FC<PersistentImageProps> = ({ storageKey, fallbackUrl, ...props }) => {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    let objectUrl = '';
    async function loadImage() {
      if (storageKey) {
        if (storageKey.startsWith('http') || storageKey.startsWith('data:')) {
          setSrc(storageKey);
          return;
        }
        
        try {
          const blob = await getVideo(storageKey);
          if (blob) {
            objectUrl = URL.createObjectURL(blob);
            setSrc(objectUrl);
            return;
          }
        } catch (err) {
          console.error('Error loading persistent image:', err);
        }
      }
      setSrc(fallbackUrl);
    }

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [storageKey, fallbackUrl]);

  return <img src={src || fallbackUrl} referrerPolicy="no-referrer" {...props} />;
};
