import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageLightbox({ src, alt, className = "" }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <img 
          src={src} 
          alt={alt}
          className={`cursor-zoom-in hover:opacity-90 transition-opacity ${className}`}
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-2">
        <img 
          src={src} 
          alt={alt}
          className="w-full h-auto rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
