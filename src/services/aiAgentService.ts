
// Mock service for AI Agent API

export type AIAgent = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'learning' | 'training';
  knowledgeBaseIds: string[];
  capabilities: string[];
  lastActive: string;
  conversationsHandled: number;
  avatar?: string;
};

export type AITask = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  dueDate?: string;
  agentId: string;
  reservationId?: string;
  clientId?: string;
};

// Mock data
const generateMockAgents = (count: number): AIAgent[] => {
  const agents: AIAgent[] = [];
  
  const names = [
    'Assistente Virtual',
    'Concierge Digital',
    'Suporte ao Hóspede',
    'Atendente Virtual'
  ];
  
  const statuses: ('active' | 'inactive' | 'learning')[] = [
    'active',
    'inactive',
    'learning'
  ];

  const capabilities = [
    'Responder dúvidas',
    'Enviar mensagens',
    'Agendar serviços',
    'Auxiliar check-in',
    'Auxiliar check-out',
    'Recomendar locais',
    'Informações do quarto',
    'Solicitações especiais'
  ];
  
  for (let i = 0; i < count; i++) {
    agents.push({
      id: `agent-${i + 1}`,
      name: names[i % names.length],
      description: `Um agente de IA para ${names[i % names.length].toLowerCase()}`,
      status: statuses[i % statuses.length],
      knowledgeBaseIds: [`kb-${i + 1}`],
      capabilities: [
        capabilities[i % capabilities.length],
        capabilities[(i + 1) % capabilities.length],
        capabilities[(i + 2) % capabilities.length]
      ],
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 5)).toISOString(),
      conversationsHandled: Math.floor(Math.random() * 100),
      avatar: i % 2 === 0 ? `/agents/avatar-${i}.png` : undefined
    });
  }
  
  return agents;
};

// Mock data para tarefas
const generateMockTasks = (count: number): AITask[] => {
  const tasks: AITask[] = [];
  
  const titles = [
    'Verificar preferências de check-in',
    'Confirmar horário de chegada',
    'Enviar instruções de acesso',
    'Verificar necessidades especiais',
    'Confirmar número de hóspedes',
    'Oferecer serviços adicionais',
    'Perguntar sobre transporte',
    'Sugerir restaurantes locais'
  ];
  
  const statuses: ('pending' | 'completed' | 'cancelled')[] = [
    'pending',
    'completed',
    'cancelled'
  ];
  
  const priorities: ('high' | 'medium' | 'low')[] = [
    'high',
    'medium',
    'low'
  ];
  
  for (let i = 0; i < count; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 7));
    
    tasks.push({
      id: `task-${i + 1}`,
      title: titles[i % titles.length],
      description: `Detalhes sobre a tarefa: ${titles[i % titles.length].toLowerCase()}`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
      dueDate: dueDate.toISOString(),
      agentId: `agent-${(i % 2) + 1}`,
      reservationId: i % 3 === 0 ? `reservation-${i + 1}` : undefined,
      clientId: i % 4 === 0 ? `client-${i + 1}` : undefined
    });
  }
  
  return tasks;
};

// Mock API methods
export const fetchAIAgents = async (): Promise<AIAgent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockAgents(2));
    }, 500);
  });
};

export const fetchAIAgentById = async (id: string): Promise<AIAgent | null> => {
  const agents = await fetchAIAgents();
  return agents.find(agent => agent.id === id) || null;
};

export const fetchAITasks = async (): Promise<AITask[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockTasks(8));
    }, 500);
  });
};

export const fetchAITaskById = async (id: string): Promise<AITask | null> => {
  const tasks = await fetchAITasks();
  return tasks.find(task => task.id === id) || null;
};

// Adicionando funções que estavam sendo utilizadas mas não existiam
export const updateAIAgent = async (
  id: string, 
  updates: Partial<AIAgent>
): Promise<AIAgent | null> => {
  try {
    // Simular uma atualização do agente
    const agent = await fetchAIAgentById(id);
    if (!agent) return null;
    
    const updatedAgent: AIAgent = {
      ...agent,
      ...updates
    };
    
    // Em um caso real, aqui teria uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(updatedAgent);
      }, 300);
    });
  } catch (error) {
    console.error("Error updating agent:", error);
    return null;
  }
};

export const trainAIAgent = async (id: string): Promise<AIAgent | null> => {
  try {
    // Simular processo de treinamento
    const agent = await fetchAIAgentById(id);
    if (!agent) return null;
    
    const trainingAgent: AIAgent = {
      ...agent,
      status: 'training'
    };
    
    // Simulando resposta de API após iniciar o treinamento
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(trainingAgent);
      }, 300);
    });
  } catch (error) {
    console.error("Error training agent:", error);
    return null;
  }
};
