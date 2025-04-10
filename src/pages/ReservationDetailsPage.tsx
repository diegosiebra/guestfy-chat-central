
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  CalendarCheck,
  FileText,
  MessageSquare,
  Share2,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Reservation, ReservationStatus, fetchReservationWithProperty } from "@/services/stayNetService";

const ReservationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await fetchReservationWithProperty(id);
          setReservation(data);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes da reserva:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReservation();
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      weekday: 'long'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const statusConfig = {
      confirmed: { label: "Confirmada", color: "bg-green-100 text-green-800" },
      pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800" },
      completed: { label: "Concluída", color: "bg-blue-100 text-blue-800" },
      'no-show': { label: "Não Compareceu", color: "bg-gray-100 text-gray-800" }
    };
    
    return (
      <Badge variant="outline" className={`font-medium ${statusConfig[status].color}`}>
        {statusConfig[status].label}
      </Badge>
    );
  };

  // Calcular duração e valor total
  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const durationMs = end.getTime() - start.getTime();
    return Math.ceil(durationMs / (1000 * 60 * 60 * 24)); // Converter para dias
  };

  // Obter valor por noite (simulação)
  const getNightlyRate = (totalPrice: number, nights: number) => {
    return (totalPrice * 0.8) / nights; // Simulando que 80% do total é o valor das diárias
  };

  // Obter taxa de limpeza (simulação)
  const getCleaningFee = (totalPrice: number) => {
    return totalPrice * 0.1; // Simulando que 10% do total é a taxa de limpeza
  };

  // Obter taxa de serviço (simulação)
  const getServiceFee = (totalPrice: number) => {
    return totalPrice * 0.1; // Simulando que 10% do total é a taxa de serviço
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando detalhes da reserva...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg mb-4">Reserva não encontrada</p>
        <Button asChild>
          <Link to="/reservations">Voltar para Reservas</Link>
        </Button>
      </div>
    );
  }

  const nights = calculateDuration(reservation.checkInDate, reservation.checkOutDate);
  const nightlyRate = getNightlyRate(reservation.totalPrice, nights);
  const cleaningFee = getCleaningFee(reservation.totalPrice);
  const serviceFee = getServiceFee(reservation.totalPrice);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild className="h-8 w-8">
              <Link to="/reservations">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Reserva #{reservation.id.substring(12)}
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {getStatusBadge(reservation.status)}
            <span className="text-sm text-muted-foreground">
              Criada em {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Detalhes principais */}
        <div className="md:col-span-2">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>Detalhes da Estadia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Check-in
                  </div>
                  <div>
                    <p className="font-medium">{formatDate(reservation.checkInDate)}</p>
                    <p className="text-sm text-muted-foreground">A partir de 14:00</p>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <XCircle className="h-4 w-4 mr-1" />
                    Check-out
                  </div>
                  <div>
                    <p className="font-medium">{formatDate(reservation.checkOutDate)}</p>
                    <p className="text-sm text-muted-foreground">Até 11:00</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mb-4 gap-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duração da estadia</p>
                    <p className="text-sm text-muted-foreground">
                      {nights} {nights === 1 ? 'noite' : 'noites'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Hóspedes</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.guestCount} {reservation.guestCount === 1 ? 'pessoa' : 'pessoas'}
                    </p>
                  </div>
                </div>
              </div>
              
              {reservation.notes && (
                <div className="border-t pt-4">
                  <p className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Observações
                  </p>
                  <p className="mt-2 text-sm">{reservation.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>Propriedade</CardTitle>
            </CardHeader>
            <CardContent>
              <Link 
                to={reservation.property ? `/properties/${reservation.property.id}` : `/properties`} 
                className="flex items-start gap-4 hover:bg-muted/50 p-2 rounded-md transition-colors"
              >
                <div className="h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {reservation.property ? (
                    <img 
                      src={reservation.property._t_mainImageMeta.url} 
                      alt={reservation.property._mstitle.pt_BR} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">
                    {reservation.property ? 
                      reservation.property._mstitle.pt_BR : 
                      reservation.listing.name}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {reservation.property ? 
                      `${reservation.property.address.region}, ${reservation.property.address.city}` : 
                      `${reservation.listing.city}, ${reservation.listing.country}`}
                  </p>
                  
                  {reservation.property && (
                    <div className="flex gap-3 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center">
                        <Home className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {reservation.property._t_typeMeta?._mstitle?.pt_BR || 'Suíte'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-1" />
                        <span>Até {reservation.property._i_maxGuests} hóspedes</span>
                      </div>
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              
              {reservation.property && (
                <div className="mt-4 border-t pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <a href={`https://maps.google.com/?q=${reservation.property.latLng?._f_lat},${reservation.property.latLng?._f_lng}`} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4 mr-2" />
                      Ver no Google Maps
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Detalhes do Hóspede</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{reservation.client.firstName} {reservation.client.lastName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4 mr-1" />
                    <a href={`mailto:${reservation.client.email}`} className="hover:underline">
                      {reservation.client.email}
                    </a>
                  </div>
                  {reservation.client.phone && (
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      <a href={`tel:${reservation.client.phone}`} className="hover:underline">
                        {reservation.client.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {reservation.client.whatsappId && (
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contato via WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Resumo financeiro */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
              <CardDescription>
                Detalhes dos valores da reserva
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">
                    {reservation.currency} {nightlyRate.toFixed(2)} x {nights} {nights === 1 ? 'noite' : 'noites'}
                  </p>
                  <p>{reservation.currency} {(nightlyRate * nights).toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxa de limpeza</p>
                  <p>{reservation.currency} {cleaningFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Taxa de serviço</p>
                  <p>{reservation.currency} {serviceFee.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                  <p>Total</p>
                  <p>{reservation.currency} {reservation.totalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              {reservation.promoCode && (
                <div className="bg-green-50 text-green-700 p-2 rounded-md text-sm mt-2">
                  <p className="font-medium">Código promocional aplicado: {reservation.promoCode}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Status de pagamento</p>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                  <p className="font-medium">Pago integralmente</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pagamento recebido em {new Date(reservation.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Clock className="mr-2 h-4 w-4" />
                    Alterar Reserva
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm p-4">
                    <h3 className="text-lg font-semibold">Opções de alteração</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Escolha uma opção para modificar esta reserva
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Alterar datas
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Alterar número de hóspedes
                      </Button>
                      {reservation.status === 'confirmed' && (
                        <Button variant="destructive" className="w-full justify-start">
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar reserva
                        </Button>
                      )}
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
              
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Gerar Comprovante
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailsPage;
