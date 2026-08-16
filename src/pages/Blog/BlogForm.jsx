import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getBlog,
  createBlog,
  updateBlog,
  uploadBlogImage
} from '../../api/admin';

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: 'Admin',
    tags: '',
    status: 'draft'
  });

  const isEdit = Boolean(id);

  // Fetch blog data if editing
  useEffect(() => {
    if (isEdit) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const data = await getBlog(id);
          if (data) {
            setFormData({
              title: data.title || '',
              excerpt: data.excerpt || '',
              content: data.content || '',
              featuredImage: data.featuredImage || '',
              author: data.author || 'Admin',
              tags: data.tags || '',
              status: data.status || 'draft'
            });
          }
        } catch (error) {
          console.error('Failed to fetch blog:', error);
          setError('Failed to load blog data');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEdit]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    setError('Only JPG, PNG, GIF and WEBP images are allowed');
    e.target.value = '';
    return;
  }

  // Validate size - 10 MB
  if (file.size > 10 * 1024 * 1024) {
    setError('Image size must be less than 10 MB');
    e.target.value = '';
    return;
  }

  try {
    setUploadingImage(true);
    setUploadProgress(0);
    setError(null);

    const response = await uploadBlogImage(
      file,
      (progress) => {
        setUploadProgress(progress);
      }
    );

    const uploadedUrl = response.data?.data?.fileUrl;

    if (!uploadedUrl) {
      throw new Error('Image URL was not returned by server');
    }

    setFormData(prev => ({
      ...prev,
      featuredImage: uploadedUrl
    }));

    setUploadProgress(100);

  } catch (error) {
    console.error('Failed to upload blog image:', error);

    setError(
      error.response?.data?.message ||
      'Failed to upload featured image'
    );
  } finally {
    setUploadingImage(false);
  }

  // Allow selecting the same file again
  e.target.value = '';
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const dataToSend = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean).join(',')
      };

      let result;
      if (isEdit) {
        result = await updateBlog(id, dataToSend);
      } else {
        result = await createBlog(dataToSend);
      }

      if (result) {
        navigate('/blog');
      } else {
        setError('Failed to save blog post');
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      setError(error.response?.data?.message || 'Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D3000D]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Update your blog post content' : 'Write a new blog post'}
          </p>
        </div>
        <button
          onClick={() => navigate('/blog')}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter blog post title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt (Short Description)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
            placeholder="Brief summary of the blog post"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="12"
            placeholder="Write your blog post content here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-400 mt-1">HTML tags are supported</p>
        </div>

        {/* Featured Image */}
       {/* Featured Image Upload */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Featured Image
  </label>

  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D3000D] transition-colors">

    <input
      type="file"
      id="featuredImage"
      accept="image/jpeg,image/png,image/gif,image/webp"
      onChange={handleImageUpload}
      disabled={uploadingImage}
      className="hidden"
    />

    <label
      htmlFor="featuredImage"
      className={`cursor-pointer ${
        uploadingImage ? 'cursor-not-allowed opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center">

        <svg
          className="w-10 h-10 text-gray-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-9h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <p className="text-sm font-medium text-gray-700">
          {uploadingImage
            ? 'Uploading image...'
            : 'Click to upload featured image'}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, GIF or WEBP • Maximum 10 MB
        </p>

      </div>
    </label>

    {/* Upload Progress */}
    {uploadingImage && (
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Uploading...</span>
          <span>{uploadProgress}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#D3000D] h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    )}

  </div>

  {/* Uploaded Image Preview */}
  {formData.featuredImage && !uploadingImage && (
    <div className="mt-4 relative">
      <p className="text-sm font-medium text-gray-700 mb-2">
        Uploaded Image
      </p>

      <div className="relative w-full max-w-md">
        <img
          src={formData.featuredImage}
          alt="Featured"
          className="w-full h-48 object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />

        <button
          type="button"
          onClick={() =>
            setFormData(prev => ({
              ...prev,
              featuredImage: ''
            }))
          }
          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
          title="Remove image"
        >
          ×
        </button>
      </div>
    </div>
  )}
</div>

        {/* Author */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="djembe, music, workshop"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#D3000D] text-white rounded-md hover:bg-[#B3000A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              isEdit ? 'Update Post' : 'Create Post'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;