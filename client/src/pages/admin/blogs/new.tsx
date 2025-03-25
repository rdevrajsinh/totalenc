import { Helmet } from 'react-helmet';
import AdminLayout from "@/components/admin/admin-layout";
import BlogForm from "@/components/admin/blog-form";

export default function AdminNewBlog() {
  return (
    <>
      <Helmet>
        <title>Create New Blog | Admin | Total Enclosures</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <AdminLayout title="Create New Blog Post">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <BlogForm />
        </div>
      </AdminLayout>
    </>
  );
}
