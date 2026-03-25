import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as GoogleModule from '@react-native-google-signin/google-signin';
const { GoogleSignin } = GoogleModule;

GoogleSignin.configure({
  webClientId: '691168137852-d8n5v7st68kojqntlu1t7b5cuf15dvp9.apps.googleusercontent.com', 
});

const authService = {
  
  // Função de Login
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });

      // Se o backend retornar um token, guardamos no telemóvel
      if (response.data.token) {
        await AsyncStorage.setItem('@Herbia:token', response.data.token);
        
        // Guardamos também os dados básicos do utilizador (nome, tipo, etc)
        const userData = {
          ...response.data.user,
          auth_provider: 'local',
          tem_senha: 1,
        };
        await AsyncStorage.setItem('@Herbia:user', JSON.stringify(userData));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro de conexão com o servidor' };
    }
  },

  // VERIFICAR SENHA
  verificarSenha: async (senha) => {
  try {
    const response = await api.post('/auth/verificar-senha', { senha });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Senha incorreta' };
  }
  },

  // LOGIN SOCIAL
  loginGoogle: async (googleToken) => {
  try {
    const response = await api.post('/auth/login-google', { token: googleToken });
    if (response.data.token) {
      await AsyncStorage.setItem('@Herbia:token', response.data.token);
      const userData = {
        ...response.data.user,
        auth_provider: 'google',
        tem_senha: 0,
      };
      await AsyncStorage.setItem('@Herbia:user', JSON.stringify(userData));
    }
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Erro ao conectar com o Google';
    throw { error: errorMessage };
  }
},

  // Função de Registo
 register: async (nome, email, senha) => {
  try {
    const response = await api.post('/auth/registrar', { nome, email, senha });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao criar conta' };
  }
 },

  // Função de Logout
  logout: async () => {
  try {
    // Limpa o seu armazenamento local
    await AsyncStorage.multiRemove(['@Herbia:token', '@Herbia:user']);

    // Força o Google a "esquecer" o vínculo
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


  // Verificar se existe um utilizador logado
  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem('@Herbia:token');
    return token !== null;
  },
  
  // VERIFICAR EMAIL
  verifyEmail: async (email, codigo) => {
  try {
    const response = await api.post('/auth/validar-email', { email, codigo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Código inválido ou expirado' };
  }
  },

  // VERIFICAR CÓDIGO
  verifyResetCode: async (email, codigo) => {
    try {
      const response = await api.post('/auth/validar-codigo', { email, codigo });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Código inválido ou expirado' };
    }
  },

  // MUDAR SENHA
  resetPassword: async (email, codigo, novaSenha) => {
    try {
      const response = await api.post('/auth/redefinir-senha', { email, codigo, novaSenha });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erro ao redefinir senha' };
    }
  },

  // REENCIAR CÓDIGO
  resendCode: async (email, motivo) => {
  try {
    const response = await api.post('/auth/reenviar-codigo', { email, motivo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro ao reenviar código' };
  }
},

// ESQUECI A MINHA SENHA
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