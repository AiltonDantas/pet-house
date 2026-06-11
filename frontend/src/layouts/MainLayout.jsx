import { Outlet, useLocation, Navigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import ToastContainer from '../components/ui/ToastContainer'
import { useApp } from '../context/AppContext'

const TITLES = {
  '/dashboard':'/Dashboard','/servicos':'Serviços','/consultas':'Consultas',
  '/atendimentos':'Atendimentos','/tutores':'Tutores','/animais':'Animais',
  '/funcionarios':'Funcionários','/pagamentos':'Pagamentos','/relatorios':'Relatórios',
  '/perfil':'Meu Perfil',
}

export default function MainLayout() {
  const location = useLocation()
  const { user } = useApp()
  const title = TITLES[location.pathname] || 'PetHouse'

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6f9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}
