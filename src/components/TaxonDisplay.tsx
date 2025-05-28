import React from 'react';
import { Taxon } from '../types';
import { getGbifSpeciesPageUrl } from '../services/gbifService';
import { ExternalLink } from 'lucide-react';

interface TaxonDisplayProps {
  taxon: Taxon;
}

const TaxonDisplay: React.FC<TaxonDisplayProps> = ({ taxon }) => {
  if (!taxon || !taxon.key) {
    return null;
  }

  const gbifUrl = getGbifSpeciesPageUrl(taxon.key);

  // Helper function to render taxonomy hierarchy
  const renderTaxonomyHierarchy = () => {
    const taxonomyLevels = [
      { label: 'Kingdom', value: taxon.kingdom },
      { label: 'Phylum', value: taxon.phylum },
      { label: 'Class', value: taxon.class },
      { label: 'Order', value: taxon.order },
      { label: 'Family', value: taxon.family },
      { label: 'Genus', value: taxon.genus },
      { label: 'Species', value: taxon.species }
    ].filter(level => level.value); // Filter out empty levels
    
    if (taxonomyLevels.length === 0) return null;
    
    return (
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
        {taxonomyLevels.map(level => (
          <div key={level.label}>
            <span className="text-gray-500">{level.label}: </span>
            <span className="font-medium">{level.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold italic">{taxon.scientificName}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {taxon.rank}
            </span>
            {taxon.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {taxon.status}
              </span>
            )}
          </div>
        </div>
        <a 
          href={gbifUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-green-700 hover:text-green-800 transition-colors text-sm"
        >
          View on GBIF <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
      
      {renderTaxonomyHierarchy()}
      
      <div className="mt-3 text-sm text-gray-500">
        <span>GBIF ID: </span>
        <span className="font-mono">{taxon.key}</span>
      </div>
    </div>
  );
};

export default TaxonDisplay;