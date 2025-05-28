// Type definitions for the application

export interface Taxon {
  key: number; // GBIF ID
  scientificName: string;
  rank: string;
  status?: string;
  acceptedName?: string; // Added for synonym handling
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  canonicalName?: string;
}

export interface IdentificationMetadata {
  id: string;
  taxon: Taxon;
  identificationDate: string;
  observationDate?: string;
  location?: string;
  habitat?: string;
  collector?: string;
  identifier?: string;
  sampleCode?: string;
  notes?: string;
  confidence?: 'high' | 'medium' | 'low';
  method?: string;
  customFields: Record<string, string>;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[]; // For select type
  required?: boolean;
}