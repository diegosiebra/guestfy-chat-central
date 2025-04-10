
// Mock service for AI Agent management
// In a real implementation, this would integrate with a backend service

export type AIAgentStatus = 'active' | 'inactive' | 'training';

export type AIAgent = {
  id: string;
  name: string;
  description: string;
  whatsappBusinessAccountId?: string;
  status: AIAgentStatus;
  capabilities: string[];
  knowledgeBaseSources: string[];
  createdAt: string;
  updatedAt: string;
};

// Mock data
let mockAgents: AIAgent[] = [
  {
    id: 'agent-1',
    name: 'GuestAssistant',
    description: 'Primary guest assistant for answering common questions',
    whatsappBusinessAccountId: 'whatsapp-business-1',
    status: 'active',
    capabilities: [
      'Answer FAQs',
      'Provide check-in information',
      'Give local recommendations',
      'Handle basic booking inquiries'
    ],
    knowledgeBaseSources: ['list-1', 'list-2', 'list-3', 'info-1', 'info-2', 'info-3'],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'agent-2',
    name: 'BookingAssistant',
    description: 'Specialized agent for handling booking requests and modifications',
    status: 'inactive',
    capabilities: [
      'Process booking requests',
      'Handle date changes',
      'Answer pricing questions',
      'Process cancellations'
    ],
    knowledgeBaseSources: ['list-2', 'info-3'],
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// API methods
export const fetchAIAgents = async (): Promise<AIAgent[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockAgents]);
    }, 300);
  });
};

export const fetchAIAgentById = async (id: string): Promise<AIAgent | null> => {
  const agent = mockAgents.find(agent => agent.id === id);
  return agent ? { ...agent } : null;
};

export const createAIAgent = async (agent: Omit<AIAgent, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIAgent> => {
  const newAgent: AIAgent = {
    ...agent,
    id: `agent-${mockAgents.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockAgents.push(newAgent);
  return { ...newAgent };
};

export const updateAIAgent = async (id: string, updates: Partial<Omit<AIAgent, 'id' | 'createdAt' | 'updatedAt'>>): Promise<AIAgent | null> => {
  const index = mockAgents.findIndex(agent => agent.id === id);
  
  if (index === -1) {
    return null;
  }
  
  mockAgents[index] = {
    ...mockAgents[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return { ...mockAgents[index] };
};

export const deleteAIAgent = async (id: string): Promise<boolean> => {
  const initialLength = mockAgents.length;
  mockAgents = mockAgents.filter(agent => agent.id !== id);
  return mockAgents.length < initialLength;
};

export const trainAIAgent = async (id: string): Promise<AIAgent | null> => {
  const agent = mockAgents.find(agent => agent.id === id);
  
  if (!agent) {
    return null;
  }
  
  agent.status = 'training';
  agent.updatedAt = new Date().toISOString();
  
  // Simulate training completion after a delay
  setTimeout(() => {
    if (agent) {
      agent.status = 'active';
      agent.updatedAt = new Date().toISOString();
    }
  }, 5000);
  
  return { ...agent };
};
