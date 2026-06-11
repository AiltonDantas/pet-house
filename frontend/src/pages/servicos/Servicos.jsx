import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Package } from 'lucide-react'
import { servicosService } from '../../services/mockData'
import { useCrud } from '../../hooks/useCrud'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

function ServicoForm({ onSubmit, defaultValues, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors}, reset } = useForm({defaultValues})
  useEffect(()=>reset(defaultValues||{}),[defaultValues])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label className="label">Nome *</label>
        <input className="input-field" {...register('nome',{required:'Obrigatório'})}/>
        {errors.nome&&<p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>
      <div><label className="label">Descrição</label>
        <textarea rows={2} className="input-field resize-none" {...register('descricao')}/>
      </div>
      <div><label className="label">Valor (R$) *</label>
        <input type="number" step="0.01" min="0" className="input-field" {...register('valor',{required:'Obrigatório',valueAsNumber:true})}/>
        {errors.valor&&<p className="text-red-500 text-xs mt-1">{errors.valor.message}</p>}
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

export default function Servicos() {
  const { addToast, can } = useApp()
  const crud = useCrud(servicosService)
  const [saving, setSaving] = useState(false)

  const handleSave = async(data)=>{
    setSaving(true)
    try {
      if(crud.editItem){ await servicosService.update(crud.editItem.id,data); addToast('Serviço atualizado!') }
      else { await servicosService.create(data); addToast('Serviço cadastrado!') }
      crud.closeModal(); crud.load()
    } catch(e){ addToast(e.message||'Erro','error') }
    setSaving(false)
  }

  return (
    <div>
      <PageHeader title="Serviços" subtitle={`${crud.filtered.length} serviços`}
        onAdd={can('servicos','create')?crud.openCreate:null} addLabel="Novo Serviço"
        search={crud.search} onSearch={v=>{crud.setSearch(v);crud.setCurrentPage(1)}}/>

      <div className="card p-0 overflow-hidden">
        {crud.loading?<LoadingSpinner/>:(
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Serviço</th>
                    <th className="table-header hidden sm:table-cell">Descrição</th>
                    <th className="table-header">Valor</th>
                    <th className="table-header w-20"/>
                  </tr>
                </thead>
                <tbody>
                  {crud.paginated.map(s=>(
                    <tr key={s.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package size={15} className="text-[#2e964e]"/>
                          </div>
                          <p className="font-semibold text-gray-900">{s.nome}</p>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell text-gray-500 text-sm max-w-xs">{s.descricao}</td>
                      <td className="table-cell font-bold text-[#2e964e]">R$ {(s.valor??0).toFixed(2)}</td>
                      <td className="table-cell">
                        <div className="flex gap-1 justify-end">
                          {can('servicos','edit')&&<button onClick={()=>crud.openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14}/></button>}
                          {can('servicos','delete')&&<button onClick={()=>crud.setDeleteItem(s)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {crud.paginated.length===0&&<EmptyState icon={Package} title="Nenhum serviço encontrado"/>}
            </div>
            <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} totalItems={crud.filtered.length} pageSize={crud.pageSize}/>
          </>
        )}
      </div>

      <Modal isOpen={crud.modalOpen} onClose={crud.closeModal} title={crud.editItem?'Editar Serviço':'Novo Serviço'} size="sm">
        <ServicoForm onSubmit={handleSave} defaultValues={crud.editItem} loading={saving} onCancel={crud.closeModal}/>
      </Modal>
      <ConfirmDialog isOpen={!!crud.deleteItem} onClose={()=>crud.setDeleteItem(null)}
        onConfirm={async()=>{await crud.handleDelete();addToast('Serviço excluído!')}}
        title={`Excluir ${crud.deleteItem?.nome}?`}/>
    </div>
  )
}
