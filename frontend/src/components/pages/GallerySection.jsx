import React, { useState } from 'react';
import { Dialog, DialogContent } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const GallerySection = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="h-full w-full object-cover transition-all hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl h-[90vh]">
          <ScrollArea className="h-full">
            <img
              src={selectedImage}
              alt="Selected gallery image"
              className="w-full h-auto"
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GallerySection;
