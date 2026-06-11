import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ClipboardList, Plus } from 'lucide-react'
import { atendimentosService, consultasService, servicosService } from '../../services/mockData'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

function AtendForm({ onSubmit, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors} } = useForm()
  const [consultas, setConsultas] = useState([])
  const [servicos,  setServicos]  = useState([])
  const [selected,  setSelected]  = useState([])

  useEffect(()=>{
    consultasService.getAll().then(d=>setConsultas((Array.isArray(d)?d:[]).filter(c=>c.status!=='CANCELADA')))
    servicosService.getAll().then(d=>setServicos(Array.isArray(d)?d:[]))
  },[])

  const total = selected.reduce((acc,id)=>{ const s=servicos.find(x=>x.id===id); return acc+(s?.valor||0) },0)
  const toggleS = id => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])

  const submit = data => onSubmit({...data, consultaId:parseInt(data.consultaId), consulta:{id:parseInt(data.consultaId)},
    servicosIds:selected, servicos:selected.map(id=>({id})), valorTotal:total })

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className="label">Consulta *</label>
        <select className="input-field" {...register('consultaId',{required:'Obrigatório'})}>
          <option value="">Selecione...</option>
          {consultas.map(c=><option key={c.id} value={c.id}>{c.animal?.nome||'Animal'} — {c.data?new Date(c.data+'T00:00:00').toLocaleDateString('pt-BR'):''} {c.horario||''}</option>)}
        </select>
        {errors.consultaId&&<p className="text-red-500 text-xs mt-1">{errors.consultaId.message}</p>}
      </div>
      <div>
        <label className="label">Diagnóstico *</label>
        <textarea rows={3} className="input-field resize-none" placeholder="Diagnóstico veterinário..." {...register('diagnostico',{required:'Obrigatório'})}/>
        {errors.diagnostico&&<p className="text-red-500 text-xs mt-1">{errors.diagnostico.message}</p>}
      </div>
      <div>
        <label className="label">Procedimentos realizados</label>
        <textarea rows={2} className="input-field resize-none" {...register('procedimentos')}/>
      </div>
      <div>
        <label className="label">Observações</label>
        <textarea rows={2} className="input-field resize-none" {...register('observacoes')}/>
      </div>
      <div>
        <label className="label">Serviços Realizados</label>
        <div className="grid sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50">
          {servicos.map(s=>(
            <label key={s.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors ${selected.includes(s.id)?'bg-white border border-[#2e964e] shadow-sm':'hover:bg-white border border-transparent'}`}>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggleS(s.id)} className="accent-[#2e964e] w-4 h-4"/>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{s.nome}</p>
                <p className="text-xs text-[#2e964e] font-semibold">R$ {s.valor?.toFixed(2)}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between border border-green-100">
        <span className="font-semibold text-gray-700">Valor Total</span>
        <span className="text-xl font-black text-[#2e964e]">R$ {total.toFixed(2)}</span>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}Salvar Atendimento
        </button>
      </div>
    </form>
  )
}

export default function Atendimentos() {
  const { addToast, can } = useApp()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = ()=>{ setLoading(true); atendimentosService.getAll().then(d=>{ setList(Array.isArray(d)?d:[]); setLoading(false) }).catch(()=>{ setList([]); setLoading(false) }) }
  useEffect(load,[])

  const handleSave = async(data)=>{
    setSaving(true)
    try { await atendimentosService.create(data); addToast('Atendimento registrado!'); setModalOpen(false); load() }
    catch(e){ addToast(e.message||'Erro','error') }
    setSaving(false)
  }

  return (
    <div>
      <PageHeader title="Atendimentos" subtitle={`${list.length} registros`}
        onAdd={can('atendimentos','create')?()=>setModalOpen(true):null} addLabel="Registrar Atendimento"/>

      <div className="card p-0 overflow-hidden">
        {loading?<LoadingSpinner/>:(
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="table-header">Consulta</th>
                  <th className="table-header hidden sm:table-cell">Diagnóstico</th>
                  <th className="table-header hidden md:table-cell">Serviços</th>
                  <th className="table-header">Valor</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a=>(
                  <tr key={a.id} className="table-row">
                    <td className="table-cell">
                      <p className="font-semibold text-gray-900">Consulta #{a.consulta?.id||a.consultaId}</p>
                      <p className="text-xs text-gray-400">{a.consulta?.data?new Date(a.consulta.data+'T00:00:00').toLocaleDateString('pt-BR'):''}</p>
                    </td>
                    <td className="table-cell hidden sm:table-cell text-gray-600 text-xs max-w-xs">
                      <p className="line-clamp-2">{a.diagnostico}</p>
                    </td>
                    <td className="table-cell hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(a.servicos||[]).slice(0,3).map(s=>(
                          <span key={s?.id} className="badge bg-green-50 text-green-700">{s?.nome}</span>
                        ))}
                        {(a.servicos||[]).length>3&&<span className="badge bg-gray-100 text-gray-500">+{a.servicos.length-3}</span>}
                      </div>
                    </td>
                    <td className="table-cell font-bold text-[#2e964e]">R$ {(a.valorTotal??0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length===0&&<EmptyState icon={ClipboardList} title="Nenhum atendimento registrado"/>}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)} title="Registrar Atendimento" size="lg">
        <AtendForm onSubmit={handleSave} loading={saving} onCancel={()=>setModalOpen(false)}/>
      </Modal>
    </div>
  )
}
