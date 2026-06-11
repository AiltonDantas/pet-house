import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Calendar, CheckCircle, XCircle, Play } from 'lucide-react'
import { consultasService, animaisService, tutoresService, funcionariosService } from '../../services/mockData'
import { useCrud } from '../../hooks/useCrud'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'

const STATUS_OPTS = ['AGENDADA','EM_ANDAMENTO','FINALIZADA','CANCELADA']

function ConsultaForm({ onSubmit, defaultValues, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors}, reset } = useForm({defaultValues})
  const [animais, setAnimais]   = useState([])
  const [tutores, setTutores]   = useState([])
  const [vets,    setVets]      = useState([])
  useEffect(()=>{
    Promise.all([animaisService.getAll(),tutoresService.getAll(),funcionariosService.getAll()])
      .then(([a,t,f])=>{ setAnimais(Array.isArray(a)?a:[]); setTutores(Array.isArray(t)?t:[]); setVets((Array.isArray(f)?f:[]).filter(x=>x.cargo==='Veterinario')) })
      .catch(()=>{})
    reset(defaultValues?{...defaultValues,animalId:String(defaultValues.animalId||defaultValues.animal?.id||''),tutorId:String(defaultValues.tutorId||defaultValues.tutor?.id||''),veterinarioId:String(defaultValues.veterinarioId||defaultValues.veterinario?.id||'')}:{status:'AGENDADA'})
  },[defaultValues])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="label">Animal *</label>
          <select className="input-field" {...register('animalId',{required:'Obrigatório'})}>
            <option value="">Selecione...</option>
            {animais.map(a=><option key={a.id} value={a.id}>{a.nome} ({a.especie})</option>)}
          </select>
          {errors.animalId&&<p className="text-red-500 text-xs mt-1">{errors.animalId.message}</p>}
        </div>
        <div><label className="label">Tutor *</label>
          <select className="input-field" {...register('tutorId',{required:'Obrigatório'})}>
            <option value="">Selecione...</option>
            {tutores.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          {errors.tutorId&&<p className="text-red-500 text-xs mt-1">{errors.tutorId.message}</p>}
        </div>
        <div><label className="label">Veterinário *</label>
          <select className="input-field" {...register('veterinarioId',{required:'Obrigatório'})}>
            <option value="">Selecione...</option>
            {vets.map(v=><option key={v.id} value={v.id}>{v.nome}</option>)}
          </select>
          {errors.veterinarioId&&<p className="text-red-500 text-xs mt-1">{errors.veterinarioId.message}</p>}
        </div>
        <div><label className="label">Status</label>
          <select className="input-field" {...register('status')}>
            {STATUS_OPTS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div><label className="label">Data *</label>
          <input type="date" className="input-field" {...register('data',{required:'Obrigatório'})}/>
          {errors.data&&<p className="text-red-500 text-xs mt-1">{errors.data.message}</p>}
        </div>
        <div><label className="label">Horário *</label>
          <input type="time" className="input-field" {...register('horario',{required:'Obrigatório'})}/>
          {errors.horario&&<p className="text-red-500 text-xs mt-1">{errors.horario.message}</p>}
        </div>
        <div className="sm:col-span-2"><label className="label">Observações</label>
          <textarea rows={2} className="input-field resize-none" {...register('observacoes')}/>
        </div>
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

export default function Consultas() {
  const { addToast, can } = useApp()
  const crud = useCrud(consultasService)
  const [saving, setSaving] = useState(false)

  const handleSave = async(data)=>{
    setSaving(true)
    try {
      const p = {...data,animalId:parseInt(data.animalId),tutorId:parseInt(data.tutorId),veterinarioId:parseInt(data.veterinarioId),
        animal:{id:parseInt(data.animalId)},tutor:{id:parseInt(data.tutorId)},veterinario:{id:parseInt(data.veterinarioId)}}
      if(crud.editItem){ await consultasService.update(crud.editItem.id,p); addToast('Consulta atualizada!') }
      else { await consultasService.create(p); addToast('Consulta agendada!') }
      crud.closeModal(); crud.load()
    } catch(e){ addToast(e.message||'Erro','error') }
    setSaving(false)
  }

  const doAction = async(action, id, msg) => {
    try { await consultasService[action](id); addToast(msg); crud.load() }
    catch(e){ addToast(e.message||'Erro','error') }
  }

  return (
    <div>
      <PageHeader title="Consultas" subtitle={`${crud.filtered.length} registros`}
        onAdd={can('consultas','create')?crud.openCreate:null} addLabel="Agendar Consulta"
        search={crud.search} onSearch={v=>{crud.setSearch(v);crud.setCurrentPage(1)}}/>

      <div className="card p-0 overflow-hidden">
        {crud.loading?<LoadingSpinner/>:(
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Animal</th>
                    <th className="table-header hidden sm:table-cell">Tutor</th>
                    <th className="table-header hidden md:table-cell">Veterinário</th>
                    <th className="table-header">Data / Hora</th>
                    <th className="table-header">Status</th>
                    <th className="table-header w-28"/>
                  </tr>
                </thead>
                <tbody>
                  {crud.paginated.map(c=>(
                    <tr key={c.id} className="table-row">
                      <td className="table-cell font-semibold text-gray-900">{c.animal?.nome||'-'}</td>
                      <td className="table-cell hidden sm:table-cell text-gray-600">{c.tutor?.nome||'-'}</td>
                      <td className="table-cell hidden md:table-cell text-gray-600">{c.veterinario?.nome||'-'}</td>
                      <td className="table-cell text-gray-600 text-xs">
                        <p className="font-medium">{c.data?new Date(c.data+'T00:00:00').toLocaleDateString('pt-BR'):'-'}</p>
                        <p className="text-gray-400">{c.horario||''}</p>
                      </td>
                      <td className="table-cell"><StatusBadge status={c.status}/></td>
                      <td className="table-cell">
                        <div className="flex gap-1 justify-end flex-wrap">
                          {c.status==='AGENDADA'&&<button onClick={()=>doAction('iniciar',c.id,'Atendimento iniciado!')} title="Iniciar" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"><Play size={13}/></button>}
                          {c.status==='EM_ANDAMENTO'&&<button onClick={()=>doAction('finalizar',c.id,'Consulta finalizada!')} title="Finalizar" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"><CheckCircle size={13}/></button>}
                          {(c.status==='AGENDADA'||c.status==='EM_ANDAMENTO')&&<button onClick={()=>doAction('cancelar',c.id,'Consulta cancelada.')} title="Cancelar" className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><XCircle size={13}/></button>}
                          {can('consultas','edit')&&<button onClick={()=>crud.openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={13}/></button>}
                          {can('consultas','delete')&&<button onClick={()=>crud.setDeleteItem(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={13}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {crud.paginated.length===0&&<EmptyState icon={Calendar} title="Nenhuma consulta encontrada"/>}
            </div>
            <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} totalItems={crud.filtered.length} pageSize={crud.pageSize}/>
          </>
        )}
      </div>

      <Modal isOpen={crud.modalOpen} onClose={crud.closeModal} title={crud.editItem?'Editar Consulta':'Agendar Consulta'} size="lg">
        <ConsultaForm onSubmit={handleSave} defaultValues={crud.editItem} loading={saving} onCancel={crud.closeModal}/>
      </Modal>
      <ConfirmDialog isOpen={!!crud.deleteItem} onClose={()=>crud.setDeleteItem(null)}
        onConfirm={async()=>{await crud.handleDelete();addToast('Consulta excluída!')}} title="Excluir consulta?"/>
    </div>
  )
}
