import { Bell, Search, Menu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const PAGE_TITLES = {
  '/dashboard':    'Dashboard',
  '/servicos':     'Serviços',
  '/consultas':    'Consultas',
  '/atendimentos': 'Atendimentos',
  '/tutores':      'Tutores',
  '/animais':      'Animais',
  '/funcionarios': 'Funcionários',
  '/pagamentos':   'Pagamentos',
  '/relatorios':   'Relatórios',
  '/perfil':       'Meu Perfil',
}

export default function Navbar({ title }) {
  const { user, toggleSidebar } = useApp()
  const navigate = useNavigate()
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Botão menu mobile + logo compacta */}
        <button onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <Menu size={20} />
        </button>

        {/* Logo compacta visível no mobile quando sidebar fechada */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2e964e] rounded-lg flex items-center justify-center p-1.5">
            <img src={logo} alt="Pet House" className="w-full h-full object-contain" style={{ filter:'brightness(0) invert(1)' }} />
          </div>
          <span className="text-sm font-black text-[#2e964e]">PET HOUSE</span>
        </div>

        <div className="hidden md:block">
          <h1 className="text-base font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400">
            {greeting}, {user?.nome?.split(' ')[0]}! •{' '}
            {now.toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Buscar..." className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-[#2e964e]/30 focus:border-[#2e964e] transition-all" />
        </div>

        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-500" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#2e964e] rounded-full" />
        </button>

        <button onClick={() => navigate('/perfil')}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#2e964e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(user?.nome || 'U').charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-gray-800 leading-none">{user?.nome?.split(' ')[0]}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.cargo}</p>
          </div>
        </button>
      </div>
    </header>
  )
}
