import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: number;
  author: string;
  email: string;
  content: string;
  blogPostId: number;
  blogPostTitle: string;
  status: 'approved' | 'pending' | 'spam';
  createdAt: string | Date;
}

export default function AdminComments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for comments
  const mockComments: Comment[] = [
    {
      id: 1,
      author: "John Smith",
      email: "john.smith@example.com",
      content: "Great article! I found the information about custom enclosures particularly helpful for our upcoming project.",
      blogPostId: 1,
      blogPostTitle: "Industry Trends: The Future of Industrial Enclosures",
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
    },
    {
      id: 2,
      author: "Sarah Johnson",
      email: "sarah.j@example.com",
      content: "I have a question about the waterproof ratings. Do your NEMA 4X enclosures also meet IP66 standards?",
      blogPostId: 3,
      blogPostTitle: "Understanding NEMA Ratings for Electrical Enclosures",
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000 / 2).toISOString() // 12 hours ago
    },
    {
      id: 3,
      author: "Bob Williams",
      email: "bob.williams@example.com",
      content: "This post doesn't mention anything about costs. What's the typical price range for custom enclosures?",
      blogPostId: 1,
      blogPostTitle: "Industry Trends: The Future of Industrial Enclosures",
      status: 'approved',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
    },
    {
      id: 4,
      author: "Marketing Bot",
      email: "spam@example.com",
      content: "Check out our amazing deals on discount products! Click here to save big now! www.spam-link.com",
      blogPostId: 2,
      blogPostTitle: "5 Benefits of Custom Enclosure Solutions",
      status: 'spam',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
    }
  ];
  
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['/api/comments'],
    // Using the mock data until we have a real API
    initialData: mockComments,
  });
  
  // Approve comment mutation
  const approveComment = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/comments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve comment');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      toast({
        title: "Comment Approved",
        description: "The comment has been approved and published.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to approve comment: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  // Reject comment mutation
  const rejectComment = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/comments/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject comment');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      toast({
        title: "Comment Rejected",
        description: "The comment has been rejected and marked as spam.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reject comment: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete comment mutation
  const deleteComment = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments'] });
      toast({
        title: "Comment Deleted",
        description: "The comment has been permanently deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete comment: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  // Filter comments based on tab and search term
  const filteredComments = comments?.filter(comment => {
    const matchesTab = tab === "all" || comment.status === tab;
    const matchesSearch = searchTerm === "" || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pending</Badge>;
      case 'spam':
        return <Badge variant="destructive">Spam</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const handleApprove = (id: number) => {
    approveComment.mutate(id);
  };
  
  const handleReject = (id: number) => {
    rejectComment.mutate(id);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      deleteComment.mutate(id);
    }
  };

  return (
    <AdminLayout title="Comments">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Comment Management</h1>
          <div className="w-72">
            <Input 
              placeholder="Search comments..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All Comments</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="spam">Spam</TabsTrigger>
          </TabsList>
          
          <TabsContent value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === "all" ? "All Comments" : 
                   tab === "pending" ? "Pending Comments" : 
                   tab === "approved" ? "Approved Comments" : 
                   "Spam Comments"}
                </CardTitle>
                <CardDescription>
                  {tab === "all" ? "Manage all comments across your blog posts" : 
                   tab === "pending" ? "Comments awaiting review and approval" : 
                   tab === "approved" ? "Comments that have been approved and published" : 
                   "Comments marked as spam or rejected"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading comments...</div>
                ) : filteredComments && filteredComments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Author</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Post</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredComments.map((comment) => (
                        <TableRow key={comment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{comment.author}</div>
                              <div className="text-sm text-gray-500">{comment.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-md overflow-hidden text-ellipsis">
                              {comment.content.length > 100 
                                ? comment.content.substring(0, 100) + "..." 
                                : comment.content}
                            </div>
                          </TableCell>
                          <TableCell>{comment.blogPostTitle}</TableCell>
                          <TableCell>{formatDate(comment.createdAt)}</TableCell>
                          <TableCell>{getStatusBadge(comment.status)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            {comment.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleApprove(comment.id)}
                                  className="text-green-500 border-green-500 hover:bg-green-50"
                                >
                                  <i className="fas fa-check mr-1"></i> Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleReject(comment.id)}
                                  className="text-red-500 border-red-500 hover:bg-red-50"
                                >
                                  <i className="fas fa-ban mr-1"></i> Reject
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(comment.id)}
                              className="text-red-500"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-comments text-4xl mb-3 opacity-20"></i>
                    <p>No comments found.</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comment Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Comments</span>
                  <span className="font-bold">{comments?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Review</span>
                  <span className="font-bold">{comments?.filter(c => c.status === 'pending').length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Approved</span>
                  <span className="font-bold">{comments?.filter(c => c.status === 'approved').length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Spam</span>
                  <span className="font-bold">{comments?.filter(c => c.status === 'spam').length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comments?.slice(0, 3).map((comment) => (
                  <div key={comment.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{comment.content.substring(0, 80)}...</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">On: {comment.blogPostTitle}</span>
                      {getStatusBadge(comment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}