
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bed, 
  Bath, 
  Users, 
  MapPin, 
  Home, 
  Phone, 
  Building, 
  ArrowLeft,
  Images,
  Info,
  FileText,
  Map,
  CalendarDays
} from "lucide-react";
import { Property } from "@/types/propertyTypes";
import { fetchPropertyById } from "@/services/propertyService";

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await fetchPropertyById(id);
          setProperty(data);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes da propriedade:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando detalhes da propriedade...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg mb-4">Propriedade não encontrada</p>
        <Button asChild>
          <Link to="/properties">Voltar para Propriedades</Link>
        </Button>
      </div>
    );
  }

  const mainImage = property._t_mainImageMeta.url;
  const allImages = property._t_imagesMeta.map(img => ({
    url: img.url,
    title: img._msname?.pt_BR || 'Imagem'
  }));

  const renderAddress = () => (
    <div className="flex flex-col space-y-1">
      <p>
        {property.address.street}, {property.address.streetNumber}
        {property.address.additional && `, ${property.address.additional}`}
      </p>
      <p>{property.address.region}, {property.address.city}</p>
      <p>{property.address.state} - {property.address.stateCode}, {property.address.zip}</p>
      <p>{property.address.countryCode}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild className="h-8 w-8">
              <Link to="/properties">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{property._mstitle.pt_BR}</h1>
          </div>
          <div className="text-muted-foreground flex items-center mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            {property.address.region}, {property.address.city} - {property.address.stateCode}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/properties/${property.id}/reservations`}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Reservas
            </Link>
          </Button>
          <Button>
            <Map className="mr-2 h-4 w-4" />
            Ver no Mapa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Imagem Principal */}
        <div className="md:col-span-2">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <img 
              src={allImages[activeImageIndex]?.url || mainImage} 
              alt={property._mstitle.pt_BR} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Miniaturas */}
          <div className="grid grid-cols-5 gap-2 mt-2">
            {allImages.slice(0, 5).map((image, index) => (
              <div 
                key={index} 
                className={`aspect-square rounded-md overflow-hidden cursor-pointer ${index === activeImageIndex ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {allImages.length > 5 && (
            <div className="mt-2">
              <Button variant="outline" size="sm">
                <Images className="mr-2 h-4 w-4" />
                Ver todas as {allImages.length} fotos
              </Button>
            </div>
          )}
        </div>

        {/* Informações da propriedade */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalhes da Propriedade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo</p>
                    <p className="font-medium">
                      {property._t_propertyTypeMeta?._mstitle?.pt_BR || 'Prédio'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Subtipo</p>
                    <p className="font-medium">
                      {property._t_typeMeta?._mstitle?.pt_BR || 'Suíte'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Quartos</p>
                    <p className="font-medium">{property._i_rooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Banheiros</p>
                    <p className="font-medium">{property._f_bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hóspedes</p>
                    <p className="font-medium">Até {property._i_maxGuests}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium inline-block
                      ${property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {property.status === 'active' ? 'Ativo' : 'Inativo'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Proprietário</p>
                <p className="font-medium">{property.owner.name}</p>
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                  <a href={`tel:${property.owner.phones[0]?.iso}`} className="text-sm hover:underline">
                    {property.owner.phones[0]?.iso}
                  </a>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">ID no Stay.net</p>
                <p className="font-medium">{property.id}</p>
                <p className="text-xs text-muted-foreground mt-1">ID Interno: {property.internalName}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Abas de conteúdo */}
      <Tabs defaultValue="description" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="location">Localização</TabsTrigger>
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="amenities">Comodidades</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Descrição da Propriedade</CardTitle>
              <CardDescription>
                Detalhes completos sobre o imóvel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: property._msdesc.pt_BR }} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="location" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
              <CardDescription>
                Endereço e informações de localização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderAddress()}
              
              {property.latLng && (
                <div className="mt-4 bg-muted h-48 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Mapa carregará aqui</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lat: {property.latLng._f_lat}, Lng: {property.latLng._f_lng}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras da Casa</CardTitle>
              <CardDescription>
                Regulamentos e políticas da propriedade
              </CardDescription>
            </CardHeader>
            <CardContent>
              {property._mshouserules?.pt_BR ? (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: property._mshouserules.pt_BR }} />
              ) : (
                <p className="text-muted-foreground">Nenhuma regra específica foi definida para esta propriedade.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="amenities" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Comodidades</CardTitle>
              <CardDescription>
                Características e facilidades disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Esta propriedade possui {property.amenities.length} comodidades registradas.
              </p>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Para visualizar a lista completa de comodidades, é necessário configurar o mapeamento de IDs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PropertyDetailsPage;
