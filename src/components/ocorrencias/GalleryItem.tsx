
import React from 'react';
import { FileText, Image, Eye } from 'lucide-react';

interface GalleryItemProps {
  src: string;
  alt: string;
  type: 'image' | 'pdf';
  category?: string;
  onClick: () => void;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ 
  src, 
  alt, 
  type, 
  category,
  onClick 
}) => {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="aspect-square w-full rounded-lg border-2 border-gray-200 bg-gray-50 overflow-hidden hover:border-blue-300 transition-colors">
        {type === 'image' ? (
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      {/* Categoria */}
      {category && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {category}
        </div>
      )}
      
      {/* Tipo de arquivo */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1">
        {type === 'image' ? (
          <Image className="w-3 h-3 text-gray-600" />
        ) : (
          <FileText className="w-3 h-3 text-gray-600" />
        )}
      </div>
    </div>
  );
};

export default GalleryItem;
