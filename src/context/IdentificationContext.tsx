import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IdentificationMetadata, CustomField, Taxon } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface IdentificationContextType {
  identifications: IdentificationMetadata[];
  currentIdentification: IdentificationMetadata | null;
  customFields: CustomField[];
  recentTaxa: Taxon[];
  addIdentification: (identification: Omit<IdentificationMetadata, 'id'>) => void;
  updateCurrentIdentification: (data: Partial<IdentificationMetadata>) => void;
  setCurrentIdentification: (identification: IdentificationMetadata | null) => void;
  resetCurrentIdentification: () => void;
  addCustomField: (field: Omit<CustomField, 'id'>) => void;
  removeCustomField: (id: string) => void;
  addToRecentTaxa: (taxon: Taxon) => void;
}

const defaultCustomFields: CustomField[] = [
  { id: 'field-1', label: 'Sample Code', type: 'text', required: true },
  { id: 'field-2', label: 'Collection Method', type: 'select', options: ['Net', 'Trap', 'Hand Collection', 'Light Trap', 'Other'], required: false },
  { id: 'field-3', label: 'Preservation Method', type: 'select', options: ['Pinned', 'Alcohol', 'Slide Mount', 'Other'], required: false },
];

const createEmptyIdentification = (): IdentificationMetadata => ({
  id: uuidv4(),
  taxon: {} as Taxon,
  identificationDate: new Date().toISOString().split('T')[0],
  customFields: {},
});

const IdentificationContext = createContext<IdentificationContextType | undefined>(undefined);

export const IdentificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [identifications, setIdentifications] = useState<IdentificationMetadata[]>([]);
  const [currentIdentification, setCurrentIdentification] = useState<IdentificationMetadata | null>(createEmptyIdentification());
  const [customFields, setCustomFields] = useState<CustomField[]>(defaultCustomFields);
  const [recentTaxa, setRecentTaxa] = useState<Taxon[]>([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedIdentifications = localStorage.getItem('identifications');
    const savedCustomFields = localStorage.getItem('customFields');
    const savedRecentTaxa = localStorage.getItem('recentTaxa');

    if (savedIdentifications) {
      setIdentifications(JSON.parse(savedIdentifications));
    }
    
    if (savedCustomFields) {
      setCustomFields(JSON.parse(savedCustomFields));
    }
    
    if (savedRecentTaxa) {
      setRecentTaxa(JSON.parse(savedRecentTaxa));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('identifications', JSON.stringify(identifications));
  }, [identifications]);

  useEffect(() => {
    localStorage.setItem('customFields', JSON.stringify(customFields));
  }, [customFields]);

  useEffect(() => {
    localStorage.setItem('recentTaxa', JSON.stringify(recentTaxa));
  }, [recentTaxa]);

  const addIdentification = (identification: Omit<IdentificationMetadata, 'id'>) => {
    const newIdentification = {
      ...identification,
      id: uuidv4(),
    };
    setIdentifications(prev => [newIdentification, ...prev]);
    return newIdentification;
  };

  const updateCurrentIdentification = (data: Partial<IdentificationMetadata>) => {
    if (!currentIdentification) return;
    
    setCurrentIdentification({
      ...currentIdentification,
      ...data,
    });
  };

  const resetCurrentIdentification = () => {
    setCurrentIdentification(createEmptyIdentification());
  };

  const addCustomField = (field: Omit<CustomField, 'id'>) => {
    const newField = {
      ...field,
      id: uuidv4(),
    };
    setCustomFields(prev => [...prev, newField]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== id));
  };

  const addToRecentTaxa = (taxon: Taxon) => {
    setRecentTaxa(prev => {
      // Check if taxon already exists
      const exists = prev.some(t => t.key === taxon.key);
      if (exists) {
        // Move it to the front
        return [taxon, ...prev.filter(t => t.key !== taxon.key)].slice(0, 10);
      }
      // Add new taxon and limit to 10
      return [taxon, ...prev].slice(0, 10);
    });
  };

  return (
    <IdentificationContext.Provider
      value={{
        identifications,
        currentIdentification,
        customFields,
        recentTaxa,
        addIdentification,
        updateCurrentIdentification,
        setCurrentIdentification,
        resetCurrentIdentification,
        addCustomField,
        removeCustomField,
        addToRecentTaxa,
      }}
    >
      {children}
    </IdentificationContext.Provider>
  );
};

export const useIdentification = () => {
  const context = useContext(IdentificationContext);
  if (context === undefined) {
    throw new Error('useIdentification must be used within an IdentificationProvider');
  }
  return context;
};