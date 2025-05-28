import React, { useState } from 'react';
import { useIdentification } from '../context/IdentificationContext';
import TaxonDisplay from './TaxonDisplay';
import IdentificationTable from './IdentificationTable';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, FileText, Calendar, MapPin, User, Table, List } from 'lucide-react';

const IdentificationHistory: React.FC = () => {
  const { identifications } = useIdentification();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');

  const toggleExpand = (id: string) => {
    const newExpandedIds = new Set(expandedIds);
    if (newExpandedIds.has(id)) {
      newExpandedIds.delete(id);
    } else {
      newExpandedIds.add(id);
    }
    setExpandedIds(newExpandedIds);
  };

  if (identifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No identifications recorded yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
              viewMode === 'list'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
              viewMode === 'table'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Table className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <IdentificationTable />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Identification History</h2>
          <div className="space-y-4">
            {identifications.map((identification) => {
              const isExpanded = expandedIds.has(identification.id);
              
              const identificationDate = identification.identificationDate 
                ? format(new Date(identification.identificationDate), 'MMMM d, yyyy') 
                : 'Unknown date';
                
              const observationDate = identification.observationDate 
                ? format(new Date(identification.observationDate), 'MMMM d, yyyy') 
                : null;
                
              return (
                <div key={identification.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleExpand(identification.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-700" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 italic">
                          {identification.taxon.scientificName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Identified on {identificationDate}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="mb-4">
                        <TaxonDisplay taxon={identification.taxon} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {observationDate && (
                          <div className="flex items-start">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Observation Date</h4>
                              <p className="text-sm text-gray-900">{observationDate}</p>
                            </div>
                          </div>
                        )}
                        
                        {identification.location && (
                          <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Location</h4>
                              <p className="text-sm text-gray-900">{identification.location}</p>
                            </div>
                          </div>
                        )}
                        
                        {identification.identifier && (
                          <div className="flex items-start">
                            <User className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Identifier</h4>
                              <p className="text-sm text-gray-900">{identification.identifier}</p>
                            </div>
                          </div>
                        )}
                        
                        {identification.method && (
                          <div className="flex items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Method</h4>
                              <p className="text-sm text-gray-900">{identification.method}</p>
                            </div>
                          </div>
                        )}
                        
                        {identification.confidence && (
                          <div className="flex items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700">Confidence</h4>
                              <p className="text-sm text-gray-900 capitalize">{identification.confidence}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Custom Fields */}
                      {Object.keys(identification.customFields).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Fields</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(identification.customFields).map(([fieldId, value]) => (
                              <div key={fieldId}>
                                <h5 className="text-xs font-medium text-gray-500">
                                  {fieldId.replace('field-', 'Field ')}
                                </h5>
                                <p className="text-sm text-gray-900">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Notes */}
                      {identification.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                          <p className="text-sm text-gray-900 whitespace-pre-line">{identification.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentificationHistory;