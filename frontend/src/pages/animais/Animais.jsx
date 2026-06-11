import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Pencil, Trash2, PawPrint } from 'lucide-react'
import { animaisService, tutoresService } from '../../services/mockData'
import { useCrud } from '../../hooks/useCrud'
import { useApp } from '../../context/AppContext'
import PageHeader from '../../components/ui/PageHeader'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Pagination from '../../components/ui/Pagination'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'

const ESPECIES = ['Cão','Gato','Ave','Coelho','Réptil','Peixe','Outro']
const ESPECIE_COLORS = { 'Cão':'bg-amber-50 text-amber-700','Gato':'bg-purple-50 text-purple-700','Ave':'bg-sky-50 text-sky-700','Coelho':'bg-pink-50 text-pink-700' }

function AnimalForm({ onSubmit, defaultValues, loading, onCancel }) {
  const { register, handleSubmit, formState:{errors}, reset } = useForm({defaultValues})
  const [tutores, setTutores] = useState([])
  useEffect(() => {
    reset(defaultValues ? {...defaultValues, tutorId: String(defaultValues.tutorId || defaultValues.tutor?.id || '')} : {})
    tutoresService.getAll().then(d => setTutores(Array.isArray(d)?d:[])).catch(()=>setTutores([]))
  }, [defaultValues])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Nome *</label>
          <input className="input-field" placeholder="Nome do animal" {...register('nome',{required:'Obrigatório'})} />
          {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
        </div>
        <div>
          <label className="label">Espécie *</label>
          <select className="input-field" {...register('especie',{required:'Obrigatório'})}>
            <option value="">Selecione...</option>
            {ESPECIES.map(e=><option key={e}>{e}</option>)}
          </select>
          {errors.especie && <p className="text-red-500 text-xs mt-1">{errors.especie.message}</p>}
        </div>
        <div><label className="label">Raça</label><input className="input-field" {...register('raca')} /></div>
        <div><label className="label">Idade (anos)</label><input type="number" min="0" className="input-field" {...register('idade',{valueAsNumber:true})} /></div>
        <div><label className="label">Peso (kg)</label><input type="number" step="0.1" min="0" className="input-field" {...register('peso',{valueAsNumber:true})} /></div>
        <div>
          <label className="label">Tutor *</label>
          <select className="input-field" {...register('tutorId',{required:'Obrigatório'})}>
            <option value="">Selecione um tutor...</option>
            {tutores.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
          {errors.tutorId && <p className="text-red-500 text-xs mt-1">{errors.tutorId.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="label">Histórico / Observações</label>
          <textarea rows={3} className="input-field resize-none" placeholder="Alergias, vacinas, observações..." {...register('historico')} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}Salvar
        </button>
      </div>
    </form>
  )
}

export default function Animais() {
  const { addToast, can } = useApp()
  const crud = useCrud(animaisService)
  const [saving, setSaving] = useState(false)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data, tutorId: parseInt(data.tutorId), tutor: { id: parseInt(data.tutorId) } }
      if (crud.editItem) { await animaisService.update(crud.editItem.id, payload); addToast('Animal atualizado!') }
      else { await animaisService.create(payload); addToast('Animal cadastrado!') }
      crud.closeModal(); crud.load()
    } catch(e) { addToast(e.message||'Erro ao salvar','error') }
    setSaving(false)
  }

  return (
    <div>
      <PageHeader title="Animais" subtitle={`${crud.filtered.length} animais cadastrados`}
        onAdd={can('animais','create')?crud.openCreate:null} addLabel="Novo Animal"
        search={crud.search} onSearch={v=>{crud.setSearch(v);crud.setCurrentPage(1)}} />

      <div className="card p-0 overflow-hidden">
        {crud.loading ? <LoadingSpinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Animal</th>
                    <th className="table-header hidden sm:table-cell">Espécie / Raça</th>
                    <th className="table-header hidden md:table-cell">Idade / Peso</th>
                    <th className="table-header hidden sm:table-cell">Tutor</th>
                    <th className="table-header w-20"/>
                  </tr>
                </thead>
                <tbody>
                  {crud.paginated.map(a => (
                    <tr key={a.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                            <PawPrint size={16} className="text-[#2e964e]"/>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{a.nome}</p>
                            <p className="text-xs text-gray-400 sm:hidden">{a.especie}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell hidden sm:table-cell">
                        <span className={`badge text-xs ${ESPECIE_COLORS[a.especie]||'bg-gray-50 text-gray-600'}`}>{a.especie}</span>
                        {a.raca && <span className="text-xs text-gray-500 ml-2">{a.raca}</span>}
                      </td>
                      <td className="table-cell hidden md:table-cell text-gray-600 text-sm">
                        <p>{a.idade!=null?`${a.idade} anos`:'-'}</p>
                        <p className="text-gray-400">{a.peso?`${a.peso} kg`:''}</p>
                      </td>
                      <td className="table-cell hidden sm:table-cell text-gray-600 text-sm">{a.tutor?.nome||'-'}</td>
                      <td className="table-cell">
                        <div className="flex gap-1 justify-end">
                          {can('animais','edit') && <button onClick={()=>crud.openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil size={14}/></button>}
                          {can('animais','delete') && <button onClick={()=>crud.setDeleteItem(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={14}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {crud.paginated.length===0 && <EmptyState icon={PawPrint} title="Nenhum animal encontrado" />}
            </div>
            <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} totalItems={crud.filtered.length} pageSize={crud.pageSize}/>
          </>
        )}
      </div>

      <Modal isOpen={crud.modalOpen} onClose={crud.closeModal} title={crud.editItem?'Editar Animal':'Novo Animal'} size="lg">
        <AnimalForm onSubmit={handleSave} defaultValues={crud.editItem} loading={saving} onCancel={crud.closeModal}/>
      </Modal>
      <ConfirmDialog isOpen={!!crud.deleteItem} onClose={()=>crud.setDeleteItem(null)}
        onConfirm={async()=>{await crud.handleDelete();addToast('Animal excluído!')}}
        title={`Excluir ${crud.deleteItem?.nome}?`}/>
    </div>
  )
}
