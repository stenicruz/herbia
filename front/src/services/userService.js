import api from './api';

const userService = {
  
  // BUSCAR DADOS DO PERFIL
  getPerfil: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao carregar dados do perfil";
      throw new Error(errorMsg);
    }
  },

  // ATUALIZAR A HOME
  atualizarNome: async (id, nome) => {
    try {
      const response = await api.put(`/usuarios/${id}`, { nome });
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao atualizar nome";
      throw new Error(errorMsg);
    }
  },

  // ATUALIZAR CONTA
  atualizarFoto: async (id, fotoUri, fileName, fileType) => {
    try {
      const formData = new FormData();
      
      formData.append('foto', {
        uri: fotoUri,
        name: fileName || `avatar_${id}.jpg`,
        type: fileType || 'image/jpeg',
      });

      const response = await api.put(`/usuarios/${id}/foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao fazer upload da foto";
      throw new Error(errorMsg);
    }
  },

  // ALTERAR SENHA
  alterarSenha: async (id, senhaAtual, novaSenha) => {
    try {
      const response = await api.put(`/usuarios/${id}/senha`, { 
        senhaAtual, 
        novaSenha 
      });
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao alterar senha";
      throw new Error(errorMsg);
    }
  },

  // APAGAR CONTA
  deleteConta: async (id, senha) => {
    try {
      const response = await api.delete(`/usuarios/${id}/conta`, {
        data: { senha }
      });
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao excluir conta";
      throw new Error(errorMsg);
    }
  }
};

export default userService;