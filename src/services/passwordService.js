import { resetPasswordLoggedUser } from './authService';

const PasswordService = {
  /**
   * Altera a senha do usuário autenticado
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {Promise} - Resposta da API
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await resetPasswordLoggedUser(currentPassword, newPassword);
      
      return {
        success: true,
        data: response,
        message: 'Senha alterada com sucesso!'
      };
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      
      // Tratamento de erros específicos
      let errorMessage = 'Erro interno do servidor. Tente novamente.';
      
      if (error.response?.status === 400) {
        errorMessage = 'Senha atual incorreta ou nova senha inválida.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Acesso negado. Verifique suas permissões.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Endpoint não encontrado. Verifique se o backend está rodando.';
      } else if (error.response?.status === 422) {
        errorMessage = 'Nova senha não atende aos critérios de segurança.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return {
        success: false,
        error: error.response?.data || error.message || 'Erro desconhecido',
        message: errorMessage
      };
    }
  },

  /**
   * Valida a força da senha
   * @param {string} password - Senha a ser validada
   * @returns {Object} - Resultado da validação
   */
  validatePasswordStrength(password) {
    const result = {
      isValid: true,
      errors: [],
      strength: 'weak'
    };

    // Verificações básicas
    if (!password || password.length < 8) {
      result.isValid = false;
      result.errors.push('A senha deve ter pelo menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/\d/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      result.isValid = false;
      result.errors.push('A senha deve conter pelo menos um caractere especial');
    }

    // Avaliação da força da senha
    if (result.isValid) {
      let score = 0;
      
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[a-z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;
      if (password.length >= 16) score++;
      
      if (score <= 3) {
        result.strength = 'weak';
      } else if (score <= 5) {
        result.strength = 'medium';
      } else {
        result.strength = 'strong';
      }
    }

    return result;
  },

  /**
   * Verifica se as senhas coincidem
   * @param {string} password - Senha
   * @param {string} confirmPassword - Confirmação da senha
   * @returns {boolean} - Se as senhas coincidem
   */
  passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
  }
};

export default PasswordService;
