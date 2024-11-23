import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "../components/ui/use-toast";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareSchools, setCompareSchools] = useState([]);
  const { toast } = useToast();

  // Load compared schools from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('compareSchools');
    if (saved) {
      setCompareSchools(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('compareSchools', JSON.stringify(compareSchools));
  }, [compareSchools]);

  const addToCompare = (school) => {
    if (compareSchools.length >= 3) {
      toast({
        title: "Compare limit reached",
        description: "You can compare up to 3 schools at a time",
        variant: "destructive",
      });
      return;
    }
    setCompareSchools([...compareSchools, school]);
    toast({
      title: "School added to compare",
      description: "Visit the compare page to see the comparison",
    });
  };

  const removeFromCompare = (schoolId) => {
    setCompareSchools(compareSchools.filter(s => s._id !== schoolId));
    toast({
      title: "School removed from compare",
    });
  };

  const isInCompare = (schoolId) => {
    return compareSchools.some(s => s._id === schoolId);
  };

  const clearCompare = () => {
    setCompareSchools([]);
  };

  return (
    <CompareContext.Provider value={{
      compareSchools,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompareSchools = () => useContext(CompareContext);