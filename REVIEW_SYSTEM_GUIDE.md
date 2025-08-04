# Sistema de Avaliação de Pacotes - Guia de Implementação

## 📋 Visão Geral

O sistema de avaliação permite que usuários avaliem pacotes de viagem que já reservaram e que estão com status "finalizada". A avaliação é salva no banco de dados através da API e posteriormente exibida na página de detalhes do pacote.

## 🔧 Funcionalidades Implementadas

### 1. Verificação de Elegibilidade
- ✅ Usuário deve estar logado
- ✅ Usuário deve ter uma reserva finalizada para o pacote
- ✅ Usuário não pode avaliar o mesmo pacote duas vezes

### 2. Interface de Avaliação
- ✅ Formulário com escala de 0-10
- ✅ Campo opcional para comentários
- ✅ Validação de dados antes do envio
- ✅ Feedback visual durante o carregamento

### 3. Integração com API
- ✅ Endpoint POST `/reviews` para criar avaliações
- ✅ Dados enviados: packageId, userId, rating, comment, clientName
- ✅ Tratamento de erros e success

### 4. Interface do Usuário
- ✅ Botão "Avaliar Pacote" na página de detalhes (só para usuários elegíveis)
- ✅ Botão "Avaliar Pacote" na página "Minhas Reservas"
- ✅ Formulário responsivo com design consistente

## 🛠 Estrutura de Arquivos Modificados

```
src/
├── hooks/
│   └── useReview.js                 # ✅ Adicionada verificação de reservas
├── pages/
│   ├── AddReview/
│   │   └── index.jsx               # ✅ Atualizada integração com reservas
│   ├── PackageDetailPage/
│   │   ├── index.jsx               # ✅ Adicionado botão avaliar
│   │   └── PackageDetailPage.module.css # ✅ Estilos do botão
├── services/
│   └── reviewService.js            # ✅ Mantido endpoints existentes
```

## 📝 Como Usar

### Para Usuários Finais:

1. **Fazer uma Reserva**: Primeiro, o usuário deve fazer uma reserva de um pacote
2. **Aguardar Finalização**: A reserva deve estar com status "finalizada"
3. **Avaliar o Pacote**: 
   - Via página de detalhes: clicar no botão verde "⭐ Avaliar Pacote"
   - Via "Minhas Reservas": clicar em "Avaliar Pacote" na reserva específica
4. **Preencher Formulário**: Escolher nota (0-10) e opcional comentário
5. **Enviar**: Clicar em "Avaliar" para salvar no banco de dados

### Para Desenvolvedores:

#### Verificar se usuário pode avaliar:
```javascript
import { useReview } from '../hooks/useReview';

function MeuComponente({ packageId }) {
  const { canReview, checkCanReview } = useReview(packageId);
  
  // canReview será true se o usuário puder avaliar
  return (
    <div>
      {canReview && (
        <button onClick={() => navigate(`/avaliar/${packageId}`)}>
          Avaliar Pacote
        </button>
      )}
    </div>
  );
}
```

#### Enviar avaliação:
```javascript
const { addReview } = useReview(packageId);

const handleSubmit = async () => {
  const result = await addReview({
    rating: 8,
    comment: "Excelente viagem!",
    reservationId: reservationId // opcional
  });
  
  if (result.success) {
    // Sucesso!
  }
};
```

## 🔍 Critérios de Validação

### Backend (esperado):
- Usuário deve estar autenticado
- PackageId deve existir
- Rating deve ser entre 0 e 10
- Usuário não pode avaliar o mesmo pacote duas vezes

### Frontend (implementado):
```javascript
// Em useReview.js
const checkCanReview = async () => {
  // 1. Verifica se usuário já avaliou
  const reviewCheck = await reviewService.canUserReview(packageId, user.id);
  
  // 2. Verifica se tem reserva finalizada
  const userReservations = await reservationService.getUserReservations();
  const hasFinishedReservation = userReservations.some(reservation => {
    const packageIdMatch = reservation.packageId === parseInt(packageId);
    const isFinished = reservation.status === 'finalizada';
    return packageIdMatch && isFinished;
  });
  
  setCanReview(reviewCheck.canReview && hasFinishedReservation);
};
```

## 📊 Estrutura de Dados

### Enviado para API:
```json
{
  "packageId": 1,
  "userId": "user123",
  "rating": 8,
  "comment": "Viagem incrível!",
  "clientName": "João Silva"
}
```

### Recebido da API:
```json
{
  "id": 1,
  "packageId": 1,
  "userId": "user123",
  "rating": 8,
  "comment": "Viagem incrível!",
  "clientName": "João Silva",
  "createdAt": "2025-08-03T10:00:00Z"
}
```

## 🎨 Estilos Customizados

O botão de avaliação usa a classe `.reviewButton` no PackageDetailPage:

```css
.reviewButton {
  width: 100%;
  padding: 12px 24px;
  margin: 10px 0;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.reviewButton:hover {
  background-color: #218838;
  transform: translateY(-2px);
}
```

## 🚀 Próximos Passos Sugeridos

1. **Implementar Moderação**: Sistema para moderar avaliações antes de aparecerem publicamente
2. **Filtros de Avaliação**: Permitir filtrar por nota na página de detalhes
3. **Resposta de Empresas**: Permitir que empresas respondam avaliações
4. **Fotos nas Avaliações**: Permitir upload de fotos junto com avaliações
5. **Métricas Detalhadas**: Dashboard com estatísticas de avaliações

## 🔧 Troubleshooting

### Botão não aparece:
- Verificar se usuário está logado
- Verificar se usuário tem reserva finalizada
- Verificar se usuário ainda não avaliou

### Erro ao enviar:
- Verificar conectividade com API
- Verificar se todos os campos obrigatórios estão preenchidos
- Verificar logs do navegador para erros específicos

### Avaliação não aparece:
- Aguardar refresh da página
- Verificar se foi salva corretamente no backend
- Verificar se o componente Reviews está sendo renderizado

## 📞 Contato

Para dúvidas ou sugestões sobre o sistema de avaliação, consulte a documentação da API ou entre em contato com a equipe de desenvolvimento.
