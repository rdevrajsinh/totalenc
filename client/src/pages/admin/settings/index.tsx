
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
          <h2 className="text-xl font-semibold mb-6">General Settings</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
              <textarea className="w-full border border-gray-300 rounded-md px-4 py-2" rows={3}></textarea>
            </div>
            
            <div>
              <button type="submit" className="bg-[#f47920] text-white px-6 py-2 rounded-md hover:bg-[#ff8f3e]">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}
