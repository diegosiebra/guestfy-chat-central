
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Create schema for form validation
const companyFormSchema = z.object({
  name: z.string().min(2, { message: "Company name must be at least 2 characters" }).max(50),
  logo: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

const CreateCompanyPage: React.FC = () => {
  const { user, createCompany } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      logo: ""
    },
  });

  // Go to company selection if user already has companies
  React.useEffect(() => {
    if (user?.companies.length === 2) {
      toast({
        title: "Company limit reached",
        description: "You can only create up to 2 companies.",
        variant: "destructive"
      });
      navigate("/select-company");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  async function onSubmit(data: CompanyFormValues) {
    setIsSubmitting(true);
    try {
      await createCompany(data.name, data.logo || undefined);
    } catch (error) {
      console.error("Failed to create company:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const remainingCompanies = 2 - (user?.companies.length || 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Guestfy</h1>
          <p className="text-gray-600">AI-Powered Guest Management Platform</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create a Company</CardTitle>
            <CardDescription>
              Set up your company to manage with Guestfy
              {remainingCompanies < 2 && (
                <div className="mt-2 text-amber-600 font-medium">
                  You can create {remainingCompanies} more company
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter logo URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-3 py-2">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your company will be used to organize your properties and reservations.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                {user.companies.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/select-company")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Company
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateCompanyPage;
