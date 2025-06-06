
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare, Bot, BookOpen, TrendingUp, ArrowUpRight, CalendarCheck, ClipboardList, CalendarMinus } from "lucide-react";
import { 
  fetchReservations, 
  Reservation, 
  ReservationStatus, 
  getUpcomingReservations, 
  getPreCheckInReservations, 
  getPreCheckoutReservations 
} from "@/services/stayNetService";
import { fetchConversations, Conversation } from "@/services/whatsAppService";
import { fetchAIAgents, AIAgent, fetchAITasks, AITask } from "@/services/aiAgentService";

const Index: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const [aiTasks, setAITasks] = useState<AITask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [resData, convData, agentData, tasksData] = await Promise.all([
          fetchReservations(),
          fetchConversations(),
          fetchAIAgents(),
          fetchAITasks()
        ]);
        
        setReservations(resData);
        setConversations(convData);
        setAIAgents(agentData);
        setAITasks(tasksData);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calcular estatísticas do dashboard
  const unreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  const activeAgents = aiAgents.filter(agent => agent.status === 'active').length;
  
  // Filtrar reservas conforme os critérios solicitados
  const upcomingReservations = getUpcomingReservations(reservations);
  const preCheckInReservations = getPreCheckInReservations(reservations);
  const preCheckoutReservations = getPreCheckoutReservations(reservations);
  const pendingTasks = aiTasks.filter(task => task.status === 'pending').length;
  
  const recentConversations = [...conversations]
    .sort((a, b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime())
    .slice(0, 3);

  // Status badges
  const getStatusBadge = (status: ReservationStatus) => {
    const badgeClasses = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      'no-show': "bg-gray-100 text-gray-800"
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de gerenciamento Guestfy.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Próximas</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {upcomingReservations.length}
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Reservas a mais de uma semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pré-Check-in</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {preCheckInReservations.length}
              <CalendarCheck className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Reservas a uma semana ou menos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tarefas</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {pendingTasks}
              <ClipboardList className="h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ações identificadas pela IA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pré-Checkout</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {preCheckoutReservations.length}
              <CalendarMinus className="h-5 w-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Saídas no dia seguinte</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes seções */}
      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="knowledge">Base de Conhecimento</TabsTrigger>
        </TabsList>
        
        {/* Aba de Reservas */}
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Reservas</CardTitle>
              <CardDescription>
                Suas próximas 5 chegadas de hóspedes agendadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center">Carregando reservas...</div>
              ) : upcomingReservations.length === 0 ? (
                <div className="py-6 text-center">Nenhuma reserva próxima encontrada</div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {reservation.client.firstName} {reservation.client.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {reservation.listing.name}
                        </span>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(reservation.status)}
                        <span className="text-sm font-medium">
                          {reservation.currency} {reservation.totalPrice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/reservations">
                  Ver Todas as Reservas
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Aba de Conversas */}
        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversas Recentes</CardTitle>
              <CardDescription>
                Mensagens recentes dos seus hóspedes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center">Carregando conversas...</div>
              ) : recentConversations.length === 0 ? (
                <div className="py-6 text-center">Nenhuma conversa recente encontrada</div>
              ) : (
                <div className="space-y-4">
                  {recentConversations.map((conversation) => (
                    <div key={conversation.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {conversation.client.firstName} {conversation.client.lastName}
                        </span>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {conversation.messages[conversation.messages.length - 1].content}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {new Date(conversation.lastMessageTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-guestfy-500 text-white text-xs font-medium">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/chats">
                  Ver Todas as Conversas
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Aba da Base de Conhecimento */}
        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral da Base de Conhecimento</CardTitle>
              <CardDescription>
                Informações principais que seus agentes de IA usam para auxiliar os hóspedes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Bases de Conhecimento de Listagens</h3>
                    <p className="text-sm text-muted-foreground">
                      Comodidades, regras da casa e atrações locais
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/knowledge-base?tab=lists">Ver</a>
                  </Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-500 mr-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Informações da Empresa</h3>
                    <p className="text-sm text-muted-foreground">
                      Instruções de check-in/out, políticas e informações da propriedade
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/knowledge-base?tab=company">Ver</a>
                  </Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center text-green-500 mr-4">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Configuração de Agentes de IA</h3>
                    <p className="text-sm text-muted-foreground">
                      Gerencie assistentes de IA e suas fontes de conhecimento
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/agents">Ver</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
