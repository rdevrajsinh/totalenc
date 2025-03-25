
import AdminLayout from "@/components/admin/admin-layout";

interface PlaceholderProps {
  title: string;
}

export default function AdminPlaceholder({ title }: PlaceholderProps) {
  return (
    <AdminLayout title={title}>
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This feature is currently under development. Check back soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
