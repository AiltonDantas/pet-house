const MAP = {
  AGENDADA:     ['bg-blue-50 text-blue-700 border border-blue-100',   'Agendada'],
  EM_ANDAMENTO: ['bg-amber-50 text-amber-700 border border-amber-100','Em Andamento'],
  FINALIZADA:   ['bg-green-50 text-green-700 border border-green-100','Finalizada'],
  CANCELADA:    ['bg-red-50 text-red-600 border border-red-100',      'Cancelada'],
  PAGO:         ['bg-green-50 text-green-700 border border-green-100','Pago'],
  PENDENTE:     ['bg-amber-50 text-amber-700 border border-amber-100','Pendente'],
  CANCELADO:    ['bg-red-50 text-red-600 border border-red-100',      'Cancelado'],
  Administrador:['bg-purple-50 text-purple-700 border border-purple-100','Administrador'],
  Veterinario:  ['bg-blue-50 text-blue-700 border border-blue-100',   'Veterinário'],
  Recepcionista:['bg-orange-50 text-orange-700 border border-orange-100','Recepcionista'],
}

export default function StatusBadge({ status }) {
  const [cls, label] = MAP[status] || ['bg-gray-50 text-gray-600 border border-gray-100', status]
  return <span className={`badge ${cls}`}>{label}</span>
}
