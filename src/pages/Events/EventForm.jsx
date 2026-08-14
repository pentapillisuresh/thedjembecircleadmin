import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEvent, createEvent, updateEvent, uploadGalleryFile } from '../../api/admin';

// Custom SVG Icons
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    eventType: 'other',
    bannerImage: '',
    ticketClasses: [],
  });

  useEffect(() => {
    if (isEdit) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEvent(id);
      if (response.data.success) {
        const event = response.data.data;
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? event.date.split('T')[0] : '',
          venue: event.venue || '',
          eventType: event.eventType || 'other',
          bannerImage: event.bannerImage || '',
          ticketClasses: event.ticketClasses || [],
        });
      }
    } catch (error) {
      toast.error('Failed to load event');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...formData.ticketClasses];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ticketClasses: updated });
  };

  const addTicketClass = () => {
    setFormData({
      ...formData,
      ticketClasses: [
        ...formData.ticketClasses,
        { name: 'Economy', price: 0, discountPercentage: 0, totalTickets: 100 },
      ],
    });
  };

  const removeTicketClass = (index) => {
    const updated = formData.ticketClasses.filter((_, i) => i !== index);
    setFormData({ ...formData, ticketClasses: updated });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadGalleryFile(file, (progress) => {
        // You can show progress if needed
        console.log('Upload progress:', progress);
      });

      if (response.data.success) {
        const imageUrl = response.data.data.fileUrl;
        setFormData({ ...formData, bannerImage: imageUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.bannerImage) {
      toast.error('Please fill in all required fields including banner image');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        ticketClasses: formData.ticketClasses.map(cls => ({
          ...cls,
          price: parseFloat(cls.price) || 0,
          totalTickets: parseInt(cls.totalTickets) || 0,
          discountPercentage: parseFloat(cls.discountPercentage) || 0,
        })),
      };

      if (isEdit) {
        await updateEvent(id, payload);
        toast.success('Event updated successfully');
      } else {
        await createEvent(payload);
        toast.success('Event created successfully');
      }
      navigate('/events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-hidden p-4">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header - Compact */}
        <div className="flex justify-between items-center mb-3 flex-shrink-0">
          <div>
            <h1 className="text-xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
              {isEdit ? 'Edit Event' : 'Create Event'}
            </h1>
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#D3000D]"></span>
              <p className="text-xs text-gray-400 tracking-wider">
                {isEdit ? 'Update event' : 'New event'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/events')}
              className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={loading}
              className="px-4 py-1.5 bg-[#D3000D] text-white rounded-lg hover:bg-[#B0000A] transition-all shadow-sm hover:shadow-md disabled:opacity-50 text-xs font-medium"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isEdit ? 'Saving...' : 'Creating...'}
                </span>
              ) : (
                isEdit ? 'Update' : 'Create'
              )}
            </button>
          </div>
        </div>

        <form id="event-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-3 space-y-3">
              {/* Event Info - Compact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent bg-gray-50"
                      placeholder="Event title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent bg-gray-50"
                      placeholder="Venue name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Event Type
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent bg-gray-50"
                    >
                      <option value="drumCircle">Drum Circle</option>
                      <option value="workshop">Workshop</option>
                      <option value="festival">Festival</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D3000D] focus:border-transparent bg-gray-50 resize-none"
                    placeholder="Event description..."
                  />
                </div>
              </div>

              {/* Banner Image - Upload Button */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-xs font-medium text-gray-700 mb-2">Banner Image *</h3>
                {formData.bannerImage ? (
                  <div className="relative">
                    <img
                      src={formData.bannerImage}
                      alt="Banner"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x200?text=Invalid+Image';
                      }}
                    />
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors text-xs font-medium shadow-lg flex items-center gap-1.5">
                          {uploading ? (
                            <>
                              <div className="w-3 h-3 border-2 border-[#D3000D] border-t-transparent rounded-full animate-spin"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <UploadIcon />
                              Change
                            </>
                          )}
                        </div>
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, bannerImage: '' })}
                        className="px-3 py-1.5 bg-red-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium shadow-lg flex items-center gap-1.5"
                      >
                        <TrashIcon />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D3000D] transition-colors bg-gray-50 hover:bg-gray-100 ${
                      uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}>
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-[#D3000D] border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-sm text-gray-500">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-center mb-2">
                            <UploadIcon />
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Click to upload banner image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Right Column - Ticket Classes */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-2 flex-shrink-0">
                  <div>
                    <h3 className="text-xs font-medium text-gray-700">Ticket Classes</h3>
                    <p className="text-[10px] text-gray-400">Add ticket tiers</p>
                  </div>
                  <button
                    type="button"
                    onClick={addTicketClass}
                    className="flex items-center gap-1 px-3 py-1 bg-[#D3000D]/10 text-[#D3000D] rounded-lg hover:bg-[#D3000D]/20 transition-colors text-xs font-medium"
                  >
                    <PlusIcon />
                    Add
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {formData.ticketClasses.map((cls, index) => (
                    <div key={index} className="border border-gray-100 rounded-lg p-2 hover:border-[#D3000D]/20 transition-colors bg-gray-50/50">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-xs font-medium text-gray-600">Class {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeTicketClass(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <select
                            value={cls.name}
                            onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#D3000D] bg-white"
                          >
                            <option value="Economy">Economy</option>
                            <option value="Premium">Premium</option>
                            <option value="VIP">VIP</option>
                          </select>
                        </div>
                        <div>
                          <input
                            type="number"
                            value={cls.price}
                            onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#D3000D] bg-white"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={cls.discountPercentage}
                            onChange={(e) => handleTicketChange(index, 'discountPercentage', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#D3000D] bg-white"
                            placeholder="Disc %"
                            min="0"
                            max="100"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={cls.totalTickets}
                            onChange={(e) => handleTicketChange(index, 'totalTickets', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#D3000D] bg-white"
                            placeholder="Total"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.ticketClasses.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-400 text-xs">No ticket classes</p>
                      <p className="text-[10px] text-gray-300">Click "Add" to create</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D3000D;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #B0000A;
        }
      `}</style>
    </div>
  );
};

export default EventForm;