interface SeoSettingsProps {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
}

export default function SeoSettings({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange
}: SeoSettingsProps) {
  // Calculate character count and limits
  const titleLength = metaTitle?.length || 0;
  const descriptionLength = metaDescription?.length || 0;
  
  const titleLimit = 70;
  const descriptionLimit = 160;
  
  const getTitleStatus = () => {
    if (titleLength === 0) return "text-gray-500";
    if (titleLength < 30) return "text-yellow-500";
    if (titleLength <= titleLimit) return "text-green-500";
    return "text-red-500";
  };
  
  const getDescriptionStatus = () => {
    if (descriptionLength === 0) return "text-gray-500";
    if (descriptionLength < 120) return "text-yellow-500";
    if (descriptionLength <= descriptionLimit) return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="bg-gray-50 rounded-md p-4">
      <h4 className="font-bold text-gray-700 mb-3">SEO Settings</h4>
      
      <div className="mb-3">
        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="meta-title">
          Meta Title
        </label>
        <input 
          type="text" 
          id="meta-title" 
          value={metaTitle || ""}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f47920]"
          placeholder="Enter meta title (for search engines)"
        />
        <div className={`text-xs ${getTitleStatus()} mt-1`}>
          {titleLength} of {titleLimit} characters recommended
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="meta-description">
          Meta Description
        </label>
        <textarea 
          id="meta-description" 
          rows={3}
          value={metaDescription || ""}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f47920]"
          placeholder="Enter meta description (for search engines)"
        />
        <div className={`text-xs ${getDescriptionStatus()} mt-1`}>
          {descriptionLength} of {descriptionLimit} characters recommended
        </div>
      </div>
      
      {/* Preview of how it might appear in search results */}
      {(metaTitle || metaDescription) && (
        <div className="border border-gray-200 rounded p-3 mt-3 bg-white">
          <p className="text-sm font-medium text-blue-600 mb-1 truncate">
            {metaTitle || "Title will appear here"}
          </p>
          <p className="text-xs text-green-800 mb-1">www.totalenc.com</p>
          <p className="text-xs text-gray-600 line-clamp-2">
            {metaDescription || "Description will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}
