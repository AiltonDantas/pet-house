import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

const PERMISSIONS = {
  Administrador: {
    dashboard:true,
    servicos:     {view:true,create:true,edit:true,delete:true},
    consultas:    {view:true,create:true,edit:true,delete:true},
    atendimentos: {view:true,create:true,edit:true,delete:true},
    tutores:      {view:true,create:true,edit:true,delete:true},
    animais:      {view:true,create:true,edit:true,delete:true},
    funcionarios: {view:true,create:true,edit:true,delete:true},
    pagamentos:   {view:true,create:true,edit:true,delete:true},
    relatorios:   {view:true},
    perfil:       {view:true,edit:true},
  },
  Recepcionista: {
    dashboard:true,
    servicos:     {view:true,create:false,edit:false,delete:false},
    consultas:    {view:true,create:true,edit:true,delete:false},
    atendimentos: {view:true,create:true,edit:true,delete:false},
    tutores:      {view:true,create:true,edit:true,delete:false},
    animais:      {view:true,create:true,edit:true,delete:false},
    funcionarios: {view:true,create:false,edit:false,delete:false},
    pagamentos:   {view:true,create:true,edit:true,delete:false},
    relatorios:   {view:true},
    perfil:       {view:true,edit:true},
  },
  Veterinario: {
    // Veterinário NÃO acessa: dashboard, funcionários, pagamentos, relatórios
    dashboard:    false,
    // Módulos acessíveis — pode visualizar e editar, NÃO pode excluir nem criar (exceto atendimento)
    atendimentos: { view:true,  create:true,  edit:true,  delete:false },
    consultas:    { view:true,  create:false, edit:true,  delete:false },
    tutores:      { view:true,  create:false, edit:true,  delete:false },
    animais:      { view:true,  create:false, edit:true,  delete:false },
    servicos:     { view:true,  create:false, edit:false, delete:false },
    // Bloqueados
    funcionarios: { view:false, create:false, edit:false, delete:false },
    pagamentos:   { view:false, create:false, edit:false, delete:false },
    relatorios:   { view:false },
    perfil:       { view:true,  edit:true },
  },
}

export function AppProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [toasts, setToasts]         = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3800)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addAlert = addToast

  const login  = useCallback((u) => setUser(u), [])
  const logout = useCallback(() => setUser(null), [])

  const can = useCallback((module, action = 'view') => {
    if (!user) return false
    const cargo = user.cargo || 'Recepcionista'
    const perms = PERMISSIONS[cargo]
    if (!perms) return false
    if (module === 'dashboard') return !!perms.dashboard
    const mod = perms[module]
    if (!mod) return false
    return !!mod[action]
  }, [user])

  const canAccess = useCallback((module) => can(module, 'view'), [can])
  const toggleSidebar = () => setSidebarOpen(v => !v)

  return (
    <AppContext.Provider value={{
      user, login, logout,
      toasts, alerts: toasts, addToast, addAlert, removeToast,
      can, canAccess,
      sidebarOpen, toggleSidebar,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
