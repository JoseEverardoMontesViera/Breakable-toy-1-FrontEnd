import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context
interface SearchContextProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: any;
  setCategory: (value: any) => void;
  available: string;
  setAvailable: (value: string) => void;
  categories: any[];
  onSearch: () => void;
}

// Create the context
const SearchContext = createContext<SearchContextProps | undefined>(undefined);

// Provider component
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<any>(null);
  const [available, setAvailable] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);

  const onSearch = () => {
    const searchData = {
      searchTerm,
      category,
      available,
    };
    console.log('Search Data:', searchData);
    // Add your search logic here
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        category,
        setCategory,
        available,
        setAvailable,
        categories,
        onSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for consuming the context
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};