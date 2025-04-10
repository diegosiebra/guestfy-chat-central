
// Mock service for WhatsApp integration
// In a real implementation, this would integrate with the WhatsApp Business API

import { Client } from "./stayNetService";

export type MessageSender = 'client' | 'ai';

export type Message = {
  id: string;
  conversationId: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  read: boolean;
};

export type Conversation = {
  id: string;
  clientId: string;
  client: Client;
  messages: Message[];
  lastMessageTimestamp: string;
  unreadCount: number;
};

// Mock data
const mockMessages: Record<string, Message[]> = {
  'conversation-1': [
    {
      id: 'msg-1-1',
      conversationId: 'conversation-1',
      sender: 'client',
      content: 'Hi, I have a question about my upcoming reservation.',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: true
    },
    {
      id: 'msg-1-2',
      conversationId: 'conversation-1',
      sender: 'ai',
      content: 'Hello! I\'d be happy to help with your reservation. What would you like to know?',
      timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
      read: true
    },
    {
      id: 'msg-1-3',
      conversationId: 'conversation-1',
      sender: 'client',
      content: 'What time is check-in?',
      timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
      read: true
    },
    {
      id: 'msg-1-4',
      conversationId: 'conversation-1',
      sender: 'ai',
      content: 'Check-in is at 3:00 PM. If you\'d like to request an early check-in, we can try to accommodate that based on availability.',
      timestamp: new Date(Date.now() - 3600000 * 1.7).toISOString(),
      read: true
    }
  ],
  'conversation-2': [
    {
      id: 'msg-2-1',
      conversationId: 'conversation-2',
      sender: 'client',
      content: 'Is there parking available at the property?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true
    },
    {
      id: 'msg-2-2',
      conversationId: 'conversation-2',
      sender: 'ai',
      content: 'Yes, we offer free on-site parking for all guests. You\'ll find the parking area to the right of the building entrance.',
      timestamp: new Date(Date.now() - 3600000 * 0.9).toISOString(),
      read: true
    },
    {
      id: 'msg-2-3',
      conversationId: 'conversation-2',
      sender: 'client',
      content: 'Great! Do I need a special code to enter the building?',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      read: false
    }
  ],
  'conversation-3': [
    {
      id: 'msg-3-1',
      conversationId: 'conversation-3',
      sender: 'client',
      content: 'Hi, I need to cancel my reservation due to an emergency.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    },
    {
      id: 'msg-3-2',
      conversationId: 'conversation-3',
      sender: 'ai',
      content: 'I\'m sorry to hear that. I can help you with the cancellation process. Could you please confirm your reservation number?',
      timestamp: new Date(Date.now() - 86400000 + 300000).toISOString(),
      read: true
    },
    {
      id: 'msg-3-3',
      conversationId: 'conversation-3',
      sender: 'client',
      content: 'It\'s reservation-3',
      timestamp: new Date(Date.now() - 86400000 + 600000).toISOString(),
      read: true
    },
    {
      id: 'msg-3-4',
      conversationId: 'conversation-3',
      sender: 'ai',
      content: 'Thank you for providing your reservation number. According to our cancellation policy, you are eligible for a 50% refund since you\'re canceling more than 24 hours before check-in. Would you like to proceed with the cancellation?',
      timestamp: new Date(Date.now() - 86400000 + 900000).toISOString(),
      read: true
    }
  ]
};

// Mock API methods
export const fetchConversations = async (): Promise<Conversation[]> => {
  // Get clients from stayNetService to link with conversations
  const clients = await import('./stayNetService').then(module => module.fetchClients());

  const conversations: Conversation[] = [];
  
  Object.keys(mockMessages).forEach((conversationId, index) => {
    const messages = mockMessages[conversationId];
    const clientIndex = index % clients.length;
    
    const unreadCount = messages.filter(msg => !msg.read && msg.sender === 'client').length;
    const lastMessage = messages[messages.length - 1];
    
    conversations.push({
      id: conversationId,
      clientId: clients[clientIndex].id,
      client: clients[clientIndex],
      messages: messages,
      lastMessageTimestamp: lastMessage.timestamp,
      unreadCount: unreadCount
    });
  });
  
  return conversations;
};

export const fetchConversationById = async (id: string): Promise<Conversation | null> => {
  if (!mockMessages[id]) {
    return null;
  }
  
  const conversations = await fetchConversations();
  return conversations.find(conversation => conversation.id === id) || null;
};

export const fetchMessagesByConversationId = async (conversationId: string): Promise<Message[]> => {
  return mockMessages[conversationId] || [];
};

export const sendMessage = async (conversationId: string, content: string, sender: MessageSender): Promise<Message> => {
  const newMessage: Message = {
    id: `msg-${conversationId}-${Date.now()}`,
    conversationId,
    sender,
    content,
    timestamp: new Date().toISOString(),
    read: sender === 'ai' // AI messages are marked as read by default
  };
  
  if (mockMessages[conversationId]) {
    mockMessages[conversationId].push(newMessage);
  } else {
    mockMessages[conversationId] = [newMessage];
  }
  
  return newMessage;
};

export const markMessagesAsRead = async (conversationId: string): Promise<void> => {
  if (mockMessages[conversationId]) {
    mockMessages[conversationId] = mockMessages[conversationId].map(message => ({
      ...message,
      read: true
    }));
  }
};
