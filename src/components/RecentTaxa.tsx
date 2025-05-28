import React from 'react';
import { useIdentification } from '../context/IdentificationContext';
import { Taxon } from '../types';
import { History } from 'lucide-react';

interface RecentTaxaProps {
  onSelect: (taxon: Taxon) => void;
}

const RecentTaxa: React.FC<RecentTaxaProps> = ({ onSelect }) => {
  const { recentTaxa } = useIdentification();

  if (recentTaxa.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        <History className="h-4 w-4 text-gray-500 mr-1" />
        <h3 className="text-sm font-medium text-gray-600">Recent Taxa</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentTaxa.map(taxon => (
          <button
            key={taxon.key}
            type="button"
            onClick={() => onSelect(taxon)}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <span className="italic">{taxon.scientificName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentTaxa;