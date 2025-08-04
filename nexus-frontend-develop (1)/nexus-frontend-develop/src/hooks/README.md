# 🎣 Hooks Personalizados

Esta pasta centraliza todos os hooks personalizados da aplicação Nexus.

## 📁 Estrutura

```
src/hooks/
├── index.js                    # Exportações centralizadas
├── useLogin.js                 # Hook para autenticação de usuários
├── useAdminLogin.js           # Hook para autenticação de administradores
├── usePackageEdit.js          # Hook para edição/criação de pacotes
├── useAdminReservations.js    # Hook para listagem de reservas (admin)
└── useReservationDetails.js   # Hook para detalhes de reserva
```

## 🎯 Benefícios da Centralização

- **✅ Reutilização**: Hooks podem ser compartilhados entre diferentes páginas
- **✅ Manutenção**: Mudanças em um hook afetam todas as páginas que o usam
- **✅ Organização**: Estrutura mais limpa e previsível
- **✅ Escalabilidade**: Facilita encontrar e gerenciar hooks conforme o projeto cresce
- **✅ Testabilidade**: Hooks isolados são mais fáceis de testar

## 📖 Como usar

### Importação Individual
```javascript
import { useAdminLogin } from '../../hooks/useAdminLogin';
```

### Importação Múltipla (via index.js)
```javascript
import { useAdminLogin, usePackageEdit } from '../../hooks';
```

## 🚀 Migração Realizada

Hooks migrados das seguintes localizações:
- `src/pages/AdminEditPackage/hooks/` → `src/hooks/`
- `src/pages/AdminReservation/hooks/` → `src/hooks/`
- `src/pages/AdminLoginPage/hooks/` → `src/hooks/`

## 📝 Convenções

- Todos os hooks começam com `use`
- Nomes descritivos indicando a funcionalidade
- Documentação inline quando necessário
- Exports nomeados (não default)
