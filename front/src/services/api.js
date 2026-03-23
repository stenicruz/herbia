import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const api = axios.create({
  baseURL: 'http://192.168.0.104:3333/api',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de Requisição — envia o token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@Herbia:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Erro ao carregar token", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Referência à navegação — será injectada pelo AppNavigator
let navigationRef = null;
export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

// Interceptor de Resposta — trata sessão expirada globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // LOG TEMPORÁRIO — apaga depois de resolver
    console.log('❌ Erro interceptado:');
    console.log('Status:', error.response?.status);
    console.log('URL:', originalRequest?.url);
    console.log('isRotaSenha:', originalRequest?.url?.includes('/senha'));

    const isRotaSenha = originalRequest?.url?.includes('/senha');

    if (error.response?.status === 401 && !isRotaExcluida) {
      await AsyncStorage.multiRemove(['@Herbia:token', '@Herbia:user']);

      // Pequeno delay para garantir que o navigator está pronto
      setTimeout(() => {
        Alert.alert(
          "Sessão Expirada",
          "A sua sessão expirou. Por favor, faça login novamente.",
          [
            {
              text: "OK",
              onPress: () => {
                if (navigationRef) {
                  navigationRef.reset({
                    index: 0,
                    routes: [{ name: 'AccessMode' }],
                  });
                } else {
                  console.warn("navigationRef não está pronto");
                }
              }
            }
          ]
        );
      }, 100);

    }

    return Promise.reject(error);
  }
);
/*api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Rotas onde 401 significa "senha errada", não "sessão expirada"
    const isRotaSenha = originalRequest?.url?.includes('/senha');

    if (error.response?.status === 401 && !isRotaSenha) {
      // 1. Limpa os dados locais
      await AsyncStorage.multiRemove(['@Herbia:token', '@Herbia:user']);

      // 2. Avisa o utilizador e redireciona
      Alert.alert(
        "Sessão Expirada",
        "A sua sessão expirou. Por favor, faça login novamente.",
        [
          {
            text: "OK",
            onPress: () => {
              if (navigationRef) {
                navigationRef.reset({
                  index: 0,
                  routes: [{ name: 'AccessMode' }],
                });
              }
            }
          }
        ]
      );
    }

    return Promise.reject(error);
  }
);
*/
export default api;