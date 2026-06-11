import { useEffect, useState } from 'react'
import { PawPrint, Calendar, CreditCard, TrendingUp, Clock, Users, Activity, ArrowUpRight } from 'lucide-react'
import { dashboardService } from '../services/mockData'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import StatusBadge from '../components/ui/StatusBadge'
import { useApp } from '../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (v) => (v ?? 0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' })

function StatCard({ icon: Icon, label, value, sub, color, bg, trend }) {
  return (
    <div className="card-hover animate-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            <ArrowUpRight size={12} />{trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 animate-count">{value}</p>
      <p className="text-sm font-medium text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function QuickStatus({ consultas }) {
  const counts = { AGENDADA:0, EM_ANDAMENTO:0, FINALIZADA:0, CANCELADA:0 }
  ;(consultas||[]).forEach(c => { if(counts[c.status]!==undefined) counts[c.status]++ })
  const items = [
    { label:'Agendadas',    val:counts.AGENDADA,     color:'bg-blue-500' },
    { label:'Em andamento', val:counts.EM_ANDAMENTO, color:'bg-amber-500' },
    { label:'Finalizadas',  val:counts.FINALIZADA,   color:'bg-green-500' },
    { label:'Canceladas',   val:counts.CANCELADA,    color:'bg-red-400' },
  ]
  const total = Object.values(counts).reduce((a,b)=>a+b,0) || 1
  return (
    <div className="card animate-up">
      <div className="flex items-center gap-2 mb-5">
        <Activity size={18} className="text-[#2e964e]" />
        <h3 className="font-bold text-gray-900">Status das Consultas</h3>
      </div>
      <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
        {items.map(i => (
          <div key={i.label} className={`${i.color} transition-all`}
            style={{ width:`${(i.val/total)*100}%`, minWidth: i.val>0?'4px':0 }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(i => (
          <div key={i.label} className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${i.color} flex-shrink-0`} />
            <div>
              <p className="text-xs text-gray-500">{i.label}</p>
              <p className="text-sm font-bold text-gray-800">{i.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const mockMonthData = [
  {mes:'Jan',valor:1200},{mes:'Fev',valor:1900},{mes:'Mar',valor:1600},
  {mes:'Abr',valor:2400},{mes:'Mai',valor:2100},{mes:'Jun',valor:2800},
]

export default function Dashboard() {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const { user } = useApp()

  useEffect(() => {
    dashboardService.getStats()
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => {
        setStats({
          totalAnimais:0, consultasHoje:0, pagamentosPendentes:0,
          faturamentoMensal:0, ultimasConsultas:[],
        })
        setLoading(false)
        setError(true)
      })
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  const last = Array.isArray(stats?.ultimasConsultas) ? stats.ultimasConsultas : []

  const hour = new Date().getHours()
  const greet = hour<12 ? 'Bom dia' : hour<18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">

      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-[#2e964e] via-[#3aab5a] to-[#2e964e] rounded-2xl p-6 text-white relative overflow-hidden animate-up">
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-16 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">{greet}! </p>
          <h2 className="text-2xl font-black">{user?.nome?.split(' ').slice(0,2).join(' ')}</h2>
          <p className="text-white/70 text-sm mt-1">
            Aqui está o resumo da clínica —{' '}
            {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={PawPrint}   label="Total de Animais"       value={stats.totalAnimais ?? 0}
          bg="bg-green-50"  color="text-[#2e964e]" trend="+2" />
        <StatCard icon={Calendar}   label="Consultas Hoje"         value={stats.consultasHoje ?? 0}
          bg="bg-blue-50"   color="text-blue-600" sub="agendadas" />
        <StatCard icon={CreditCard} label="Pagtos. Pendentes"      value={stats.pagamentosPendentes ?? 0}
          bg="bg-amber-50"  color="text-amber-600" />
        <StatCard icon={TrendingUp} label="Faturamento Mensal"     value={fmt(stats.faturamentoMensal)}
          bg="bg-purple-50" color="text-purple-600" trend="+12%" />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card animate-up lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#2e964e]" />
              <h3 className="font-bold text-gray-900">Faturamento Mensal</h3>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">2025</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockMonthData} margin={{top:0,right:0,left:-10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{fontSize:12, fill:'#9ca3af'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11, fill:'#9ca3af'}} axisLine={false} tickLine={false}
                tickFormatter={v=>`R$${v/1000}k`} />
              <Tooltip formatter={v=>fmt(v)} labelStyle={{fontWeight:600}} contentStyle={{borderRadius:12,border:'1px solid #f0f0f0',boxShadow:'0 4px 12px rgba(0,0,0,.08)'}} />
              <Bar dataKey="valor" fill="#2e964e" radius={[6,6,0,0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status donut */}
        <QuickStatus consultas={last} />
      </div>

      {/* Last consultations */}
      <div className="card animate-up">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-[#2e964e]" />
            <h3 className="font-bold text-gray-900">Últimas Consultas</h3>
          </div>
          <span className="text-xs text-[#2e964e] font-semibold bg-green-50 px-3 py-1 rounded-full">{last.length} registros</span>
        </div>

        {last.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar size={22} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Nenhuma consulta registrada ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header">Animal</th>
                  <th className="table-header hidden sm:table-cell">Veterinário</th>
                  <th className="table-header hidden md:table-cell">Data</th>
                  <th className="table-header hidden md:table-cell">Horário</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {last.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <PawPrint size={14} className="text-[#2e964e]" />
                        </div>
                        <span className="font-semibold text-gray-800">{c.animal?.nome || c.animalNome || '-'}</span>
                      </div>
                    </td>
                    <td className="table-cell hidden sm:table-cell text-gray-600">{c.veterinario?.nome || c.veterinarioNome || '-'}</td>
                    <td className="table-cell hidden md:table-cell text-gray-600">
                      {c.data ? new Date(c.data+'T00:00:00').toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="table-cell hidden md:table-cell text-gray-600">{c.horario || '-'}</td>
                    <td className="table-cell"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
