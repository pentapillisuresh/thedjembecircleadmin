import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlog, deleteBlog, updateBlog } from '../../api/admin';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlog(id);
        if (data) {
          setBlog(data);
        } else {
          setError('Blog not found');
        }
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${blog?.title}"?`)) {
      try {
        await deleteBlog(id);
        navigate('/blog');
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert('Failed to delete blog. Please try again.');
      }
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      const updated = await updateBlog(id, { status: newStatus });
      if (updated) {
        setBlog(updated);
      }
    } catch (error) {
      console.error('Failed to update blog status:', error);
      alert('Failed to update blog status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D3000D]"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error || 'Blog not found'}
        </div>
        <Link to="/blog" className="mt-4 inline-block text-[#D3000D] hover:underline">
          ← Back to Blog List
        </Link>
      </div>
    );
  }

  const statusBadge = blog.status === 'published' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/blog')}
          className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog List
        </button>
        <div className="flex gap-2">
          <Link
            to={`/blog/${id}/edit`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {blog.featuredImage && (
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={blog.featuredImage} 
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge}`}>
              {blog.status || 'draft'}
            </span>
            <button
              onClick={handleToggleStatus}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {blog.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>By: {blog.author || 'Admin'}</span>
            <span>•</span>
            <span>
              {blog.publishedAt 
                ? `Published: ${new Date(blog.publishedAt).toLocaleDateString()}` 
                : 'Not published yet'}
            </span>
            <span>•</span>
            <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          {blog.tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.split(',').map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {blog.excerpt && (
            <div className="mb-4 p-4 bg-gray-50 rounded-md border-l-4 border-[#D3000D]">
              <p className="text-gray-700 italic">{blog.excerpt}</p>
            </div>
          )}

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;