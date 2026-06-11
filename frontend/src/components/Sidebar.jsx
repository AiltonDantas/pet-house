import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Calendar, ClipboardList,
  Users, PawPrint, UserCog, CreditCard, BarChart3,
  LogOut, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import logo from '../assets/logo.png'

// Menu padrão (Administrador e Recepcionista)
const NAV_DEFAULT = [
  { to:'/dashboard',    icon:LayoutDashboard, label:'Dashboard',    mod:'dashboard'    },
  { to:'/servicos',     icon:Package,         label:'Serviços',     mod:'servicos'     },
  { to:'/consultas',    icon:Calendar,        label:'Consultas',    mod:'consultas'    },
  { to:'/atendimentos', icon:ClipboardList,   label:'Atendimentos', mod:'atendimentos' },
  { to:'/tutores',      icon:Users,           label:'Tutores',      mod:'tutores'      },
  { to:'/animais',      icon:PawPrint,        label:'Animais',      mod:'animais'      },
  { to:'/funcionarios', icon:UserCog,         label:'Funcionários', mod:'funcionarios' },
  { to:'/pagamentos',   icon:CreditCard,      label:'Pagamentos',   mod:'pagamentos'   },
  { to:'/relatorios',   icon:BarChart3,       label:'Relatórios',   mod:'relatorios'   },
]

// Menu exclusivo do Veterinário — ordem obrigatória
const NAV_VETERINARIO = [
  { to:'/atendimentos', icon:ClipboardList, label:'Atendimentos', mod:'atendimentos' },
  { to:'/consultas',    icon:Calendar,      label:'Consultas',    mod:'consultas'    },
  { to:'/tutores',      icon:Users,         label:'Tutores',      mod:'tutores'      },
  { to:'/animais',      icon:PawPrint,      label:'Animais',      mod:'animais'      },
  { to:'/servicos',     icon:Package,       label:'Serviços',     mod:'servicos'     },
]

export default function Sidebar() {
  const { logout, user, canAccess, sidebarOpen, toggleSidebar } = useApp()
  const navigate = useNavigate()

  const isVet = user?.cargo === 'Veterinario'

  // Veterinário usa lista própria (já filtrada e ordenada)
  // Outros cargos filtram pelo sistema de permissões
  const visible = isVet
    ? NAV_VETERINARIO
    : NAV_DEFAULT.filter(n =>
        n.mod === 'dashboard' ? canAccess('dashboard') : canAccess(n.mod)
      )

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside
      style={{ width: sidebarOpen ? 260 : 72 }}
      className="sidebar-transition flex-shrink-0 min-h-screen flex flex-col bg-[#1a2e22] relative z-20"
    >
      {/* ── Logo ──────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-4 border-b border-white/8 overflow-hidden"
        style={{ minHeight: 72, paddingTop: 16, paddingBottom: 16 }}
      >
        {/* Ícone / logo */}
        <div className="flex-shrink-0 flex items-center justify-center"
          style={{ width: 36, height: 36 }}>
          <img
            src={logo}
            alt="Pet House"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              // Logo tem fundo transparente — filter para deixar branca na sidebar escura
              filter: 'brightness(0) invert(1)',
            }}
          />
        </div>

        {/* Nome — oculto quando recolhido */}
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-white font-black text-base leading-none tracking-wide">
              PET HOUSE
            </p>
            <p className="text-white/50 text-xs mt-0.5">Sistema Veterinário</p>
          </div>
        )}
      </div>

      {/* ── Botão toggle ──────────────────────────────────────── */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-30 text-gray-500 hover:text-gray-700"
      >
        {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {/* ── Badge de cargo para Veterinário ───────────────────── */}
      {isVet && sidebarOpen && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-[#2e964e]/20 border border-[#2e964e]/30">
          <p className="text-[#4ade80] text-xs font-semibold truncate">
            🩺 Área Veterinária
          </p>
        </div>
      )}

      {/* ── Navegação ─────────────────────────────────────────── */}
      <nav className="flex-1 py-4 px-2.5 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
        {visible.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all duration-150 group overflow-hidden
              ${isActive
                ? 'bg-[#2e964e] text-white shadow-sm'
                : 'text-white/60 hover:bg-white/8 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={`flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                  }`}
                />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Usuário / logout ──────────────────────────────────── */}
      <div className="p-2.5 border-t border-white/8">
        {sidebarOpen ? (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/8 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#2e964e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user?.nome || 'U').charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.nome}</p>
              <p className="text-white/50 text-xs truncate">{user?.cargo}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/40 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  )
}
