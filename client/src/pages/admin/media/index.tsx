import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MediaItem {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string | Date;
}

export default function AdminMedia() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<string>("all");
  
  // Mock data for the media library
  const { data: mediaItems, isLoading } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
    // Using static data for now since we don't have the endpoint yet
    initialData: [
      {
        id: 1,
        name: "sample-image-1.jpg",
        url: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
        type: "image/jpeg",
        size: 1024 * 1024 * 2.5, // 2.5MB
        uploadedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "sample-image-2.jpg",
        url: "https://images.unsplash.com/photo-1473308822086-710304d7d30c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        type: "image/jpeg",
        size: 1024 * 1024 * 1.8, // 1.8MB
        uploadedAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
      }
    ],
  });

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  // Filter media items by type
  const filteredMedia = filterType === "all" 
    ? mediaItems 
    : mediaItems?.filter(item => item.type.startsWith(filterType));

  return (
    <AdminLayout title="Media Library">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Media Library</h1>
          <Button>
            <i className="fas fa-upload mr-2"></i> Upload New
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Media Library</CardTitle>
            <CardDescription>Manage your uploaded media files</CardDescription>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-grow">
                <Input placeholder="Search media..." />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Media</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="application">Documents</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-md">
                  <button 
                    className={`px-3 py-2 ${view === "grid" ? "bg-gray-200" : ""}`}
                    onClick={() => setView("grid")}
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button 
                    className={`px-3 py-2 ${view === "list" ? "bg-gray-200" : ""}`}
                    onClick={() => setView("list")}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading media...</div>
            ) : filteredMedia && filteredMedia.length > 0 ? (
              view === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map(item => (
                    <div key={item.id} className="border rounded-md overflow-hidden group">
                      <div className="relative h-40 bg-gray-100">
                        {item.type.startsWith("image") ? (
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <i className={`fas ${
                              item.type.startsWith("video") ? "fa-video" : 
                              item.type.startsWith("audio") ? "fa-music" : 
                              "fa-file"
                            } text-5xl text-gray-400`}></i>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-black hover:bg-opacity-20">
                            <i className="fas fa-eye"></i>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-black hover:bg-opacity-20">
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-black hover:bg-opacity-20">
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {filteredMedia.map(item => (
                    <div key={item.id} className="flex items-center py-3 px-4 hover:bg-gray-50">
                      <div className="h-12 w-12 mr-4 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {item.type.startsWith("image") ? (
                          <img 
                            src={item.url} 
                            alt={item.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <i className={`fas ${
                            item.type.startsWith("video") ? "fa-video" : 
                            item.type.startsWith("audio") ? "fa-music" : 
                            "fa-file"
                          } text-xl text-gray-400`}></i>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(item.size)} • {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">View</span>
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Edit</span>
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                          <span className="sr-only">Delete</span>
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-image text-4xl mb-3"></i>
                <p>No media files found.</p>
                <p className="text-sm">Upload some files to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Settings</CardTitle>
              <CardDescription>Configure media upload options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Maximum Upload Size</label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue placeholder="Select max upload size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 MB</SelectItem>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="20">20 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Allowed File Types</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="allow-images" defaultChecked className="mr-2" />
                      <label htmlFor="allow-images">Images (jpg, jpeg, png, gif, webp)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="allow-documents" defaultChecked className="mr-2" />
                      <label htmlFor="allow-documents">Documents (pdf, doc, docx, xls, xlsx, ppt, pptx)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="allow-media" defaultChecked className="mr-2" />
                      <label htmlFor="allow-media">Media (mp4, mp3, avi, wav)</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>Media storage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Storage Used</label>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: "35%" }}></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>4.3 GB of 10 GB</span>
                    <span className="text-blue-600">Upgrade Storage</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-1">Images</h4>
                    <p className="text-2xl font-bold">3.1 GB</p>
                    <p className="text-xs text-gray-500">582 files</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-1">Documents</h4>
                    <p className="text-2xl font-bold">0.8 GB</p>
                    <p className="text-xs text-gray-500">124 files</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-1">Videos</h4>
                    <p className="text-2xl font-bold">0.3 GB</p>
                    <p className="text-xs text-gray-500">13 files</p>
                  </div>
                  <div className="p-4 border rounded-md">
                    <h4 className="text-sm font-medium mb-1">Other</h4>
                    <p className="text-2xl font-bold">0.1 GB</p>
                    <p className="text-xs text-gray-500">29 files</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}