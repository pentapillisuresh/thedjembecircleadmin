import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const BASEURL = "http://localhost:3001";

// Custom SVG Icons
const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TicketIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await getEvent(id);
      if (response.data.success) {
        setEvent(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-green-500/10 text-green-700 border-green-500/20',
      ongoing: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      completed: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-700 border-gray-500/20';
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <div className="p-6 text-center text-gray-500">Event not found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-gray-500 hover:text-[#D3000D] transition-colors text-sm"
          >
            <ArrowLeftIcon />
            Back to Events
          </button>
          <button
            onClick={() => navigate(`/events/${event.id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D3000D] text-white rounded-lg hover:bg-[#B0000A] transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <EditIcon />
            Edit Event
          </button>
        </div>

        {/* Banner Image */}
        {event.bannerImage && (
          <div className="rounded-2xl overflow-hidden mb-6 shadow-sm">
            <img
              src={`${BASEURL}${event.bannerImage}`}
              alt={event.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/logo.jpeg';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Title & Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
                    {event.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-gray-400">{event.eventType}</span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-2 bg-[#D3000D]/5 rounded-lg">
                    <CalendarIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date & Time</p>
                    <p className="font-medium">
                      {new Date(event.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="p-2 bg-[#D3000D]/5 rounded-lg">
                    <MapPinIcon />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Venue</p>
                    <p className="font-medium">{event.venue || 'No venue specified'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TicketIcon />
                    <span className="text-sm text-gray-600">Total Tickets</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {event.ticketClasses?.reduce((sum, tc) => sum + tc.totalTickets, 0) || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <UsersIcon />
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {event.ticketClasses?.reduce((sum, tc) => sum + tc.availableTickets, 0) || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TagIcon />
                    <span className="text-sm text-gray-600">Ticket Classes</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {event.ticketClasses?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Classes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Ticket Classes</h3>
              <div className="space-y-3">
                {event.ticketClasses?.map((cls) => (
                  <div key={cls.id} className="border border-gray-100 rounded-xl p-3 hover:border-[#D3000D]/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{cls.name}</p>
                        <p className="text-xs text-gray-400">Price: ₹{cls.price}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {cls.discountPercentage > 0 && `${cls.discountPercentage}% off`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Total: {cls.totalTickets}</span>
                        <span>Available: <span className="text-green-600">{cls.availableTickets}</span></span>
                      </div>
                      <span className="text-xs font-medium text-[#D3000D]">
                        ₹{cls.price * (1 - (cls.discountPercentage || 0) / 100)}
                      </span>
                    </div>
                  </div>
                ))}
                {(!event.ticketClasses || event.ticketClasses.length === 0) && (
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-sm">No ticket classes available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;