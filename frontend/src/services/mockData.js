import api from './api'

export const tutoresService = {
  getAll:   async ()      => (await api.get('/tutores')).data,
  getById:  async (id)    => (await api.get(`/tutores/${id}`)).data,
  create:   async (data)  => (await api.post('/tutores', data)).data,
  update:   async (id, d) => (await api.put(`/tutores/${id}`, d)).data,
  delete:   async (id)    => (await api.delete(`/tutores/${id}`)).data,
}

export const animaisService = {
  getAll:   async ()      => (await api.get('/animais')).data,
  getById:  async (id)    => (await api.get(`/animais/${id}`)).data,
  create:   async (data)  => (await api.post('/animais', data)).data,
  update:   async (id, d) => (await api.put(`/animais/${id}`, d)).data,
  delete:   async (id)    => (await api.delete(`/animais/${id}`)).data,
}

export const funcionariosService = {
  getAll:   async ()      => (await api.get('/usuarios')).data,
  getById:  async (id)    => (await api.get(`/usuarios/${id}`)).data,
  create:   async (data)  => (await api.post('/usuarios', data)).data,
  update:   async (id, d) => (await api.put(`/usuarios/${id}`, d)).data,
  delete:   async (id)    => (await api.delete(`/usuarios/${id}`)).data,
}

export const consultasService = {
  getAll:    async ()      => (await api.get('/consultas')).data,
  getById:   async (id)    => (await api.get(`/consultas/${id}`)).data,
  create:    async (data)  => (await api.post('/consultas', data)).data,
  update:    async (id, d) => (await api.put(`/consultas/${id}`, d)).data,
  delete:    async (id)    => (await api.delete(`/consultas/${id}`)).data,
  cancelar:  async (id)    => (await api.patch(`/consultas/${id}/cancelar`)).data,
  iniciar:   async (id)    => (await api.patch(`/consultas/${id}/iniciar`)).data,
  finalizar: async (id)    => (await api.patch(`/consultas/${id}/finalizar`)).data,
}

export const atendimentosService = {
  getAll:  async ()      => (await api.get('/atendimentos')).data,
  create:  async (data)  => (await api.post('/atendimentos', data)).data,
  update:  async (id, d) => (await api.put(`/atendimentos/${id}`, d)).data,
}

export const servicosService = {
  getAll:  async ()      => (await api.get('/servicos')).data,
  getById: async (id)    => (await api.get(`/servicos/${id}`)).data,
  create:  async (data)  => (await api.post('/servicos', data)).data,
  update:  async (id, d) => (await api.put(`/servicos/${id}`, d)).data,
  delete:  async (id)    => (await api.delete(`/servicos/${id}`)).data,
}

export const pagamentosService = {
  getAll:    async ()           => (await api.get('/pagamentos')).data,
  getById:   async (id)         => (await api.get(`/pagamentos/${id}`)).data,
  create:    async (data)       => (await api.post('/pagamentos', data)).data,
  update:    async (id, d)      => (await api.put(`/pagamentos/${id}`, d)).data,
  confirmar: async (id, forma)  => (await api.patch(`/pagamentos/${id}/confirmar`, { formaPagamento: forma })).data,
  cancelar:  async (id)         => (await api.patch(`/pagamentos/${id}/cancelar`)).data,
}

export const dashboardService = {
  getStats: async () => (await api.get('/relatorios/dashboard')).data,
}
