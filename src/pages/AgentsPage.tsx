
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AIAgent, fetchAIAgents, updateAIAgent, trainAIAgent } from "@/services/aiAgentService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Zap, RefreshCw, Settings, PlusCircle } from "lucide-react";

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAIAgents();
        setAgents(data);
      } catch (error) {
        console.error("Error loading AI agents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  const handleStatusChange = async (agentId: string, active: boolean) => {
    try {
      const updatedAgent = await updateAIAgent(agentId, {
        status: active ? 'active' : 'inactive'
      });
      
      if (updatedAgent) {
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId ? updatedAgent : agent
          )
        );
      }
    } catch (error) {
      console.error("Error updating agent status:", error);
    }
  };

  const handleTrainAgent = async (agentId: string) => {
    try {
      const updatedAgent = await trainAIAgent(agentId);
      
      if (updatedAgent) {
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId ? updatedAgent : agent
          )
        );
        
        // After 5 seconds, refresh the agent list to show the updated status
        setTimeout(async () => {
          const data = await fetchAIAgents();
          setAgents(data);
        }, 5000);
      }
    } catch (error) {
      console.error("Error training agent:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inativo</Badge>;
      case 'training':
        return <Badge className="bg-yellow-500">Treinando</Badge>;
      case 'learning':
        return <Badge className="bg-blue-500">Aprendendo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agentes IA</h1>
          <p className="text-muted-foreground">
            Gerenciar seus assistentes de IA e suas fontes de conhecimento
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Criar Novo Agente
        </Button>
      </div>

      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents">Agentes IA</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="agents" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <p>Carregando agentes IA...</p>
            </div>
          ) : agents.length === 0 ? (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Nenhum Agente IA Encontrado</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Crie seu primeiro agente IA para começar a automatizar comunicações com hóspedes
                </p>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Novo Agente
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-guestfy-500" />
                        {agent.name}
                      </CardTitle>
                      {getStatusBadge(agent.status)}
                    </div>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capacidades</h4>
                        <div className="flex flex-wrap gap-2">
                          {agent.capabilities && agent.capabilities.map((capability, index) => (
                            <Badge key={index} variant="secondary">{capability}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Fontes de Conhecimento</h4>
                        <p className="text-sm text-muted-foreground">
                          Usando {agent.knowledgeBaseIds.length} fontes de conhecimento
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium">Status</span>
                        <Switch 
                          checked={agent.status === 'active'}
                          onCheckedChange={(checked) => handleStatusChange(agent.id, checked)}
                          disabled={agent.status === 'training'}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/agents/${agent.id}`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Configurar
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTrainAgent(agent.id)}
                      disabled={agent.status === 'training'}
                    >
                      {agent.status === 'training' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Treinando...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Treinar Agente
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Integração do WhatsApp</CardTitle>
              <CardDescription>
                Configure a integração da API WhatsApp Business para seus agentes de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Conta WhatsApp Business</h4>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Guestfy Business Account</p>
                      <p className="text-sm text-muted-foreground">Conectado: 5 de Abril, 2023</p>
                    </div>
                    <Badge className="bg-green-500">Ativo</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Números de Telefone</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Número Principal</p>
                      </div>
                      <Badge className="bg-green-500">Ativo</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Atualizar Configurações do WhatsApp</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentsPage;
