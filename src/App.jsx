import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventsList from './pages/Events/EventsList';
import EventForm from './pages/Events/EventForm';
import EventDetails from './pages/Events/EventDetails';
import UsersList from './pages/Users/UsersList';
import UserDetails from './pages/Users/UserDetails';
import OrdersList from './pages/Orders/OrdersList';
import OrderDetails from './pages/Orders/OrderDetails';
import GalleryList from './pages/Gallery/GalleryList';
import Profile from './pages/Profile';
import Coupons from './pages/Coupons';
import LeadsList from './pages/Leads/LeadsList';
// Add blog imports
import BlogList from './pages/Blog/BlogList';
import BlogForm from './pages/Blog/BlogForm';
import BlogDetails from './pages/Blog/BlogDetails';

const AppLayout = ({ children }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <div className="flex-1 ml-64 overflow-auto">
      <Header />
      <main className="bg-gray-50 min-h-[calc(100vh-73px)]">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/events" element={
          <ProtectedRoute>
            <AppLayout>
              <EventsList />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/events/new" element={
          <ProtectedRoute>
            <AppLayout>
              <EventForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/events/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <EventDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/events/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <EventForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/users" element={
          <ProtectedRoute>
            <AppLayout>
              <UsersList />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <UserDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <AppLayout>
              <OrdersList />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/orders/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <OrderDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/gallery" element={
          <ProtectedRoute>
            <AppLayout>
              <GalleryList />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/leads" element={
          <ProtectedRoute>
            <AppLayout>
              <LeadsList />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Blog Routes */}
        <Route path="/blog" element={
          <ProtectedRoute>
            <AppLayout>
              <BlogList />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/blog/new" element={
          <ProtectedRoute>
            <AppLayout>
              <BlogForm />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/blog/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <BlogDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        <Route path="/blog/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <BlogForm />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/coupons" element={
          <ProtectedRoute>
            <AppLayout>
              <Coupons />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;