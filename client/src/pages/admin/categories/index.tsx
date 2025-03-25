
import { Helmet } from 'react-helmet';
import AdminLayout from "@/components/admin/admin-layout";

export default function AdminCategories() {
  return (
    <>
      <Helmet>
        <title>Categories | Admin | Total Enclosures</title>
      </Helmet>
      
      <AdminLayout title="Categories">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Manage Categories</h2>
            <button className="bg-[#f47920] text-white px-4 py-2 rounded-md hover:bg-[#ff8f3e]">
              <i className="fas fa-plus mr-2"></i>Add Category
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4" colSpan={4}>
                    <p className="text-center text-gray-500">No categories found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
