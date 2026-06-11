import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, Users, Mail, Phone, MapPin } from 'lucide-react'
import { tutoresService } from '../../services/mockData'
import { useCrud } from '../../hooks/useCrud'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

function TutorForm({ onSubmit, defaultValues, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors}, reset } = useForm({ defaultValues })
  useEffect(() => { reset(defaultValues || {}) }, [defaultValues])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Nome completo *</label>
          <input className="input-field" placeholder="Nome do tutor" {...register('nome',{required:'Obrigatório'})} />
          {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="label">CPF *</label>
          <input className="input-field" placeholder="000.000.000-00" {...register('cpf',{required:'Obrigatório'})} />
          {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
        </div>
        <div>
          <label className="label">Telefone *</label>
          <input className="input-field" placeholder="(00) 00000-0000" {...register('telefone',{required:'Obrigatório'})} />
          {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">E-mail *</label>
          <input type="email" className="input-field" placeholder="email@exemplo.com" {...register('email',{required:'Obrigatório'})} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">Endereço</label>
          <input className="input-field" placeholder="Rua, número, bairro, cidade" {...register('endereco')} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
          Salvar
        </button>
      </div>
    </form>
  )
}

export default function Tutores() {
  const { addToast, can } = useApp()
  const crud = useCrud(tutoresService)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (crud.editItem) { await tutoresService.update(crud.editItem.id, data); addToast('Tutor atualizado!') }
      else { await tutoresService.create(data); addToast('Tutor cadastrado!') }
      crud.closeModal(); crud.load()
    } catch(e) { addToast(e.message || 'Erro ao salvar', 'error') }
    setSaving(false)
  }

  return (
    <div>
      <PageHeader title="Tutores" subtitle={`${crud.filtered.length} tutores cadastrados`}
        onAdd={can('tutores','create') ? crud.openCreate : null} addLabel="Novo Tutor"
        search={crud.search} onSearch={v=>{crud.setSearch(v);crud.setCurrentPage(1)}} />

      <div className="card p-0 overflow-hidden">
        {crud.loading ? <LoadingSpinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Tutor</th>
                    <th className="table-header hidden sm:table-cell">CPF</th>
                    <th className="table-header hidden md:table-cell">Contato</th>
                    <th className="table-header hidden lg:table-cell">Endereço</th>
                    <th className="table-header w-20" />
                  </tr>
                </thead>
                <tbody>
                  {crud.paginated.map(t => (
                    <tr key={t.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#2e964e]/10 flex items-center justify-center text-[#2e964e] font-bold text-sm flex-shrink-0">
                            {t.nome?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{t.nome}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 sm:hidden"><Mail size={11}/>{t.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell text-gray-600">{t.cpf}</td>
                      <td className="table-cell hidden md:table-cell">
                        <p className="text-xs text-gray-600 flex items-center gap-1"><Phone size={11}/>{t.telefone}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Mail size={11}/>{t.email}</p>
                      </td>
                      <td className="table-cell hidden lg:table-cell text-gray-500 text-xs max-w-xs truncate">{t.endereco}</td>
                      <td className="table-cell">
                        <div className="flex gap-1 justify-end">
                          {can('tutores','edit') && <button onClick={()=>crud.openEdit(t)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14}/></button>}
                          {can('tutores','delete') && <button onClick={()=>crud.setDeleteItem(t)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {crud.paginated.length === 0 && <EmptyState icon={Users} title="Nenhum tutor encontrado" description="Cadastre o primeiro tutor clicando em Novo Tutor." />}
            </div>
            <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} totalItems={crud.filtered.length} pageSize={crud.pageSize} />
          </>
        )}
      </div>

      <Modal isOpen={crud.modalOpen} onClose={crud.closeModal} title={crud.editItem ? 'Editar Tutor' : 'Novo Tutor'}>
        <TutorForm onSubmit={handleSave} defaultValues={crud.editItem} loading={saving} onCancel={crud.closeModal} />
      </Modal>

      <ConfirmDialog isOpen={!!crud.deleteItem} onClose={()=>crud.setDeleteItem(null)}
        onConfirm={async()=>{await crud.handleDelete();addToast('Tutor excluído!')}}
        title={`Excluir ${crud.deleteItem?.nome}?`} />
    </div>
  )
}
