import React, { useState } from 'react';
import { Taxon, CustomField } from '../types';
import TaxonSearch from './TaxonSearch';
import TaxonDisplay from './TaxonDisplay';
import RecentTaxa from './RecentTaxa';
import CustomFieldsEditor from './CustomFieldsEditor';
import { useIdentification } from '../context/IdentificationContext';
import { Save, Plus, X } from 'lucide-react';

const IdentificationForm: React.FC = () => {
  const { 
    currentIdentification, 
    updateCurrentIdentification, 
    addIdentification, 
    resetCurrentIdentification,
    customFields,
    recentTaxa,
    addToRecentTaxa
  } = useIdentification();
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showCustomFieldsEditor, setShowCustomFieldsEditor] = useState(false);

  const handleTaxonSelect = (taxon: Taxon) => {
    updateCurrentIdentification({ taxon });
    addToRecentTaxa(taxon);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateCurrentIdentification({ [name]: value });
  };

  const handleCustomFieldChange = (id: string, value: string) => {
    if (!currentIdentification) return;
    
    updateCurrentIdentification({
      customFields: {
        ...currentIdentification.customFields,
        [id]: value
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentIdentification?.taxon.key) {
      setMessage({ text: 'Please select a taxon first', type: 'error' });
      return;
    }

    // Check required fields
    const missingRequiredFields = customFields
      .filter(field => field.required)
      .filter(field => {
        const value = currentIdentification.customFields[field.id];
        return !value || value.trim() === '';
      });

    if (missingRequiredFields.length > 0) {
      setMessage({ 
        text: `Please fill in the required fields: ${missingRequiredFields.map(f => f.label).join(', ')}`, 
        type: 'error' 
      });
      return;
    }

    try {
      addIdentification(currentIdentification);
      resetCurrentIdentification();
      setMessage({ text: 'Identification saved successfully', type: 'success' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving identification:', error);
      setMessage({ text: 'Error saving identification', type: 'error' });
    }
  };

  if (!currentIdentification) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">New Identification</h2>
        <button
          type="button"
          onClick={() => setShowCustomFieldsEditor(!showCustomFieldsEditor)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {showCustomFieldsEditor ? (
            <>
              <X className="h-4 w-4 mr-1" /> Close Field Editor
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" /> Customize Fields
            </>
          )}
        </button>
      </div>

      {showCustomFieldsEditor ? (
        <CustomFieldsEditor onClose={() => setShowCustomFieldsEditor(false)} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Taxon Search Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search and Select Taxon
            </label>
            <TaxonSearch onSelect={handleTaxonSelect} placeholder="Start typing a scientific name..." />
            
            {recentTaxa.length > 0 && (
              <div className="mt-2">
                <RecentTaxa onSelect={handleTaxonSelect} />
              </div>
            )}
            
            {currentIdentification.taxon.key && (
              <div className="mt-4">
                <TaxonDisplay taxon={currentIdentification.taxon} />
              </div>
            )}
          </div>

          {/* Basic Identification Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="identificationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Identification Date
              </label>
              <input
                type="date"
                id="identificationDate"
                name="identificationDate"
                value={currentIdentification.identificationDate}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="observationDate" className="block text-sm font-medium text-gray-700 mb-1">
                Observation Date
              </label>
              <input
                type="date"
                id="observationDate"
                name="observationDate"
                value={currentIdentification.observationDate || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={currentIdentification.location || ''}
                onChange={handleInputChange}
                placeholder="e.g., Central Park, New York"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                Identifier
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={currentIdentification.identifier || ''}
                onChange={handleInputChange}
                placeholder="Your name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
                Confidence Level
              </label>
              <select
                id="confidence"
                name="confidence"
                value={currentIdentification.confidence || ''}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select confidence level</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                Identification Method
              </label>
              <input
                type="text"
                id="method"
                name="method"
                value={currentIdentification.method || ''}
                onChange={handleInputChange}
                placeholder="e.g., Morphological, DNA barcoding"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Custom Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customFields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        id={field.id}
                        value={currentIdentification.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required={field.required}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        value={currentIdentification.customFields[field.id] || ''}
                        onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={currentIdentification.notes || ''}
              onChange={handleInputChange}
              placeholder="Additional observations or notes"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Status Message */}
          {message && (
            <div className={`rounded-md p-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message.text}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Identification
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default IdentificationForm;