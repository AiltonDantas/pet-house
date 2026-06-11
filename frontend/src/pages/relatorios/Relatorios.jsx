import { useState, useEffect } from 'react'
import { BarChart3, PawPrint, Calendar, CreditCard, Package, TrendingUp } from 'lucide-react'
import { consultasService, animaisService, pagamentosService, servicosService } from '../../services/mockData'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#2e964e','#3db85e','#86efac','#bbf7d0','#dcfce7']

export default function Relatorios() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    Promise.all([consultasService.getAll(),animaisService.getAll(),pagamentosService.getAll(),servicosService.getAll()])
      .then(([consultas,animais,pagamentos])=>{
        const statusCount = (consultas||[]).reduce((a,c)=>{ a[c.status]=(a[c.status]||0)+1; return a },{})
        const especieCount = (animais||[]).reduce((a,x)=>{ a[x.especie]=(a[x.especie]||0)+1; return a },{})
        const meses=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
        const fat = meses.map((label,i)=>({
          label,
          valor:(pagamentos||[]).filter(p=>p.status==='PAGO'&&p.dataPagamento&&new Date(p.dataPagamento).getMonth()===i).reduce((a,p)=>a+(p.valorTotal||0),0)
        }))
        const totalPago = (pagamentos||[]).filter(p=>p.status==='PAGO').reduce((a,p)=>a+(p.valorTotal||0),0)
        setData({ consultas:consultas||[], animais:animais||[], pagamentos:pagamentos||[], statusCount, especieCount, fat, totalPago })
        setLoading(false)
      }).catch(()=>{ setData({consultas:[],animais:[],pagamentos:[],statusCount:{},especieCount:{},fat:[],totalPago:0}); setLoading(false) })
  },[])

  if(loading) return <LoadingSpinner fullPage/>

  const statusData = Object.entries(data.statusCount).map(([name,value])=>({name:name.replace('_',' '),value}))
  const especieData = Object.entries(data.especieCount).map(([name,value])=>({name,value}))

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {icon:PawPrint,  label:'Animais',    val:data.animais.length,    color:'text-green-600',  bg:'bg-green-50'},
          {icon:Calendar,  label:'Consultas',  val:data.consultas.length,  color:'text-blue-600',   bg:'bg-blue-50'},
          {icon:CreditCard,label:'Faturamento',val:data.totalPago.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}), color:'text-purple-600', bg:'bg-purple-50'},
          {icon:Package,   label:'Pagamentos', val:data.pagamentos.length, color:'text-amber-600',  bg:'bg-amber-50'},
        ].map(c=>(
          <div key={c.label} className="card-hover animate-up">
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon size={18} className={c.color}/>
            </div>
            <p className="text-2xl font-black text-gray-900">{c.val}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card animate-up">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[#2e964e]"/>
            <h3 className="font-bold text-gray-900">Faturamento por Mês (R$)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.fat} margin={{top:0,right:0,left:-15,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="label" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={v=>v?`R$${v/1000}k`:'R$0'}/>
              <Tooltip formatter={v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} contentStyle={{borderRadius:12,border:'1px solid #f0f0f0'}}/>
              <Bar dataKey="valor" fill="#2e964e" radius={[6,6,0,0]} maxBarSize={40}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card animate-up">
          <div className="flex items-center gap-2 mb-5">
            <Calendar size={18} className="text-[#2e964e]"/>
            <h3 className="font-bold text-gray-900">Consultas por Status</h3>
          </div>
          {statusData.length>0?(
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {statusData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          ):<div className="flex items-center justify-center h-48 text-gray-400 text-sm">Sem dados</div>}
        </div>

        <div className="card animate-up">
          <div className="flex items-center gap-2 mb-5">
            <PawPrint size={18} className="text-[#2e964e]"/>
            <h3 className="font-bold text-gray-900">Animais por Espécie</h3>
          </div>
          {especieData.length>0?(
            <div className="space-y-3">
              {especieData.map((e,i)=>{
                const max = Math.max(...especieData.map(x=>x.value),1)
                return (
                  <div key={e.name}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-gray-600 font-medium">{e.name}</span><span className="font-bold text-gray-900">{e.value}</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{width:`${(e.value/max)*100}%`,backgroundColor:COLORS[i%COLORS.length]}}/>
                    </div>
                  </div>
                )
              })}
            </div>
          ):<div className="text-center text-gray-400 text-sm py-8">Sem dados</div>}
        </div>

        <div className="card animate-up">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-[#2e964e]"/>
            <h3 className="font-bold text-gray-900">Consultas por Status</h3>
          </div>
          <div className="space-y-3">
            {[
              {label:'Agendadas',    val:data.statusCount.AGENDADA||0,     color:'bg-blue-500'},
              {label:'Em Andamento', val:data.statusCount.EM_ANDAMENTO||0, color:'bg-amber-500'},
              {label:'Finalizadas',  val:data.statusCount.FINALIZADA||0,   color:'bg-green-500'},
              {label:'Canceladas',   val:data.statusCount.CANCELADA||0,    color:'bg-red-400'},
            ].map(x=>{
              const total = Math.max(data.consultas.length,1)
              return (
                <div key={x.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${x.color} flex-shrink-0`}/>
                  <span className="text-sm text-gray-600 flex-1">{x.label}</span>
                  <span className="text-sm font-bold text-gray-900 w-6 text-right">{x.val}</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${x.color} transition-all duration-700`} style={{width:`${(x.val/total)*100}%`}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
