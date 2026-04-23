import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute
 * Wraps any page that requires authentication.
 * If no viluxe_token is found in localStorage, redirects to /login
 * and remembers the page the user was trying to visit (via `state.from`).
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('viluxe_token');
  const location = useLocation();

  if (!token) {
    // Redirect to login, saving the attempted URL so we can send them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
