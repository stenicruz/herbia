import api from './api';

const plantService = {

  // Analisa a imagem e devolve o resultado da IA
  analisarPlanta: async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('imagem', {
        uri: imageUri,
        name: `analise_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      const response = await api.post('/plantas/analisar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s para dar tempo à IA
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao conectar com o servidor de análise' };
    }
  },

  // Lista o histórico do utilizador logado
  listarHistorico: async () => {
    try {
      const response = await api.get('/plantas/historico');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao carregar histórico' };
    }
  },

  // Apaga uma análise do histórico
  deletarAnalise: async (id) => {
    try {
      await api.delete(`/plantas/historico/${id}`);
      return { sucesso: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao eliminar análise' };
    }
  },

  // Guarda uma análise feita antes do login
  salvarAnalisePendente: async (resultado) => {
    try {
      const response = await api.post('/plantas/salvar-pendente', resultado);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao guardar análise' };
    }
  },
};

export default plantService;