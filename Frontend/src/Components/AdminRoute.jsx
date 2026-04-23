import { Navigate } from 'react-router-dom';

/**
 * AdminRoute
 * Checks that the user is logged in AND is an admin.
 * Redirects to /login if not logged in, or / if logged in but not admin.
 */
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('viluxe_token');
  const user = JSON.parse(localStorage.getItem('viluxe_user') || 'null');

  if (!token) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
