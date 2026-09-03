import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem('adminLoggedIn') === 'true' &&
    Boolean(localStorage.getItem('authToken'));

  if (!isLoggedIn) {
    return <Navigate to="/login/admin" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;