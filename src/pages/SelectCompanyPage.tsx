
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SelectCompanyPage: React.FC = () => {
  const { user, selectCompany } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const canCreateMoreCompanies = user.companies.length < 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Guestfy</h1>
          <p className="text-gray-600">Plataforma de Gerenciamento de Hóspedes com IA</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Empresa</CardTitle>
            <CardDescription>
              Escolha uma empresa para gerenciar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => selectCompany(company)}
                  className="w-full flex items-center p-3 rounded-md hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {company.logo ? (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={company.logo} alt={company.name} />
                      <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div className="ml-4 text-left">
                    <div className="font-medium">{company.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {canCreateMoreCompanies && (
              <Button 
                onClick={() => navigate("/create-company")} 
                variant="outline"
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Nova Empresa
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SelectCompanyPage;
