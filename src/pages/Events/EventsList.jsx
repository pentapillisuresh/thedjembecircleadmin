import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

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

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, [pagination.offset]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getEvents({
        limit: pagination.limit,
        offset: pagination.offset,
      });
      if (response.data.success) {
        setEvents(response.data.data.events || []);
        setPagination({
          ...pagination,
          total: response.data.data.total || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await deleteEvent(id);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-light text-gray-900" style={{ fontFamily: "'Georgia', serif" }}>
            Events
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-8 h-0.5 bg-[#D3000D]"></span>
            <p className="text-sm text-gray-400 tracking-wider">Manage all your events</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/events/new')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#D3000D] text-white rounded-xl hover:bg-[#B0000A] transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
        >
          <PlusIcon />
          Add Event
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Total Events</p>
          <p className="text-xl font-light text-gray-900 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {pagination.total}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Upcoming</p>
          <p className="text-xl font-light text-green-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {events.filter(e => e.status === 'upcoming').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
          <p className="text-xl font-light text-gray-600 mt-1" style={{ fontFamily: "'Georgia', serif" }}>
            {events.filter(e => e.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Venue
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="text-right py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr 
                  key={event.id} 
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200 group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {event.bannerImage ? (
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#D3000D]/5 flex items-center justify-center border border-gray-100">
                          <span className="text-lg font-light text-[#D3000D]">
                            {event.title?.charAt(0) || 'E'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800">{event.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                          {event.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-400">
                        {new Date(event.date).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPinIcon />
                      <span>{event.venue || 'No venue'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {event.ticketClasses?.reduce((sum, tc) => sum + tc.totalTickets, 0) || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="p-2 text-gray-400 hover:text-[#D3000D] hover:bg-[#D3000D]/5 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
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
        {events.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-gray-500 font-light">No events found</p>
            <p className="text-sm text-gray-400 mt-1">Create your first event to get started</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{pagination.offset + 1}</span> to{' '}
              <span className="font-medium text-gray-700">
                {Math.min(pagination.offset + pagination.limit, pagination.total)}
              </span>{' '}
              of <span className="font-medium text-gray-700">{pagination.total}</span> events
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, offset: Math.max(0, pagination.offset - pagination.limit) })}
                disabled={pagination.offset === 0}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#D3000D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={() => setPagination({ ...pagination, offset: pagination.offset + pagination.limit })}
                disabled={pagination.offset + pagination.limit >= pagination.total}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#D3000D]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;