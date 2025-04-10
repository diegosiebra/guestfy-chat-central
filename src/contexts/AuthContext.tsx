
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  createCompany: (name: string, logo?: string) => Promise<void>;
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
  createCompany: async () => {},
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
      
      // For testing, let's use an empty companies array to allow creation
      const testUser = {
        ...MOCK_USER,
        companies: []
      };
      
      // Set the authenticated user
      setUser(testUser);
      localStorage.setItem("user", JSON.stringify(testUser));
      
      // Navigate to company creation if user has no companies
      if (testUser.companies.length === 0) {
        navigate("/create-company");
      } else if (testUser.companies.length === 1) {
        // Auto-select the only company
        const company = testUser.companies[0];
        setSelectedCompany(company);
        localStorage.setItem("selectedCompany", JSON.stringify(company));
        navigate("/");
      } else {
        // Navigate to company selection if user has multiple companies
        navigate("/select-company");
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

  // Create company function
  const createCompany = async (name: string, logo?: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (user.companies.length >= 2) {
      toast({
        title: "Company limit reached",
        description: "You can only create up to 2 companies.",
        variant: "destructive"
      });
      throw new Error("You can only create up to 2 companies");
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new company with a unique ID
      const newCompany: Company = {
        id: Date.now().toString(),
        name,
        logo
      };

      // Update user's companies
      const updatedUser = {
        ...user,
        companies: [...user.companies, newCompany]
      };

      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // If this is the first company, auto-select it
      if (updatedUser.companies.length === 1) {
        setSelectedCompany(newCompany);
        localStorage.setItem("selectedCompany", JSON.stringify(newCompany));
      }

      toast({
        title: "Company created",
        description: `${name} has been successfully created.`
      });

      // Navigate appropriately
      if (updatedUser.companies.length === 1) {
        navigate("/");
      } else {
        navigate("/select-company");
      }
    } catch (error) {
      console.error("Company creation failed:", error);
      throw error;
    }
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
        createCompany,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
