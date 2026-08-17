import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, status } = useSelector((state) => state.auth);

  // While authentication status is loading (e.g., on page refresh), show loading spinner
  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#aaa', fontSize: '1rem' }}>Loading...</p>
      </div>
    );
  }

  // If loading is finished and user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If role check is specified and fails, redirect to login unless they are an artist moderator
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (allowedRoles.includes("Artist") && user.is_artist_moderator) {
      // Allow active artist moderators to access artist dashboard
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}