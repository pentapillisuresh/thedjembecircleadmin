import { useState, useEffect } from 'react';
import { getGalleryItems, deleteGalleryItem, toggleGalleryItem } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import GalleryForm from './GalleryForm';
import { toast } from 'react-toastify';

const BASEURL = "https://service.thedjembecircle.com";
// Custom SVG Icons (no external imports)
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.563-3.64m4.21-2.057A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.563 3.64M3 3l18 18" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const GalleryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getGalleryItems();
      if (response.data.success) {
        // Handle the response structure from adminController
        const itemsData = response.data.data || [];
        setItems(itemsData);
      } else {
        toast.error(response.data.message || 'Failed to load gallery items');
      }
    } catch (error) {
      console.error('Fetch gallery error:', error);
      toast.error(error.response?.data?.message || 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteGalleryItem(id);
      toast.success('Gallery item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleGalleryItem(id);
      toast.success('Status toggled successfully');
      fetchItems();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    fetchItems();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Gallery
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-8 h-0.5 bg-[#D3000D]"></span>
            <p className="text-sm text-gray-400 tracking-wider">Manage your gallery items</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#D3000D] text-white rounded-xl hover:bg-[#B0000A] transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
        >
          <PlusIcon />
          Add Item
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Items</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {items.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Images</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {items.filter(i => i.mediaType === 'image').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Videos</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {items.filter(i => i.mediaType === 'video').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Active</p>
          <p className="text-xl font-light text-green-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {items.filter(i => i.isActive).length}
          </p>
        </div>
      </div>

      {/* Gallery Form */}
      {showForm && (
        <GalleryForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          editData={editingItem}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Media
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Caption
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {item.mediaType === 'image' ? (
                        <img
                        src={`${BASEURL}${item.mediaUrl}`}
                          alt={item.caption || 'Gallery item'}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/logo.jpeg';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-100">
                          <VideoIcon />
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        {item.mediaType === 'image' ? (
                          <ImageIcon />
                        ) : (
                          <VideoIcon />
                        )}
                        <span className="text-xs text-gray-400 capitalize">{item.mediaType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700 line-clamp-1 max-w-[200px]">
                      {item.caption || 'No caption'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.galleryType === 'event'
                        ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                        : 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                      }`}>
                      {item.galleryType === 'event' ? 'Event' : 'General'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {item.event ? (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <TagIcon />
                        <span className="line-clamp-1 max-w-[120px]">{item.event.title}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${item.isActive
                        ? 'bg-green-500/10 text-green-700 border-green-500/20'
                        : 'bg-gray-500/10 text-gray-700 border-gray-500/20'
                      }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(item.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${item.isActive
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                          }`}
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive ? <EyeIcon /> : <EyeOffIcon />}
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ImageIcon />
            </div>
            <p className="text-gray-500 font-light">No gallery items found</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Item" to upload your first image or video</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryList;