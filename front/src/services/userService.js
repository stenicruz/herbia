import api from './api';

const userService = {
  /**
   * BUSCAR DADOS DO PERFIL (Para visualizar Nome, Email, Foto, etc.)
   * Rota: GET /usuarios/:id
   */
  getPerfil: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao carregar dados do perfil";
      throw new Error(errorMsg);
    }
  },

  /**
   * ATUALIZAR NOME
   * Rota: PUT /usuarios/:id
   */
  atualizarNome: async (id, nome) => {
    try {
      const response = await api.put(`/usuarios/${id}`, { nome });
      return response.data;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Erro ao atualizar nome";
      throw new Error(errorMsg);
    }
  },

  /**
   * ATUALIZAR FOTO DE PERFIL (Multipart/Form-Data)
   * Rota: PUT /usuarios/:id/foto
   */
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

  /**
   * ALTERAR SENHA
   * Rota: PUT /usuarios/:id/senha
   */
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

  /**
   * APAGAR CONTA
   * Rota: DELETE /usuarios/:id/conta
   */
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