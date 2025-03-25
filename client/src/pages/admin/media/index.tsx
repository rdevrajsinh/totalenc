
import { Helmet } from 'react-helmet';
import AdminLayout from "@/components/admin/admin-layout";

export default function AdminMedia() {
  return (
    <>
      <Helmet>
        <title>Media Library | Admin | Total Enclosures</title>
      </Helmet>
      
      <AdminLayout title="Media Library">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Media Library</h2>
            <button className="bg-[#f47920] text-white px-4 py-2 rounded-md hover:bg-[#ff8f3e]">
              <i className="fas fa-upload mr-2"></i>Upload Media
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
              <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
              <p>Drag and drop files here</p>
              <p className="text-sm">or click to upload</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
