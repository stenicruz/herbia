import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Configuração Base
const api = axios.create({
  // USA O IP QUE APARECEU NO TEU TERMINAL (Importante: manter o /api no final)
  baseURL: 'http://192.168.0.104:3333/api',
  timeout: 45000, // 45 segundos (Damos tempo extra para a IA processar a imagem)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Interceptor de Requisição (Envia o Token automaticamente)
// Antes de cada pedido sair da App, este código verifica se temos um token guardado
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@Herbia:token');
      if (token) {
        // Adiciona o token no formato Bearer exigido pelo middleware 'auth'
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao carregar token do AsyncStorage", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor de Resposta (Tratamento de Erros Global)
// Se o servidor responder 401 (Token expirado), podemos deslogar o user automaticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Opcional: Limpar dados se o token for inválido
      await AsyncStorage.multiRemove(['@Herbia:token', '@Herbia:user']);
      console.warn("Sessão expirada ou não autorizada.");
    }
    return Promise.reject(error);
  }
);

export default api;