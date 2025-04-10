import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchConversations, Conversation, Message, fetchMessagesByConversationId, markMessagesAsRead, sendMessage } from "@/services/whatsAppService";
import { SearchIcon, Send } from "lucide-react";

const ChatsPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchConversations();
        setConversations(data);
        setFilteredConversations(data);
        
        // Select the first conversation by default if available
        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = conversations.filter(
        (conv) =>
          conv.client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.messages.some(msg => 
            msg.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchTerm, conversations]);

  useEffect(() => {
    const loadMessages = async () => {
      if (selectedConversation) {
        try {
          const data = await fetchMessagesByConversationId(selectedConversation.id);
          setMessages(data);
          
          // Mark messages as read when conversation is selected
          if (selectedConversation.unreadCount > 0) {
            await markMessagesAsRead(selectedConversation.id);
            
            // Update the unread count in the conversations list
            setConversations(prevConversations => 
              prevConversations.map(conv => 
                conv.id === selectedConversation.id
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            );
            
            setFilteredConversations(prevFiltered => 
              prevFiltered.map(conv => 
                conv.id === selectedConversation.id
                  ? { ...conv, unreadCount: 0 }
                  : conv
              )
            );
          }
        } catch (error) {
          console.error("Error loading messages:", error);
        }
      }
    };

    loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) {
      return;
    }
    
    try {
      // Send message as AI
      const sentMessage = await sendMessage(
        selectedConversation.id,
        newMessage,
        'ai'
      );
      
      // Update the messages list
      setMessages(prevMessages => [...prevMessages, sentMessage]);
      
      // Clear the input
      setNewMessage('');
      
      // Update the last message timestamp in the conversations list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                lastMessageTimestamp: sentMessage.timestamp,
                messages: [...conv.messages, sentMessage]
              }
            : conv
        )
      );
      
      setFilteredConversations(prevFiltered => 
        prevFiltered.map(conv => 
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                lastMessageTimestamp: sentMessage.timestamp,
                messages: [...conv.messages, sentMessage]
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // If the message is from today, show the time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    // If the message is from yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Otherwise, show the date
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat Conversations</h1>
        <p className="text-muted-foreground">
          View and manage WhatsApp conversations with your guests
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="flex h-[600px] flex-col md:flex-row">
          {/* Conversations sidebar */}
          <div className="w-full md:w-1/3 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="overflow-auto h-[calc(600px-73px)]">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p>Loading conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No conversations found</p>
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <ul>
                  {filteredConversations.map((conversation) => (
                    <li 
                      key={conversation.id} 
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                        selectedConversation?.id === conversation.id 
                          ? 'bg-muted' 
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">
                          {conversation.client.firstName} {conversation.client.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatConversationTime(conversation.lastMessageTimestamp)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {conversation.messages[conversation.messages.length - 1].content}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-guestfy-500 text-white text-xs font-medium">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Conversation header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">
                      {selectedConversation.client.firstName} {selectedConversation.client.lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      WhatsApp: {selectedConversation.client.phone}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'ai' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'ai'
                            ? 'bg-guestfy-500 text-white'
                            : 'bg-white border'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div
                          className={`text-xs mt-1 text-right ${
                            message.sender === 'ai' ? 'text-white/80' : 'text-muted-foreground'
                          }`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Select a conversation to view messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatsPage;
