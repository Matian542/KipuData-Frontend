import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ProductosPage } from './features/productos/ProductosPage';
import { VentasPage } from './features/ventas/VentasPage';
import { ClientesPage } from './features/clientes/ClientesPage';
import { SugerenciasPage } from './features/sugerencias/SugerenciasPage';
import { AppLayout } from './shared/layout/AppLayout';
import { ProtectedRoute } from './shared/auth/protected-route';
import { RoleRoute } from './shared/auth/role-route';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/ventas" replace />} />
          <Route element={<RoleRoute rolesPermitidos={['dueno']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="/ventas" element={<VentasPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/sugerencias" element={<SugerenciasPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
