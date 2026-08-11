import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getEvents, createGalleryItem, updateGalleryItem, uploadGalleryFile, uploadGalleryVideo } from '../../api/admin';

// Custom SVG Icons
const ImageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const GalleryForm = ({ onSuccess, onCancel, editData }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [events, setEvents] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    eventId: '',
    mediaType: 'image',
    mediaUrl: '',
    caption: '',
  });

  const isEdit = !!editData;

  useEffect(() => {
    fetchEvents();
    if (editData) {
      setFormData({
        eventId: editData.eventId || '',
        mediaType: editData.mediaType || 'image',
        mediaUrl: editData.mediaUrl || '',
        caption: editData.caption || '',
      });
    }
  }, [editData]);

  const fetchEvents = async () => {
    try {
      const response = await getEvents({ limit: 100 });
      if (response.data.success) {
        setEvents(response.data.data.events || []);
      }
    } catch (error) {
      console.error('Failed to load events');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    const maxSize = formData.mediaType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size exceeds ${formData.mediaType === 'video' ? '100MB' : '10MB'} limit`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let response;
      if (formData.mediaType === 'video') {
        response = await uploadGalleryVideo(file, (progress) => {
          setUploadProgress(progress);
        });
      } else {
        response = await uploadGalleryFile(file, (progress) => {
          setUploadProgress(progress);
        });
      }

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          mediaUrl: response.data.data.fileUrl
        }));
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.mediaUrl || !formData.mediaType) {
      toast.error('Media URL and type are required');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        // Convert empty eventId to null for backend
        eventId: formData.eventId || null,
      };

      if (isEdit) {
        await updateGalleryItem(editData.id, submitData);
        toast.success('Gallery item updated successfully');
      } else {
        await createGalleryItem(submitData);
        toast.success('Gallery item added successfully');
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save gallery item');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, mediaUrl: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D3000D]/10 rounded-lg">
            {formData.mediaType === 'image' ? <ImageIcon /> : <VideoIcon />}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800" style={{ fontFamily: "'Georgia', serif" }}>
              {isEdit ? 'Edit Gallery Item' : 'Add New Gallery Item'}
            </h3>
            <p className="text-xs text-gray-400">
              {isEdit ? 'Update your gallery item' : 'Add a new image or video to the gallery'}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Media Type *
            </label>
            <div className="relative">
              <select
                name="mediaType"
                value={formData.mediaType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none text-sm"
                required
              >
                <option value="image">📷 Image</option>
                <option value="video">🎬 Video</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              Event (Optional)
            </label>
            <div className="relative">
              <select
                name="eventId"
                value={formData.eventId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none text-sm"
              >
                <option value="">General (No Event)</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            {formData.mediaType === 'video' ? 'Upload Video' : 'Upload Image'}
          </label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#D3000D] hover:bg-[#D3000D]/5 transition-all duration-200 text-sm text-gray-600 hover:text-[#D3000D] disabled:opacity-50"
              >
                <UploadIcon />
                {uploading ? 'Uploading...' : 'Choose File'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept={formData.mediaType === 'video' ? 'video/*' : 'image/*'}
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              {formData.mediaUrl && (
                <span className="text-sm text-green-600">✓ File uploaded</span>
              )}
            </div>
            {uploading && (
              <div className="w-full">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#D3000D] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
            {formData.mediaUrl && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 truncate max-w-[300px]">
                  {formData.mediaUrl}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            {formData.mediaType === 'video' ? 'Maximum file size: 100MB' : 'Maximum file size: 10MB'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Caption
          </label>
          <input
            type="text"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-sm"
            placeholder="Brief description of the media"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2.5 bg-[#D3000D] text-white rounded-xl hover:bg-[#B0000A] transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEdit ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              isEdit ? 'Update Item' : 'Add Item'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;