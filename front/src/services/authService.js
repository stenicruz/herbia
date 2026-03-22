import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as GoogleModule from '@react-native-google-signin/google-signin';
const { GoogleSignin } = GoogleModule;

GoogleSignin.configure({
  webClientId: '691168137852-d8n5v7st68kojqntlu1t7b5cuf15dvp9.apps.googleusercontent.com', 
});

const authService = {
  // 1. Função de Login
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });

      // Se o backend retornar um token, guardamos no telemóvel
      if (response.data.token) {
        await AsyncStorage.setItem('@Herbia:token', response.data.token);
        
        // Guardamos também os dados básicos do utilizador (nome, tipo, etc)
        await AsyncStorage.setItem('@Herbia:user', JSON.stringify(response.data.user));
      }

      return response.data; // Retorna { token, user } para o ecrã usar
    } catch (error) {
      // Lança o erro para o ecrã de Login mostrar um Alert
      throw error.response?.data || { error: 'Erro de conexão com o servidor' };
    }
  },

  loginGoogle: async (googleToken) => {
  try {
    const response = await api.post('/auth/login-google', { token: googleToken });
    if (response.data.token) {
      await AsyncStorage.setItem('@Herbia:token', response.data.token);
      await AsyncStorage.setItem('@Herbia:user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Erro ao conectar com o Google';
    throw { error: errorMessage };
  }
},

  // 2. Função de Registo (Sign Up)
 register: async (nome, email, senha) => {
  try {
    // O objeto { nome, email, senha } deve bater EXATAMENTE com o que o Backend espera no req.body
    const response = await api.post('/auth/registrar', { nome, email, senha });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao criar conta' };
  }
 },

  // 3. Função de Logout
  logout: async () => {
  try {
    // 1. Limpa o seu armazenamento local
    await AsyncStorage.multiRemove(['@Herbia:token', '@Herbia:user']);

    // 2. Força o Google a "esquecer" o vínculo
    if (GoogleSignin) {
      try {
        // Primeiro revogamos o acesso (limpa o cache de escolha de conta)
        await GoogleSignin.revokeAccess();
        // Depois deslogamos
        await GoogleSignin.signOut();
      } catch (gError) {
        // Se der erro aqui, é porque já estava deslogado, ignoramos.
        console.log("Google já estava limpo");
      }
    }
    
    console.log("✅ Logout total realizado.");
  } catch (error) {
    console.error("❌ Erro no logout:", error);
  }
},


  // 4. Verificar se existe um utilizador logado (Útil para o Splash Screen)
  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem('@Herbia:token');
    return token !== null;
  },
  
  verifyEmail: async (email, codigo) => {
  try {
    const response = await api.post('/auth/validar-email', { email, codigo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Código inválido ou expirado' };
  }
  },

  verifyResetCode: async (email, codigo) => {
    try {
      // Usamos a mesma rota de validar-codigo, pois a lógica de conferir email+token é igual
      const response = await api.post('/auth/validar-codigo', { email, codigo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Código inválido ou expirado' };
    }
  },

  resetPassword: async (email, codigo, novaSenha) => {
    try {
      const response = await api.post('/auth/redefinir-senha', { email, codigo, novaSenha });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao redefinir senha' };
    }
  },

  resendCode: async (email, motivo) => {
  try {
    const response = await api.post('/auth/reenviar-codigo', { email, motivo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao reenviar código' };
  }
},

  forgotPassword: async (email) => {
    try {
        const response = await api.post('/auth/recuperar-senha', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Erro ao processar pedido' };
    }
  },
};

export default authService;