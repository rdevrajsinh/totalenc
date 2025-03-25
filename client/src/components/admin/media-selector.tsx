import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageUpload from "./image-upload";
import { useToast } from "@/hooks/use-toast";

interface MediaSelectorProps {
  onImageSelect: (imageUrl: string) => void;
  triggerButton?: React.ReactNode;
}

interface MediaItem {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string | Date;
}

export default function MediaSelector({ onImageSelect, triggerButton }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  const { toast } = useToast();
  
  // Query for fetching media items
  const { data: mediaItems, isLoading, refetch } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
    // We don't have a proper API for media yet, so we'll use a static array
    // In a real app, this would fetch from an API endpoint
    initialData: [
      // Dummy data for display purposes
      {
        id: 1,
        name: "sample-image-1.jpg",
        url: "/uploads/images-1710000000000-123456789.jpg",
        type: "image/jpeg",
        size: 1024 * 1024 * 2.5, // 2.5MB
        uploadedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "sample-image-2.jpg",
        url: "/uploads/images-1710000000001-987654321.jpg",
        type: "image/jpeg",
        size: 1024 * 1024 * 1.8, // 1.8MB
        uploadedAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
      }
    ],
  });
  
  // Handle selection of an image
  const handleSelectImage = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setIsOpen(false);
    toast({
      title: "Image Selected",
      description: "The image has been inserted into your content.",
    });
  };
  
  // Filter media items based on search term
  const filteredMedia = mediaItems?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle image upload completion
  const handleUploadComplete = (urls: string[]) => {
    // Refresh the media list
    refetch();
    
    // Switch to browse tab to show the newly uploaded images
    setActiveTab("browse");
    
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${urls.length} image${urls.length !== 1 ? 's' : ''}.`,
    });
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline">
            <i className="fas fa-images mr-1"></i> Select Image
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "browse" | "upload")} className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="browse">Browse Media</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>
            
            {activeTab === "browse" && (
              <div className="flex items-center space-x-2">
                <Input 
                  placeholder="Search media..." 
                  className="w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex border rounded">
                  <button 
                    className={`px-2 py-1 ${view === "grid" ? "bg-gray-200" : ""}`}
                    onClick={() => setView("grid")}
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button 
                    className={`px-2 py-1 ${view === "list" ? "bg-gray-200" : ""}`}
                    onClick={() => setView("list")}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <TabsContent value="browse" className="flex-1 overflow-y-auto border rounded-md p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <i className="fas fa-spinner fa-spin text-2xl mr-2"></i> Loading media...
              </div>
            ) : filteredMedia && filteredMedia.length > 0 ? (
              <div className={view === "grid" 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" 
                : "space-y-2"
              }>
                {filteredMedia.map(item => (
                  view === "grid" ? (
                    <div 
                      key={item.id} 
                      className="border rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => handleSelectImage(item.url)}
                    >
                      <div className="h-32 bg-gray-100 relative">
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                      </div>
                    </div>
                  ) : (
                    <div 
                      key={item.id} 
                      className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectImage(item.url)}
                    >
                      <div className="h-12 w-12 mr-3 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(item.size)} • {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Select
                      </Button>
                    </div>
                  )
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <i className="fas fa-image text-5xl mb-4 opacity-30"></i>
                <p>No media files found.</p>
                {searchTerm ? (
                  <p className="text-sm">Try adjusting your search or upload new files.</p>
                ) : (
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setActiveTab("upload")}
                  >
                    <i className="fas fa-upload mr-1"></i> Upload New
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="flex-1">
            <div className="p-4 flex-1">
              <ImageUpload onUploadComplete={handleUploadComplete} maxFiles={5} />
              <p className="text-xs text-gray-500 mt-4 text-center">
                Supported formats: JPG, PNG, GIF, WebP • Max file size: 5MB
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}