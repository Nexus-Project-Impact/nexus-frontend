
# Nexus Frontend - Sistema de Reservas de Viagens

### 📖 Descrição
O Nexus Frontend é uma aplicação web moderna para gerenciamento de pacotes de viagem e reservas, construída com React. O sistema oferece uma experiência completa tanto para clientes quanto para administradores.


## 🌟 Principais Funcionalidades


## Área do Cliente

#### 🏠 Página Inicial / Pacotes (/)
 Funcionalidade: Listagem de todos os pacotes de viagem disponíveis

Recursos:
- Visualização em cards dos pacotes
- Filtros e busca por destino
- Informações de preço e disponibilidade
- Navegação para detalhes do pacote

#### 📦 Detalhes do Pacote (/pacotes/:packageId)
Funcionalidade: Exibe informações completas de um pacote específico

Recursos:

- Galeria de imagens do destino
- Descrição detalhada do roteiro
- Informações de preço e datas
- Sistema de avaliações e comentários
- Botão para iniciar reserva
- Modal de reserva integrado

#### 🔐 Login (/login)
Funcionalidade: Autenticação de usuários

Recursos:

- Formulário de login com email/senha
- Validação de campos
- Redirecionamento após login
- Link para recuperação de senha

#### 📝 Minhas Reservas (/reservas) (Rota Protegida)
Funcionalidade: Gerenciamento das reservas do usuário

Recursos:

- Listagem de todas as reservas
- Status das reservas (confirmada, pendente, cancelada)
- Detalhes de cada reserva
- Histórico de viagens

#### ⭐ Avaliar Pacote (/avaliar/:packageId) (Rota Protegida)
Funcionalidade: Sistema de avaliação de pacotes

Recursos:

- Formulário de avaliação com estrelas
- Campo para comentários
- Validação de avaliação única por usuário

#### 👤 Perfil (/perfil) (Rota Protegida)
Funcionalidade: Gerenciamento do perfil do usuário

Recursos:

- Visualização de perfil
- Histórico de reservas

#### 🔧 Recuperação de Senha
Funcionalidade: Solicitação de redefinição de senha

Recursos:

- Formulário para inserir email
- Envio de código de verificação
- Validação de email existente

#### 📧 Reset Password Token (/reset-password/:token)
Funcionalidade: Redefinição de senha via token

Recursos:

- Validação de token
- Formulário para nova senha
- Confirmação de senha
- Redirecionamento para login


## 🛠️ Área Administrativa

#### 🔐 Login Admin (/admin/login)
Funcionalidade: Autenticação de administradores

Recursos:

- Interface dedicada para admins
- Validação de credenciais administrativas
- Acesso ao painel administrativo

### 📦 Gerenciamento de Pacotes
#### 📋 Lista de Pacotes (/admin/pacotes)
Funcionalidade: Visualização e gerenciamento de todos os pacotes

Recursos:

- Tabela com todos os pacotes cadastrados
- Filtros e busca avançada
- Ações rápidas (editar, excluir)

#### ➕ Adicionar Pacote (/admin/pacotes/add)
Funcionalidade: Criação de novos pacotes de viagem

Recursos:

- Formulário completo de cadastro
- Upload de imagens
- Definição de preços e disponibilidade
- Configuração de roteiro e atividades

#### ✏️ Editar Pacote (/admin/pacotes/editar/:id)
Funcionalidade: Edição de pacotes existentes

Recursos:

- Formulário pré-preenchido com dados atuais
- Atualização de imagens e informações

### 📅 Gerenciamento de Reservas
#### 📊 Lista de Reservas (/admin/reservas)
Funcionalidade: Monitoramento de todas as reservas

Recursos:

- Dashboard com status das reservas
- Filtros por data, cliente
- Ações em massa

#### 🔍 Detalhes da Reserva (/admin/reservas/visualizar/:id)

Funcionalidade: Visualização completa de uma reserva específica

Recursos:

- Informações detalhadas do cliente
- Dados dos viajantes
- Histórico de pagamentos
- Status da reserva e ações disponíveis
- Comunicação com o cliente

#### 💬 Moderação de Avaliações (/admin/avaliacoes)
Funcionalidade: Gerenciamento de comentários e avaliações

Recursos:

- Filtros por rating e data
- Resposta a comentários
- Moderação de comentários ofensivos

#### 📈 Métricas e Relatórios (/admin/metricas)
Funcionalidade: Dashboard analítico do negócio

Recursos:

- Gráficos de vendas e reservas
- Métricas de satisfação do cliente
- Relatórios financeiros
- Análise de performance dos pacotes
- Tendências e insights

### 🚀 Componentes Especiais

#### 🔒 PrivateRoute
Componente de proteção de rotas
Verifica autenticação do usuário
Redireciona para login se necessário

#### 🎨 Layout Principal
Header com navegação
Footer informativo
Menu responsivo
Integração com sistema de notificações

#### 🎛️ AdminLayout
Interface administrativa dedicada
Sidebar com navegação admin
Dashboard de acesso rápido
Controles administrativos

#### 📱 Sistema de Notificações
Integração com React Toastify
Notificações de sucesso, erro e info
Posicionamento personalizável
Auto-dismiss configurável

#### 🛡️ Segurança
Rotas protegidas por autenticação
Separação de interfaces (cliente/admin)
Validação de formulários
Controle de acesso baseado em roles

#### 📱 Responsividade
Design mobile-first
Interface adaptável para tablets e desktops
Navegação otimizada para touch
Performance otimizada para dispositivos móveis
Tecnologias Utilizadas: React, React Router, CSS Modules, React Toastify

