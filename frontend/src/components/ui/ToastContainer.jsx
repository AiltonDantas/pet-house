import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const configs = {
  success: { icon: CheckCircle2, bg: 'bg-white', border: 'border-l-4 border-green-500', text: 'text-gray-800', icon_color: 'text-green-500' },
  error:   { icon: XCircle,      bg: 'bg-white', border: 'border-l-4 border-red-500',   text: 'text-gray-800', icon_color: 'text-red-500' },
  warning: { icon: AlertTriangle,bg: 'bg-white', border: 'border-l-4 border-yellow-500',text: 'text-gray-800', icon_color: 'text-yellow-500' },
  info:    { icon: Info,         bg: 'bg-white', border: 'border-l-4 border-blue-500',  text: 'text-gray-800', icon_color: 'text-blue-500' },
}

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 min-w-72 max-w-sm">
      {toasts.map(toast => {
        const c = configs[toast.type] || configs.success
        const Icon = c.icon
        return (
          <div key={toast.id}
            className={`${c.bg} ${c.border} rounded-xl shadow-lg px-4 py-3.5 flex items-start gap-3 toast-enter`}>
            <Icon size={18} className={`${c.icon_color} mt-0.5 flex-shrink-0`} />
            <p className={`${c.text} text-sm font-medium flex-1 leading-snug`}>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-1 flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
