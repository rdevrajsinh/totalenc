import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  
  // Currently we don't have actual category handling, so we'll simulate it
  // In a real implementation, these would be API calls
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    // Using an empty array for now since we don't have the endpoint
    initialData: [],
  });

  const createCategory = useMutation({
    mutationFn: async (category: { name: string; description: string }) => {
      // This would be an actual API call in a real implementation
      return { id: Math.floor(Math.random() * 1000), name: category.name, slug: category.name.toLowerCase().replace(/\s+/g, '-'), description: category.description };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setNewCategory({ name: "", description: "" });
      toast({
        title: "Category Created",
        description: "The category has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error creating the category.",
        variant: "destructive",
      });
    }
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }
    
    createCategory.mutate(newCategory);
  };

  return (
    <AdminLayout title="Categories">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
              <CardDescription>Create a new blog category</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCategory}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Category name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (optional)</label>
                    <Input
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Category description"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button type="submit" className="mt-4 w-full" disabled={createCategory.isPending}>
                  {createCategory.isPending ? "Adding..." : "Add Category"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage your blog categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading categories...</div>
              ) : categories && categories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>{category.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Edit</span>
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                            <span className="sr-only">Delete</span>
                            <i className="fas fa-trash"></i>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No categories found. Create your first category.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}