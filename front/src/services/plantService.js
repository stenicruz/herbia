import { Platform } from 'react-native';
import api from './api';

const plantService = {

  // Analisa a imagem e devolve o resultado da IA
  // Agora aceita 'location' opcionalmente: { latitude, longitude }
  analisarPlanta: async (imageUri, location = null) => {
    try {
      const formData = new FormData();

      const uri = Platform.OS === 'android' ? imageUri : imageUri.replace('file://', '');

      formData.append('file', {
        uri: uri,
        name: `analise_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      // Adiciona coordenadas se disponíveis
      if (location?.latitude && location?.longitude) {
        formData.append('latitude', String(location.latitude));
        formData.append('longitude', String(location.longitude));
      }

      const response = await api.post('/plantas/analisar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      });

      return response.data;
    } catch (error) {
      console.error("Erro detalhado no service:", error);
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
