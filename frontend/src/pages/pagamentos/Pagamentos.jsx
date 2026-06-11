import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CreditCard, Pencil, CheckCircle, XCircle, TrendingUp, Clock, DollarSign } from 'lucide-react'
import { pagamentosService, consultasService } from '../../services/mockData'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'

const FORMAS = ['PIX','DINHEIRO','CARTAO_CREDITO','CARTAO_DEBITO','BOLETO']

function PagForm({ onSubmit, defaultValues, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors}, reset } = useForm({defaultValues})
  const [consultas, setConsultas] = useState([])
  useEffect(()=>{
    consultasService.getAll().then(d=>setConsultas((Array.isArray(d)?d:[]).filter(c=>c.status!=='CANCELADA')))
    reset(defaultValues?{...defaultValues,consultaId:String(defaultValues.consultaId||defaultValues.consulta?.id||'')}:{status:'PENDENTE'})
  },[defaultValues])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label className="label">Consulta *</label>
        <select className="input-field" {...register('consultaId',{required:'Obrigatório'})}>
          <option value="">Selecione...</option>
          {consultas.map(c=><option key={c.id} value={c.id}>{c.animal?.nome||'Animal'} — {c.data?new Date(c.data+'T00:00:00').toLocaleDateString('pt-BR'):''}</option>)}
        </select>
        {errors.consultaId&&<p className="text-red-500 text-xs mt-1">{errors.consultaId.message}</p>}
      </div>
      <div><label className="label">Valor Total (R$) *</label>
        <input type="number" step="0.01" min="0" className="input-field" {...register('valorTotal',{required:'Obrigatório',valueAsNumber:true})}/>
        {errors.valorTotal&&<p className="text-red-500 text-xs mt-1">{errors.valorTotal.message}</p>}
      </div>
      <div><label className="label">Forma de Pagamento</label>
        <select className="input-field" {...register('formaPagamento')}>
          <option value="">Selecione...</option>
          {FORMAS.map(f=><option key={f}>{f}</option>)}
        </select>
      </div>
      <div><label className="label">Status</label>
        <select className="input-field" {...register('status')}>
          <option value="PENDENTE">Pendente</option><option value="PAGO">Pago</option>
        </select>
      </div>
      <div><label className="label">Data Pagamento</label>
        <input type="date" className="input-field" {...register('dataPagamento')}/>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading&&<div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}Salvar
        </button>
      </div>
    </form>
  )
}

export default function Pagamentos() {
  const { addToast, can } = useApp()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 8

  const load = ()=>{ setLoading(true); pagamentosService.getAll().then(d=>{ setList(Array.isArray(d)?d:[]); setLoading(false) }).catch(()=>{ setList([]); setLoading(false) }) }
  useEffect(load,[])

  const handleSave = async(data)=>{
    setSaving(true)
    try {
      const p = {...data,consultaId:parseInt(data.consultaId),consulta:{id:parseInt(data.consultaId)},valorTotal:parseFloat(data.valorTotal)}
      if(editItem){ await pagamentosService.update(editItem.id,p); addToast('Pagamento atualizado!') }
      else { await pagamentosService.create(p); addToast('Pagamento registrado!') }
      setModal(false); setEditItem(null); load()
    } catch(e){ addToast(e.message||'Erro','error') }
    setSaving(false)
  }

  const totalPago = list.filter(p=>p.status==='PAGO').reduce((a,p)=>a+(p.valorTotal||0),0)
  const totalPend = list.filter(p=>p.status==='PENDENTE').reduce((a,p)=>a+(p.valorTotal||0),0)

  const paginated = list.slice((page-1)*pageSize, page*pageSize)
  const totalPages = Math.max(1, Math.ceil(list.length/pageSize))

  return (
    <div>
      <PageHeader title="Pagamentos" subtitle={`${list.length} registros`}
        onAdd={can('pagamentos','create')?()=>{ setEditItem(null); setModal(true) }:null} addLabel="Novo Pagamento"/>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {icon:TrendingUp, label:'Total Recebido',   val:totalPago, color:'text-green-600',  bg:'bg-green-50',  border:'border-green-100'},
          {icon:Clock,      label:'A Receber',        val:totalPend, color:'text-amber-600',  bg:'bg-amber-50',  border:'border-amber-100'},
          {icon:DollarSign, label:'Total Registros',  val:list.length, color:'text-blue-600', bg:'bg-blue-50',   border:'border-blue-100', raw:true},
        ].map(c=>(
          <div key={c.label} className={`card border ${c.border}`}>
            <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <c.icon size={18} className={c.color}/>
            </div>
            <p className="text-xs text-gray-500 font-medium">{c.label}</p>
            <p className="text-xl font-black text-gray-900 mt-0.5">
              {c.raw ? c.val : c.val.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading?<LoadingSpinner/>:(
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Consulta</th>
                    <th className="table-header">Valor</th>
                    <th className="table-header hidden sm:table-cell">Forma</th>
                    <th className="table-header">Status</th>
                    <th className="table-header hidden md:table-cell">Data Pag.</th>
                    <th className="table-header w-24"/>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(p=>(
                    <tr key={p.id} className="table-row">
                      <td className="table-cell font-semibold text-gray-900">Consulta #{p.consulta?.id||p.consultaId}</td>
                      <td className="table-cell font-bold text-[#2e964e]">R$ {(p.valorTotal??0).toFixed(2)}</td>
                      <td className="table-cell hidden sm:table-cell text-gray-500 text-xs">{p.formaPagamento?.replace('_',' ')||'-'}</td>
                      <td className="table-cell"><StatusBadge status={p.status}/></td>
                      <td className="table-cell hidden md:table-cell text-gray-500 text-xs">{p.dataPagamento?new Date(p.dataPagamento+'T00:00:00').toLocaleDateString('pt-BR'):'-'}</td>
                      <td className="table-cell">
                        <div className="flex gap-1 justify-end">
                          {can('pagamentos','edit')&&<button onClick={()=>{setEditItem(p);setModal(true)}} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={13}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginated.length===0&&<EmptyState icon={CreditCard} title="Nenhum pagamento registrado"/>}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={list.length} pageSize={pageSize}/>
          </>
        )}
      </div>

      <Modal isOpen={modal} onClose={()=>{setModal(false);setEditItem(null)}} title={editItem?'Editar Pagamento':'Novo Pagamento'} size="sm">
        <PagForm onSubmit={handleSave} defaultValues={editItem} loading={saving} onCancel={()=>{setModal(false);setEditItem(null)}}/>
      </Modal>
    </div>
  )
}
