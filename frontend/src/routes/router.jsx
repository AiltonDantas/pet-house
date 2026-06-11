import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Tutores from '../pages/tutores/Tutores'
import Animais from '../pages/animais/Animais'
import Funcionarios from '../pages/funcionarios/Funcionarios'
import Consultas from '../pages/consultas/Consultas'
import Atendimentos from '../pages/atendimentos/Atendimentos'
import Servicos from '../pages/servicos/Servicos'
import Pagamentos from '../pages/pagamentos/Pagamentos'
import Relatorios from '../pages/relatorios/Relatorios'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function AppRouter() {
  return null // handled in App.jsx
}

export { ProtectedRoute }
