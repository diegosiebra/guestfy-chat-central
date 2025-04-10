import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchReservations, Reservation, ReservationStatus } from "@/services/stayNetService";
import { SearchIcon, Filter, Calendar, User, Home } from "lucide-react";

const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReservations();
        setReservations(data);
        setFilteredReservations(data);
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const filterReservations = () => {
    let filtered = [...reservations];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (res) => res.status === statusFilter
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (res) =>
          res.client.firstName.toLowerCase().includes(term) ||
          res.client.lastName.toLowerCase().includes(term) ||
          res.listing.name.toLowerCase().includes(term) ||
          res.id.toLowerCase().includes(term)
      );
    }

    setFilteredReservations(filtered);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const getStatusBadge = (status: ReservationStatus) => {
    const badgeClasses = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
      'no-show': "bg-gray-100 text-gray-800"
    };
    
    const statusTranslations = {
      confirmed: "Confirmada",
      pending: "Pendente",
      cancelled: "Cancelada",
      completed: "Concluída",
      'no-show': "Não Compareceu"
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[status]}`}>
        {statusTranslations[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todas as reservas das suas propriedades
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Reservas</CardTitle>
          <CardDescription>
            Visualize e filtre todas as reservas do Stay.net
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por hóspede, propriedade ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="confirmed">Confirmada</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="no-show">Não Compareceu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <p>Carregando reservas...</p>
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="py-20 text-center border rounded-lg">
              <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">ID</th>
                    <th className="text-left py-3 px-4 font-medium">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" /> Hóspede
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      <div className="flex items-center gap-1">
                        <Home className="h-4 w-4" /> Propriedade
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Datas
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Total</th>
                    <th className="text-right py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">{reservation.id.substring(12)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">
                            {reservation.client.firstName} {reservation.client.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.client.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{reservation.listing.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.listing.city}, {reservation.listing.country}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{formatDate(reservation.checkInDate)}</div>
                        <div className="text-sm text-muted-foreground">
                          a {formatDate(reservation.checkOutDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(reservation.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="font-medium">{reservation.currency} {reservation.totalPrice}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.guestCount} {reservation.guestCount === 1 ? 'hóspede' : 'hóspedes'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/reservations/${reservation.id}`}>Visualizar</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsPage;
