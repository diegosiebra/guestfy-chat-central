
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageSquare, Bot, BookOpen, TrendingUp, ArrowUpRight } from "lucide-react";
import { fetchReservations, Reservation, ReservationStatus } from "@/services/stayNetService";
import { fetchConversations, Conversation } from "@/services/whatsAppService";
import { fetchAIAgents, AIAgent } from "@/services/aiAgentService";

const Index: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [aiAgents, setAIAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [resData, convData, agentData] = await Promise.all([
          fetchReservations(),
          fetchConversations(),
          fetchAIAgents()
        ]);
        
        setReservations(resData);
        setConversations(convData);
        setAIAgents(agentData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate dashboard stats
  const unreadMessages = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  const activeAgents = aiAgents.filter(agent => agent.status === 'active').length;
  const pendingReservations = reservations.filter(res => res.status === 'pending').length;
  const confirmedReservations = reservations.filter(res => res.status === 'confirmed').length;
  
  const upcomingReservations = reservations
    .filter(res => res.status === 'confirmed' || res.status === 'pending')
    .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
    .slice(0, 5);
  
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
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Guestfy management dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {confirmedReservations}
              <CalendarDays className="h-5 w-5 text-guestfy-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Confirmed reservations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {pendingReservations}
              <TrendingUp className="h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Reservations pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Messages</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {unreadMessages}
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Unread client messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Agents</CardDescription>
            <CardTitle className="text-2xl flex justify-between">
              {activeAgents}/{aiAgents.length}
              <Bot className="h-5 w-5 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active AI assistants</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different section overviews */}
      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        
        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>
                Your next 5 scheduled guest arrivals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center">Loading reservations...</div>
              ) : upcomingReservations.length === 0 ? (
                <div className="py-6 text-center">No upcoming reservations found</div>
              ) : (
                <div className="space-y-4">
                  {upcomingReservations.map((reservation) => (
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
                  View All Reservations
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Recent messages from your guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-6 text-center">Loading conversations...</div>
              ) : recentConversations.length === 0 ? (
                <div className="py-6 text-center">No recent conversations found</div>
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
                  View All Conversations
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Overview</CardTitle>
              <CardDescription>
                Core information your AI agents use to assist guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">List Knowledge Bases</h3>
                    <p className="text-sm text-muted-foreground">
                      Amenities, house rules, and local attractions
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/knowledge-base?tab=lists">View</a>
                  </Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center text-purple-500 mr-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Company Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Check-in/out instructions, policies, and property info
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/knowledge-base?tab=company">View</a>
                  </Button>
                </div>
                
                <div className="flex items-center p-3 border rounded-lg">
                  <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center text-green-500 mr-4">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">AI Agent Configuration</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage AI assistants and their knowledge sources
                    </p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href="/agents">View</a>
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
