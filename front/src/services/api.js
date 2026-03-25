import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Definimos a base para facilitar a manutenção
// const BASE_SERVER = 'http://192.168.0.104:3333';
const BASE_SERVER = 'https://fallible-rotatably-taren.ngrok-free.dev';

const api = axios.create({
  baseURL: `${BASE_SERVER}/api`,
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

// Referência à navegação
let navigationRef = null;
export const setNavigationRef = (ref) => {
  navigationRef = ref;
};

// --- INTERCEPTOR DE RESPOSTA (TRATAMENTO DE DADOS) ---
api.interceptors.response.use(
  (response) => {
    // Função genérica para corrigir caminhos de imagem
    const fixUrls = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    // Lista de chaves que o seu backend usa
    const imageKeys = ['imagem_url', 'foto_url', 'foto', 'avatar', 'foto_perfil'];

    imageKeys.forEach(key => {
      if (obj[key] && typeof obj[key] === 'string'  && obj[key] !== '') {
        if (!obj[key].startsWith('http')) {
          const cleanPath = obj[key].startsWith('/') ? obj[key] : `/${obj[key]}`;
          obj[key] = `${BASE_SERVER}${cleanPath}`;
        }
    }
  });

  // Percorre objetos aninhados se houver
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') fixUrls(obj[key]);
  });

  return obj;
};

    // Aplica a correção se for array ou objeto
    if (Array.isArray(response.data)) {
      response.data = response.data.map(item => fixUrls(item));
    } else {
      response.data = fixUrls(response.data);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.warn("Erro de rede:", error.message);
      return Promise.reject(error);
    }

    const isRotaExcluida =
      originalRequest?.url?.includes('/senha') ||
      originalRequest?.url?.includes('/auth/verificar-senha') ||
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/registrar') ||
      originalRequest?.url?.includes('/auth/login-google');

    // Sessão expirada
    if (error.response?.status === 401 && !isRotaExcluida) {
      await AsyncStorage.multiRemove(['@Herbia:token', '@Herbia:user']);

      setTimeout(() => {
        Alert.alert(
          "Sessão Expirada",
          "A sua sessão expirou. Por favor, faça login novamente.",
          [{
            text: "OK",
            onPress: () => {
              if (navigationRef) {
                navigationRef.reset({
                  index: 0,
                  routes: [{ name: 'AccessMode' }],
                });
              }
            }
          }]
        );
      }, 100);
    }

    return Promise.reject(error);
  }
);


export default api;