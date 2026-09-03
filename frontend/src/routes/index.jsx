import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import LoginAdmin from '../pages/LoginAdmin';
import LoginPasien from '../pages/LoginPasien';

import AdminDashboard from '../pages/AdminDashboard';
import DokterAdmin from '../pages/DokterAdmin';
import JadwalAdmin from '../pages/JadwalAdmin';
import AppointmentAdmin from '../pages/AppointmentAdmin';
import KnowledgeAdmin from '../pages/KnowledgeAdmin';

import PasienDashboard from '../pages/PasienDashboard';

import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import ProtectedPasienRoute from '../components/ProtectedPasienRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login/admin" element={<LoginAdmin />} />
      <Route path="/login/pasien" element={<LoginPasien />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/dokter"
        element={
          <ProtectedAdminRoute>
            <DokterAdmin />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/jadwal"
        element={
          <ProtectedAdminRoute>
            <JadwalAdmin />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/appointment"
        element={
          <ProtectedAdminRoute>
            <AppointmentAdmin />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/knowledge"
        element={
          <ProtectedAdminRoute>
            <KnowledgeAdmin />
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/pasien/dashboard"
        element={
          <ProtectedPasienRoute>
            <PasienDashboard />
          </ProtectedPasienRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;