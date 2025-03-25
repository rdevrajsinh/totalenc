import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import ImageUpload from "@/components/admin/image-upload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface MediaItem {
  id: number;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string | Date;
  status?: 'approved' | 'pending' | 'rejected';
}

export default function AdminMedia() {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [editedName, setEditedName] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: mediaItems, isLoading, refetch } = useQuery<MediaItem[]>({
    queryKey: ['/api/media'],
    queryFn: async () => {
      const response = await fetch('/api/media');
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      return response.json();
    },
    // Mock data only - will be replaced with actual API response
    initialData: [
      {
        id: 1,
        name: "product-image-1.jpg",
        url: "/uploads/images-1710000000000-123456789.jpg",
        type: "image/jpeg",
        size: 1024 * 1024 * 2.5,
        uploadedAt: new Date().toISOString(),
        status: 'approved'
      },
      {
        id: 2,
        name: "enclosure-diagram.png",
        url: "/uploads/images-1710000000001-987654321.jpg",
        type: "image/png",
        size: 1024 * 1024 * 1.2,
        uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        status: 'pending'
      },
      {
        id: 3,
        name: "metal-parts.jpg",
        url: "/uploads/images-1710000000002-564738291.jpg",
        type: "image/jpeg",
        size: 1024 * 1024 * 3.1,
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'rejected'
      }
    ]
  });
  
  // Delete media mutation
  const deleteMedia = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete media');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Media Deleted",
        description: "The media file has been permanently deleted.",
      });
      setShowDeleteDialog(false);
      setSelectedMedia(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete media: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  // Update media mutation
  const updateMedia = useMutation({
    mutationFn: async ({ id, name, status }: { id: number; name?: string; status?: string }) => {
      const response = await fetch(`/api/media/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update media');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Media Updated",
        description: "The media file has been successfully updated.",
      });
      setShowEditDialog(false);
      setSelectedMedia(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update media: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  // Handle image upload complete
  const handleUploadComplete = (urls: string[]) => {
    refetch();
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${urls.length} file${urls.length !== 1 ? 's' : ''}.`,
    });
  };
  
  // Handle media deletion
  const handleDelete = () => {
    if (selectedMedia) {
      deleteMedia.mutate(selectedMedia.id);
    }
  };
  
  // Handle media update
  const handleUpdate = () => {
    if (selectedMedia) {
      updateMedia.mutate({ 
        id: selectedMedia.id, 
        name: editedName || undefined
      });
    }
  };
  
  // Handle status change
  const handleChangeStatus = (id: number, status: 'approved' | 'pending' | 'rejected') => {
    updateMedia.mutate({ id, status });
  };
  
  // Open edit dialog
  const openEditDialog = (media: MediaItem) => {
    setSelectedMedia(media);
    setEditedName(media.name);
    setShowEditDialog(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowDeleteDialog(true);
  };
  
  // Get status badge
  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  // Filter media based on search term and active tab
  const filteredMedia = mediaItems?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesTab;
  });
  
  return (
    <AdminLayout title="Media Library">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Media Management</h1>
          <div className="flex items-center space-x-2">
            <Input 
              placeholder="Search media files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
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
        </div>
        
        <Tabs defaultValue="library">
          <TabsList>
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            <div className="mb-4">
              <TabsList>
                <TabsTrigger 
                  value="all"
                  onClick={() => setActiveTab("all")}
                  className={activeTab === "all" ? "bg-gray-200" : ""}
                >
                  All Media
                </TabsTrigger>
                <TabsTrigger 
                  value="pending"
                  onClick={() => setActiveTab("pending")}
                  className={activeTab === "pending" ? "bg-gray-200" : ""}
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger 
                  value="approved"
                  onClick={() => setActiveTab("approved")}
                  className={activeTab === "approved" ? "bg-gray-200" : ""}
                >
                  Approved
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  onClick={() => setActiveTab("rejected")}
                  className={activeTab === "rejected" ? "bg-gray-200" : ""}
                >
                  Rejected
                </TabsTrigger>
              </TabsList>
            </div>
            
            {isLoading ? (
              <div className="text-center py-10">
                <i className="fas fa-spinner fa-spin text-2xl mb-2"></i>
                <p>Loading media files...</p>
              </div>
            ) : (
              <div className="bg-white rounded-md border p-4">
                {filteredMedia && filteredMedia.length > 0 ? (
                  <div className={view === "grid" 
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" 
                    : "space-y-3"
                  }>
                    {filteredMedia.map(item => (
                      view === "grid" ? (
                        <div 
                          key={item.id} 
                          className="border rounded-md overflow-hidden hover:border-blue-500 cursor-pointer transition-colors relative group"
                          onClick={() => setSelectedMedia(item)}
                        >
                          <div className="h-32 bg-gray-100">
                            <img 
                              src={item.url} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <div className="flex items-center justify-between">
                              <p className="truncate text-sm font-medium">{item.name}</p>
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                          </div>
                          
                          {/* Overlay actions */}
                          <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button 
                              className="bg-white rounded p-1 text-blue-500 hover:text-blue-700 shadow"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(item);
                              }}
                            >
                              <i className="fas fa-pen"></i>
                            </button>
                            <button 
                              className="bg-white rounded p-1 text-red-500 hover:text-red-700 shadow"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(item);
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                          
                          {/* Status actions for pending items */}
                          {item.status === 'pending' && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                              <button 
                                className="bg-green-500 text-white px-2 py-1 rounded shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeStatus(item.id, 'approved');
                                }}
                              >
                                <i className="fas fa-check mr-1"></i> Approve
                              </button>
                              <button 
                                className="bg-red-500 text-white px-2 py-1 rounded shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeStatus(item.id, 'rejected');
                                }}
                              >
                                <i className="fas fa-ban mr-1"></i> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div 
                          key={item.id} 
                          className="flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedMedia(item)}
                        >
                          <div className="h-16 w-16 mr-3 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={item.url} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.name}</p>
                              {getStatusBadge(item.status)}
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatFileSize(item.size)} • {formatDate(item.uploadedAt)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {item.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-500 border-green-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeStatus(item.id, 'approved');
                                  }}
                                >
                                  <i className="fas fa-check mr-1"></i> Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 border-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleChangeStatus(item.id, 'rejected');
                                  }}
                                >
                                  <i className="fas fa-ban mr-1"></i> Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditDialog(item);
                              }}
                            >
                              <i className="fas fa-pen"></i>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteDialog(item);
                              }}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <i className="fas fa-images text-5xl mb-3 opacity-20"></i>
                    <p>No media files found.</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search criteria.</p>}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Media Files</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload onUploadComplete={handleUploadComplete} />
                <div className="mt-4 text-sm text-gray-500">
                  <p>Supported file types: JPG, JPEG, PNG, GIF, WebP</p>
                  <p>Maximum file size: 5MB</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Media Detail Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Media Details</h3>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <div className="bg-gray-100 rounded overflow-hidden h-48 md:h-64">
                      <img 
                        src={selectedMedia.url} 
                        alt={selectedMedia.name} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    
                    {/* Status badge */}
                    {selectedMedia.status && (
                      <div className="mt-2 text-center">
                        {getStatusBadge(selectedMedia.status)}
                      </div>
                    )}
                    
                    {/* Status actions for pending items */}
                    {selectedMedia.status === 'pending' && (
                      <div className="mt-3 flex justify-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-500 border-green-500"
                          onClick={() => handleChangeStatus(selectedMedia.id, 'approved')}
                        >
                          <i className="fas fa-check mr-1"></i> Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-500"
                          onClick={() => handleChangeStatus(selectedMedia.id, 'rejected')}
                        >
                          <i className="fas fa-ban mr-1"></i> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Filename</label>
                        <p>{selectedMedia.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <p>{selectedMedia.type}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Size</label>
                        <p>{formatFileSize(selectedMedia.size)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Uploaded</label>
                        <p>{formatDate(selectedMedia.uploadedAt)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">URL</label>
                        <div className="flex mt-1">
                          <Input value={selectedMedia.url} readOnly className="flex-1" />
                          <Button 
                            variant="outline" 
                            className="ml-2" 
                            onClick={() => {
                              navigator.clipboard.writeText(selectedMedia.url);
                              toast({
                                title: "URL Copied",
                                description: "Media URL has been copied to clipboard",
                              });
                            }}
                          >
                            <i className="fas fa-copy"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t flex justify-between">
                <Button variant="destructive" onClick={() => openDeleteDialog(selectedMedia)}>
                  <i className="fas fa-trash mr-1"></i> Delete
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setSelectedMedia(null)}>
                    Close
                  </Button>
                  <Button onClick={() => openEditDialog(selectedMedia)}>
                    <i className="fas fa-pen mr-1"></i> Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Media File</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">File Name</label>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Enter file name"
                />
              </div>
              
              {selectedMedia && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Preview</label>
                  <div className="bg-gray-100 rounded overflow-hidden h-32">
                    <img 
                      src={selectedMedia.url} 
                      alt={selectedMedia.name} 
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              {selectedMedia && selectedMedia.status && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant={selectedMedia.status === 'approved' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChangeStatus(selectedMedia.id, 'approved')}
                    >
                      <i className="fas fa-check mr-1"></i> Approved
                    </Button>
                    <Button 
                      type="button" 
                      variant={selectedMedia.status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChangeStatus(selectedMedia.id, 'pending')}
                    >
                      <i className="fas fa-clock mr-1"></i> Pending
                    </Button>
                    <Button 
                      type="button" 
                      variant={selectedMedia.status === 'rejected' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleChangeStatus(selectedMedia.id, 'rejected')}
                    >
                      <i className="fas fa-ban mr-1"></i> Rejected
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button type="button" onClick={handleUpdate} disabled={!editedName.trim()}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this media file? This action cannot be undone.</p>
              
              {selectedMedia && (
                <div className="mt-4 flex items-center">
                  <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden mr-3">
                    <img 
                      src={selectedMedia.url} 
                      alt={selectedMedia.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedMedia.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedMedia.size)}</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}