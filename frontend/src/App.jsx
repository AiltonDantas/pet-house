import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'

import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'

import Dashboard from './pages/Dashboard'
import Tutores from './pages/tutores/Tutores'
import Animais from './pages/animais/Animais'
import Funcionarios from './pages/funcionarios/Funcionarios'
import Consultas from './pages/consultas/Consultas'
import Atendimentos from './pages/atendimentos/Atendimentos'
import Servicos from './pages/servicos/Servicos'
import Pagamentos from './pages/pagamentos/Pagamentos'
import Relatorios from './pages/relatorios/Relatorios'
import Perfil from './pages/perfil/Perfil'

/* ------------------ PROTEÇÃO DE ROTAS ------------------ */
function ProtectedRoute({ children, module }) {
  const { user, canAccess } = useApp()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (module && !canAccess(module)) {
    return <Navigate to="/consultas" replace />
  }

  return children
}

/* ------------------ ROTAS ------------------ */
function AppRoutes() {
  const { user, canAccess } = useApp()

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/app" replace />
            : <Login />
        }
      />

      {/* ÁREA LOGADA */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* REDIRECIONAMENTO INICIAL */}
        <Route
          index
          element={
            <Navigate
              to={canAccess('dashboard') ? '/dashboard' : '/consultas'}
              replace
            />
          }
        />

        {/* ROTAS PROTEGIDAS POR PERMISSÃO */}

        <Route
          path="dashboard"
          element={
            <ProtectedRoute module="dashboard">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="servicos"
          element={
            <ProtectedRoute module="servicos">
              <Servicos />
            </ProtectedRoute>
          }
        />

        <Route
          path="consultas"
          element={
            <ProtectedRoute module="consultas">
              <Consultas />
            </ProtectedRoute>
          }
        />

        <Route
          path="atendimentos"
          element={
            <ProtectedRoute module="atendimentos">
              <Atendimentos />
            </ProtectedRoute>
          }
        />

        <Route
          path="tutores"
          element={
            <ProtectedRoute module="tutores">
              <Tutores />
            </ProtectedRoute>
          }
        />

        <Route
          path="animais"
          element={
            <ProtectedRoute module="animais">
              <Animais />
            </ProtectedRoute>
          }
        />

        <Route
          path="funcionarios"
          element={
            <ProtectedRoute module="funcionarios">
              <Funcionarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="pagamentos"
          element={
            <ProtectedRoute module="pagamentos">
              <Pagamentos />
            </ProtectedRoute>
          }
        />

        <Route
          path="relatorios"
          element={
            <ProtectedRoute module="relatorios">
              <Relatorios />
            </ProtectedRoute>
          }
        />

        {/* PERFIL SEMPRE LIBERADO (mas ainda pode proteger dentro) */}
        <Route path="perfil" element={<Perfil />} />

        {/* FALLBACK INTERNO */}
        <Route
          path="*"
          element={<Navigate to="/consultas" replace />}
        />
      </Route>

      {/* FALLBACK GLOBAL */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  )
}

/* ------------------ APP ------------------ */
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}