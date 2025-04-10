
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ReservationsPage from "./pages/ReservationsPage";
import ChatsPage from "./pages/ChatsPage";
import AgentsPage from "./pages/AgentsPage";
import KnowledgeBasePage from "./pages/KnowledgeBasePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SelectCompanyPage from "./pages/SelectCompanyPage";
import CreateCompanyPage from "./pages/CreateCompanyPage";

// Criar uma nova instância de QueryClient
const queryClient = new QueryClient();

const App = () => (
  // Garantir que QueryClientProvider seja o wrapper mais externo
  <QueryClientProvider client={queryClient}>
    {/* Em seguida, o TooltipProvider */}
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas semi-protegidas (requer autenticação, mas não empresa) */}
            <Route 
              path="/select-company" 
              element={
                <ProtectedRoute requireCompany={false}>
                  <SelectCompanyPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/create-company" 
              element={
                <ProtectedRoute requireCompany={false}>
                  <CreateCompanyPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas protegidas (requerem autenticação e empresa) */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Index />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/chats" element={<ChatsPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
