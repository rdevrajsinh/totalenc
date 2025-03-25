
import { Helmet } from 'react-helmet';
import AdminLayout from "@/components/admin/admin-layout";

export default function AdminSettings() {
  return (
    <>
      <Helmet>
        <title>Settings | Admin | Total Enclosures</title>
      </Helmet>
      
      <AdminLayout title="Settings">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Site Settings</h2>
            <button className="bg-[#f47920] text-white px-4 py-2 rounded-md hover:bg-[#ff8f3e]">
              <i className="fas fa-save mr-2"></i>Save Changes
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="max-w-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-2" placeholder="Enter site title" />
            </div>
            
            <div className="max-w-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea className="w-full border border-gray-300 rounded-md px-4 py-2" rows={3} placeholder="Enter site description"></textarea>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
