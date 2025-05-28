import React, { useState, useEffect, useRef } from 'react';
import { searchTaxa } from '../services/gbifService';
import { Taxon } from '../types';
import { Search, Loader2, ArrowRight } from 'lucide-react';

interface TaxonSearchProps {
  onSelect: (taxon: Taxon) => void;
  placeholder?: string;
}

const TaxonSearch: React.FC<TaxonSearchProps> = ({ 
  onSelect, 
  placeholder = 'Search for a taxon...' 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Taxon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      const data = await searchTaxa(query);
      setResults(data);
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) && 
          resultsRef.current && !resultsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (taxon: Taxon) => {
    onSelect(taxon);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
    }
    else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    }
    else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'synonym':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <ul 
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-80 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm transition-all duration-200 ease-in-out"
        >
          {results.map((taxon, index) => (
            <li
              key={taxon.key}
              onClick={() => handleSelect(taxon)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                index === highlightedIndex
                  ? 'bg-green-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium italic">{taxon.scientificName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(taxon.status)}`}>
                    {taxon.status || 'Unknown'}
                  </span>
                </div>
                
                {taxon.status?.toLowerCase() === 'synonym' && taxon.acceptedName && (
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    <span className="italic">{taxon.acceptedName}</span>
                  </div>
                )}
                
                <span className="text-sm text-gray-500 mt-1">
                  {taxon.rank}{taxon.kingdom ? ` • ${taxon.kingdom}` : ''}
                  {taxon.family ? ` • ${taxon.family}` : ''}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-3 text-sm text-gray-700">
          No results found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default TaxonSearch;