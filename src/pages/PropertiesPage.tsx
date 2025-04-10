
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Property } from "@/types/propertyTypes";
import { fetchProperties } from "@/services/propertyService";
import { Bed, Bath, Users, MapPin, Home, SearchIcon, Filter } from "lucide-react";

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProperties();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchTerm, statusFilter, properties]);

  const filterProperties = () => {
    let filtered = [...properties];

    // Filtrar por status se não for "all"
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (prop) => prop.status === statusFilter
      );
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (prop) =>
          prop._mstitle.pt_BR.toLowerCase().includes(term) ||
          prop.internalName.toLowerCase().includes(term) ||
          prop.address.region.toLowerCase().includes(term) ||
          prop.address.city.toLowerCase().includes(term) ||
          prop.id.toLowerCase().includes(term)
      );
    }

    setFilteredProperties(filtered);
  };

  const renderAmenities = (property: Property) => {
    return (
      <div className="flex gap-3 text-sm text-muted-foreground mt-2">
        <div className="flex items-center">
          <Bed className="h-4 w-4 mr-1" />
          <span>{property._i_rooms} {property._i_rooms === 1 ? 'quarto' : 'quartos'}</span>
        </div>
        <div className="flex items-center">
          <Bath className="h-4 w-4 mr-1" />
          <span>{property._f_bathrooms} {property._f_bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>Até {property._i_maxGuests} hóspedes</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Propriedades</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize todas as suas propriedades no Stay.net
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Propriedades</CardTitle>
          <CardDescription>
            Visualize e filtre todas as propriedades conectadas ao Stay.net
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, região, cidade..."
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
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">
              <p>Carregando propriedades...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="py-20 text-center border rounded-lg">
              <p className="text-muted-foreground">Nenhuma propriedade encontrada</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProperties.map((property) => (
                <Card key={property._id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={property._t_mainImageMeta.url} 
                      alt={property._mstitle.pt_BR} 
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{property._mstitle.pt_BR}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          {property.address.region}, {property.address.city}
                        </CardDescription>
                      </div>
                      <div className="bg-primary/10 text-primary rounded-md px-2 py-1 text-xs font-medium">
                        ID: {property.id}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground line-clamp-2" 
                      dangerouslySetInnerHTML={{__html: property._mssummary?.pt_BR || ''}}
                    />
                    {renderAmenities(property)}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/properties/${property.id}`}>Ver Detalhes</Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild>
                      <Link to={`/properties/${property.id}/reservations`}>Reservas</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPage;
