import api from './api';

const adminService = {

  // Dashboard — estatísticas e análises recentes
  obterEstatisticas: async () => {
    try {
      const response = await api.get('/admin/home');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao carregar dashboard' };
    }
  },

  // Histórico global com filtros
  listarHistoricoGlobal: async (filtros = {}) => {
    try {
      const response = await api.get('/admin/historico', { params: filtros });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao carregar histórico' };
    }
  },

  eliminarAnalise: async (id) => {
    try {
      await api.delete(`/admin/historico/${id}`);
      return { sucesso: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao eliminar análise' };
    }
  },

  // Gestão de utilizadores
  listarUsuarios: async (filtros = {}) => {
    try {
      const response = await api.get('/admin/usuarios', { params: filtros });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao listar utilizadores' };
    }
  },

  criarAdmin: async (nome, email, senha) => {
    try {
      const response = await api.post('/admin/usuarios/admin', { nome, email, senha });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar administrador' };
    }
  },

  // Dicas
  criarDica: async (titulo, conteudo) => {
    try {
      const response = await api.post('/admin/dicas', { titulo, conteudo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar dica' };
    }
  },

  editarDica: async (id, titulo, conteudo) => {
    try {
      const response = await api.put(`/admin/dicas/${id}`, { titulo, conteudo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao editar dica' };
    }
  },

  eliminarDica: async (id) => {
    try {
      await api.delete(`/admin/dicas/${id}`);
      return { sucesso: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao eliminar dica' };
    }
  },

  // Culturas
  criarCultura: async (nome, imagemUri) => {
    try {
      const formData = new FormData();
      formData.append('nome', nome);
      if (imagemUri) {
        formData.append('imagem', {
          uri: imagemUri,
          name: `cultura_${Date.now()}.jpg`,
          type: 'image/jpeg',
        });
      }
      const response = await api.post('/admin/culturas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar cultura' };
    }
  },

  eliminarCultura: async (id) => {
    try {
      await api.delete(`/admin/culturas/${id}`);
      return { sucesso: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao eliminar cultura' };
    }
  },

  // Doenças
  criarDoenca: async (dados) => {
    try {
      const response = await api.post('/admin/doencas', dados);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao criar doença' };
    }
  },

  eliminarDoenca: async (id) => {
    try {
      await api.delete(`/admin/doencas/${id}`);
      return { sucesso: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao eliminar doença' };
    }
  },
};

export default adminService;