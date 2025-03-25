import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ onUploadComplete, maxFiles = 5 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    // Filter for only image files
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (imageFiles.length === 0) {
      toast({
        title: "Invalid Files",
        description: "Please select only image files (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    if (imageFiles.length > maxFiles) {
      toast({
        title: "Too Many Files",
        description: `You can upload a maximum of ${maxFiles} files at once.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload images');
      }
      
      const result = await response.json();
      onUploadComplete(result.urls);
      
      toast({
        title: "Upload Successful",
        description: `Successfully uploaded ${imageFiles.length} image${imageFiles.length !== 1 ? 's' : ''}.`,
      });
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 text-center ${
        isDragging ? 'border-[#f47920] bg-orange-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      <div className="mb-4">
        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400"></i>
      </div>
      
      <p className="text-sm text-gray-500 mb-2">
        {isDragging
          ? "Drop images here to upload"
          : "Drag and drop images here, or click to browse"
        }
      </p>
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? (
          <>
            <i className="fas fa-spinner fa-spin mr-1"></i> Uploading...
          </>
        ) : (
          "Upload Images"
        )}
      </button>
    </div>
  );
}
