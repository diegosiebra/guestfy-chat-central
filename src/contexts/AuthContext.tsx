
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define types for our context
export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  companies: Company[];
}

interface AuthContextType {
  user: User | null;
  selectedCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectCompany: (company: Company) => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  selectedCompany: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  selectCompany: () => {},
});

// Mock data for development
const MOCK_USER: User = {
  id: "1",
  name: "Guest Manager",
  email: "manager@guestfy.com",
  companies: [
    {
      id: "1",
      name: "Seaside Rentals",
      logo: "https://placehold.co/400x400/9b87f5/ffffff?text=SR",
    },
    {
      id: "2",
      name: "Mountain Retreats",
      logo: "https://placehold.co/400x400/7E69AB/ffffff?text=MR",
    },
    {
      id: "3",
      name: "City Apartments",
      logo: "https://placehold.co/400x400/1A1F2C/ffffff?text=CA",
    },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCompany = localStorage.getItem("selectedCompany");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      
      if (storedCompany) {
        setSelectedCompany(JSON.parse(storedCompany));
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function - would connect to your authentication API in production
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials (in a real app, this would be done server-side)
      if (email !== "manager@guestfy.com" || password !== "password") {
        throw new Error("Invalid credentials");
      }
      
      // Set the authenticated user
      setUser(MOCK_USER);
      localStorage.setItem("user", JSON.stringify(MOCK_USER));
      
      // Navigate to company selection if user has multiple companies
      if (MOCK_USER.companies.length > 1) {
        navigate("/select-company");
      } else if (MOCK_USER.companies.length === 1) {
        // Auto-select the only company
        const company = MOCK_USER.companies[0];
        setSelectedCompany(company);
        localStorage.setItem("selectedCompany", JSON.stringify(company));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setSelectedCompany(null);
    localStorage.removeItem("user");
    localStorage.removeItem("selectedCompany");
    navigate("/login");
  };

  // Select company function
  const selectCompany = (company: Company) => {
    setSelectedCompany(company);
    localStorage.setItem("selectedCompany", JSON.stringify(company));
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedCompany,
        isAuthenticated: !!user && !!selectedCompany,
        isLoading,
        login,
        logout,
        selectCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
