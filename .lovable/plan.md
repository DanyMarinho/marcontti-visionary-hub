Implementar o WhatsApp Business completo, transformando a simulação atual em uma interface funcional e integrada com o CRM.

### Mudanças Propostas:

#### 1. Tipos e Dados
- Expandir `ChatMessage` em `src/types/conversation.ts` para suportar novos estados e tipos de mídia (áudio, imagem).
- Atualizar `mockConversations.ts` com conversas mais ricas e realistas focadas no nicho automotivo/garage.

#### 2. Store Zustand (`chatSlice.ts`)
- Adicionar suporte para envio de mensagens reais (atualmente é apenas simulação passiva).
- Implementar troca de conversas (selecionar lead da lista lateral).
- Adicionar busca de contatos e filtragem por status (aguardando, respondidos).

#### 3. UI - Componentes do WhatsApp
- **Sidebar de Conversas (`ConversationSidebar.tsx`):** Criar uma lista lateral de conversas ativas com busca, similar ao WhatsApp Web.
- **Chat Interface (`ChatInterface.tsx`):**
    - Implementar campo de input funcional com suporte a enter.
    - Adicionar botão de "Enviar Áudio" (visual) e "Anexar".
    - Melhorar o cabeçalho com mais informações do lead.
- **Message Bubble (`MessageBubble.tsx`):** Adicionar suporte visual para diferentes tipos de mensagens e status (entregue/lido).
- **Painel de Qualificação:** Integrar as ações rápidas com o estado real do lead no CRM (ex: mover para estágio "Visita Agendada").

#### 4. Integração
- Garantir que leads criados via Demo apareçam na lista do WhatsApp.
- Sincronizar interações do chat com o histórico de atividades do lead no CRM.

### Detalhes Técnicos:
- Uso de `framer-motion` para transições suaves entre conversas.
- `shadcn/ui` para componentes de input e listagens.
- Otimização de scroll automático para novas mensagens.
