import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, UserCog } from 'lucide-react'
import { funcionariosService } from '../../services/mockData'
import { useCrud } from '../../hooks/useCrud'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import StatusBadge from '../../components/ui/StatusBadge'
import EmptyState from '../../components/ui/EmptyState'

function FuncForm({ onSubmit, defaultValues, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors}, reset, watch } = useForm({defaultValues})
  useEffect(()=>{ reset(defaultValues||{}) }, [defaultValues])
  const cargo = watch('cargo')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><label className="label">Nome *</label>
          <input className="input-field" {...register('nome',{required:'Obrigatório'})}/>
          {errors.nome&&<p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
        </div>
        <div><label className="label">CPF *</label>
          <input className="input-field" placeholder="000.000.000-00" {...register('cpf',{required:'Obrigatório'})}/>
        </div>
        <div><label className="label">Cargo *</label>
          <select className="input-field" {...register('cargo',{required:'Obrigatório'})}>
            <option value="">Selecione...</option>
            <option>Administrador</option><option>Veterinario</option><option>Recepcionista</option>
          </select>
          {errors.cargo&&<p className="text-red-500 text-xs mt-1">{errors.cargo.message}</p>}
        </div>
        {cargo==='Veterinario'&&<>
          <div><label className="label">Especialidade</label><input className="input-field" {...register('especialidade')}/></div>
          <div><label className="label">CRMV</label><input className="input-field" {...register('crmv')}/></div>
        </>}
        {cargo==='Recepcionista'&&<div><label className="label">Turno</label>
          <select className="input-field" {...register('turno')}><option>MANHA</option><option>TARDE</option><option>NOITE</option></select>
        </div>}
        <div><label className="label">Telefone *</label><input className="input-field" {...register('telefone',{required:'Obrigatório'})}/></div>
        <div><label className="label">E-mail *</label><input type="email" className="input-field" {...register('email',{required:'Obrigatório'})}/></div>
        <div><label className="label">Senha {!defaultValues?'*':''}</label>
          <input type="password" className="input-field" placeholder={defaultValues?'Deixe em branco para manter':''} {...register('senha',{required:!defaultValues?'Obrigatório':false})}/>
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

export default function Funcionarios() {
  const { addToast, can } = useApp()
  const crud = useCrud(funcionariosService)
  const [saving, setSaving] = useState(false)

  const handleSave = async(data) => {
    setSaving(true)
    try {
      if(crud.editItem){ await funcionariosService.update(crud.editItem.id,data); addToast('Funcionário atualizado!') }
      else { await funcionariosService.create(data); addToast('Funcionário cadastrado!') }
      crud.closeModal(); crud.load()
    } catch(e){ addToast(e.message||'Erro ao salvar','error') }
    setSaving(false)
  }

  return (
    <div>
      <PageHeader title="Funcionários" subtitle={`${crud.filtered.length} funcionários`}
        onAdd={can('funcionarios','create')?crud.openCreate:null} addLabel="Novo Funcionário"
        search={crud.search} onSearch={v=>{crud.setSearch(v);crud.setCurrentPage(1)}}/>

      <div className="card p-0 overflow-hidden">
        {crud.loading?<LoadingSpinner/>:(
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Nome</th>
                    <th className="table-header hidden sm:table-cell">CPF</th>
                    <th className="table-header">Cargo</th>
                    <th className="table-header hidden md:table-cell">Especialidade</th>
                    <th className="table-header hidden lg:table-cell">Contato</th>
                    <th className="table-header w-20"/>
                  </tr>
                </thead>
                <tbody>
                  {crud.paginated.map(f=>(
                    <tr key={f.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#2e964e] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{f.nome?.charAt(0)}</div>
                          <p className="font-semibold text-gray-900">{f.nome}</p>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell text-gray-600">{f.cpf}</td>
                      <td className="table-cell"><StatusBadge status={f.cargo}/></td>
                      <td className="table-cell hidden md:table-cell text-gray-500 text-sm">{f.especialidade||'-'}</td>
                      <td className="table-cell hidden lg:table-cell text-xs text-gray-500"><p>{f.telefone}</p><p className="text-gray-400">{f.email}</p></td>
                      <td className="table-cell">
                        <div className="flex gap-1 justify-end">
                          {can('funcionarios','edit')&&<button onClick={()=>crud.openEdit(f)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14}/></button>}
                          {can('funcionarios','delete')&&<button onClick={()=>crud.setDeleteItem(f)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {crud.paginated.length===0&&<EmptyState icon={UserCog} title="Nenhum funcionário encontrado"/>}
            </div>
            <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} totalItems={crud.filtered.length} pageSize={crud.pageSize}/>
          </>
        )}
      </div>

      <Modal isOpen={crud.modalOpen} onClose={crud.closeModal} title={crud.editItem?'Editar Funcionário':'Novo Funcionário'} size="lg">
        <FuncForm onSubmit={handleSave} defaultValues={crud.editItem} loading={saving} onCancel={crud.closeModal}/>
      </Modal>
      <ConfirmDialog isOpen={!!crud.deleteItem} onClose={()=>crud.setDeleteItem(null)}
        onConfirm={async()=>{await crud.handleDelete();addToast('Funcionário excluído!')}}
        title={`Excluir ${crud.deleteItem?.nome}?`}/>
    </div>
  )
}
