// Service for interacting with the GBIF API

const GBIF_BASE_URL = 'https://api.gbif.org/v1';

/**
 * Searches for taxa based on a query string
 * @param query The search query
 * @returns Promise with search results
 */
export const searchTaxa = async (query: string): Promise<any[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const response = await fetch(
      `${GBIF_BASE_URL}/species/suggest?q=${encodeURIComponent(query)}&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch taxa from GBIF');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching taxa:', error);
    return [];
  }
};

/**
 * Gets detailed information about a taxon by its GBIF ID
 * @param taxonKey The GBIF taxon key (ID)
 * @returns Promise with detailed taxon data
 */
export const getTaxonDetails = async (taxonKey: number): Promise<any> => {
  try {
    const response = await fetch(`${GBIF_BASE_URL}/species/${taxonKey}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch taxon details');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching taxon details:', error);
    throw error;
  }
};

/**
 * Generates a link to the GBIF species page
 * @param taxonKey The GBIF taxon key
 * @returns URL to the GBIF species page
 */
export const getGbifSpeciesPageUrl = (taxonKey: number): string => {
  return `https://www.gbif.org/species/${taxonKey}`;
};