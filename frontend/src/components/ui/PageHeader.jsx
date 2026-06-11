import { Plus, Search } from 'lucide-react'

export default function PageHeader({ title, subtitle, onAdd, addLabel='Novo', search, onSearch, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        {onSearch && (
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Buscar..."
              className="pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2e964e]/30 focus:border-[#2e964e] w-52 transition-all" />
          </div>
        )}
        {actions}
        {onAdd && (
          <button onClick={onAdd} className="btn-primary whitespace-nowrap">
            <Plus size={16} />{addLabel}
          </button>
        )}
      </div>
    </div>
  )
}
