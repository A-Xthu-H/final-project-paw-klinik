import { Navigate } from 'react-router-dom';

function ProtectedPasienRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem('pasienLoggedIn') === 'true' &&
    Boolean(localStorage.getItem('authToken'));

  if (!isLoggedIn) {
    return <Navigate to="/login/pasien" replace />;
  }

  return children;
}

export default ProtectedPasienRoute;