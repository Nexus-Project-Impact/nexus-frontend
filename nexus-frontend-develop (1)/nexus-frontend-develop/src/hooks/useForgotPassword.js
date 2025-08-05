import { useState } from 'react';
import { forgotPassword } from '../services/authService';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    console.log('Botão Recuperar Senha clicado!', { email });
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!email?.trim()) {
      console.log('Email vazio, mostrando erro');
      setError('Email é obrigatório');
      setIsLoading(false);
      return false;
    }

    try {
      console.log('Enviando email de recuperação para:', email.trim());
      const response = await forgotPassword(email.trim());
      
      console.log('Resposta do forgotPassword:', response);

      console.log('Email de recuperação enviado com sucesso');
      setIsSuccess(true);
      
      // Retornar dados de sucesso (sem token, pois o backend usa código)
      return {
        success: true,
        message: response.message || 'Email de recuperação enviado',
        email: email.trim()
      };
      
    } catch (err) {
      console.error('Erro no handlePasswordReset:', err);
      setError('Erro ao solicitar recuperação de senha');
      return false;
      
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setEmail('');
    setIsSuccess(false);
    setError(null);
  };

  // Função para gerar conteúdo do email de recuperação (baseado no código de 6 dígitos)
  const generateEmailContent = (userEmail, code) => {
    return {
      subject: 'Nexus - Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
            <h1 style="color: #333;">Nexus</h1>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Recuperação de Senha</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Olá,
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Recebemos uma solicitação para redefinir a senha da sua conta em <strong>${userEmail}</strong>.
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Seu código de recuperação é:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #f8f9fa; border: 2px solid #007bff; 
                          padding: 20px; border-radius: 10px; display: inline-block;">
                <span style="font-size: 2em; font-weight: bold; color: #007bff; letter-spacing: 5px;">
                  ${code}
                </span>
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              <strong>Importante:</strong> Este código é válido por 10 minutos. Nunca compartilhe este código com ninguém.
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              Se você não solicitou esta alteração, ignore este email.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            © 2024 Nexus. Todos os direitos reservados.
          </div>
        </div>
      `,
      text: `
        Nexus - Recuperação de Senha
        
        Olá,
        
        Recebemos uma solicitação para redefinir a senha da sua conta em ${userEmail}.
        
        Seu código de recuperação é: ${code}
        
        Este código é válido por 10 minutos. Nunca compartilhe este código com ninguém.
        
        Se você não solicitou esta alteração, ignore este email.
        
        © 2024 Nexus. Todos os direitos reservados.
      `
    };
  };

  return { 
    email, 
    setEmail, 
    isLoading, 
    isSuccess, 
    error, 
    handlePasswordReset, 
    resetState,
    generateEmailContent 
  };
}