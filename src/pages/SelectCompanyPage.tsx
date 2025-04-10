
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building } from "lucide-react";

const SelectCompanyPage: React.FC = () => {
  const { user, selectCompany } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Guestfy</h1>
          <p className="text-gray-600">AI-Powered Guest Management Platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Company</CardTitle>
            <CardDescription>
              Choose a company to manage
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
        </Card>
      </div>
    </div>
  );
};

export default SelectCompanyPage;
