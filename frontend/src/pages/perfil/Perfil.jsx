import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera, Save, User, Mail, Phone, MapPin, IdCard, Calendar } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Perfil() {
  const { user, addToast } = useApp()
  const [avatar, setAvatar] = useState(null)
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState:{errors} } = useForm({
    defaultValues: {
      nome:       user?.nome        || '',
      email:      user?.email       || '',
      telefone:   user?.telefone    || '',
      cpf:        user?.cpf         || '',
      cargo:      user?.cargo       || '',
      nascimento: user?.nascimento  || '',
      endereco:   user?.endereco    || '',
    }
  })

  const onAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = r => setAvatar(r.target.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    addToast('Perfil atualizado com sucesso!')
    setSaving(false)
  }

  const initial = (user?.nome || 'U').charAt(0).toUpperCase()

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header card */}
      <div className="card bg-gradient-to-br from-[#2e964e] to-[#3db85e] text-white p-0 overflow-hidden">
        <div className="p-6 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white/30 shadow-lg bg-white/20 flex items-center justify-center">
              {avatar
                ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover"/>
                : <span className="text-3xl font-black text-white">{initial}</span>
              }
            </div>
            <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-shadow">
              <Camera size={13} className="text-[#2e964e]"/>
              <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange}/>
            </label>
          </div>
          <div>
            <h2 className="text-xl font-black">{user?.nome}</h2>
            <p className="text-white/70 text-sm mt-0.5">{user?.email}</p>
            <span className="inline-block mt-2 text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">{user?.cargo}</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
        <div>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User size={16} className="text-[#2e964e]"/> Informações Pessoais
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nome completo *</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input className="input-field pl-10" {...register('nome',{required:'Obrigatório'})}/>
              </div>
              {errors.nome&&<p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label className="label">CPF</label>
              <div className="relative">
                <IdCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input className="input-field pl-10 bg-gray-50 text-gray-500" readOnly {...register('cpf')}/>
              </div>
            </div>
            <div>
              <label className="label">Cargo</label>
              <div className="relative">
                <input className="input-field bg-gray-50 text-gray-500" readOnly {...register('cargo')}/>
              </div>
            </div>
            <div>
              <label className="label">Data de Nascimento</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="date" className="input-field pl-10" {...register('nascimento')}/>
              </div>
            </div>
            <div>
              <label className="label">Telefone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input className="input-field pl-10" placeholder="(00) 00000-0000" {...register('telefone')}/>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label">E-mail *</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input type="email" className="input-field pl-10" {...register('email',{required:'Obrigatório'})}/>
              </div>
              {errors.email&&<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Endereço</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input className="input-field pl-10" placeholder="Rua, número, bairro, cidade" {...register('endereco')}/>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving
              ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
              : <Save size={16}/>}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
