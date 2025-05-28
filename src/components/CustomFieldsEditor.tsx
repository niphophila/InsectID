import React, { useState } from 'react';
import { useIdentification } from '../context/IdentificationContext';
import { CustomField } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface CustomFieldsEditorProps {
  onClose: () => void;
}

const CustomFieldsEditor: React.FC<CustomFieldsEditorProps> = ({ onClose }) => {
  const { customFields, addCustomField, removeCustomField } = useIdentification();
  
  const [newField, setNewField] = useState<Omit<CustomField, 'id'>>({
    label: '',
    type: 'text',
    required: false,
    options: [],
  });
  
  const [newOption, setNewOption] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    setNewField(prev => ({
      ...prev,
      options: [...(prev.options || []), newOption.trim()],
    }));
    setNewOption('');
  };

  const handleRemoveOption = (option: string) => {
    setNewField(prev => ({
      ...prev,
      options: (prev.options || []).filter(o => o !== option),
    }));
  };

  const validateField = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newField.label.trim()) {
      newErrors.label = 'Label is required';
    }
    
    if (newField.type === 'select' && (!newField.options || newField.options.length === 0)) {
      newErrors.options = 'Select fields require at least one option';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddField = () => {
    if (!validateField()) return;
    
    addCustomField(newField);
    setNewField({
      label: '',
      type: 'text',
      required: false,
      options: [],
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Fields Editor</h3>
      
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-800 mb-2">Current Custom Fields</h4>
        {customFields.length === 0 ? (
          <p className="text-gray-500 italic">No custom fields defined yet.</p>
        ) : (
          <ul className="space-y-2">
            {customFields.map((field) => (
              <li key={field.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div>
                  <span className="font-medium">{field.label}</span>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="mr-2">Type: {field.type}</span>
                    {field.required && <span className="text-green-700">Required</span>}
                    {field.type === 'select' && field.options && (
                      <div className="mt-1">
                        Options: {field.options.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeCustomField(field.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-md font-medium text-gray-800 mb-3">Add New Field</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="fieldLabel" className="block text-sm font-medium text-gray-700 mb-1">
              Field Label
            </label>
            <input
              type="text"
              id="fieldLabel"
              value={newField.label}
              onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
              className={`block w-full rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 
                ${errors.label ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="e.g., Collection Method"
            />
            {errors.label && <p className="mt-1 text-sm text-red-600">{errors.label}</p>}
          </div>
          
          <div>
            <label htmlFor="fieldType" className="block text-sm font-medium text-gray-700 mb-1">
              Field Type
            </label>
            <select
              id="fieldType"
              value={newField.type}
              onChange={(e) => setNewField(prev => ({ 
                ...prev, 
                type: e.target.value as CustomField['type'],
                options: e.target.value === 'select' ? prev.options : [] 
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Select (Dropdown)</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="fieldRequired"
              checked={newField.required}
              onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="fieldRequired" className="ml-2 block text-sm text-gray-700">
              Required field
            </label>
          </div>
        </div>
        
        {newField.type === 'select' && (
          <div className="mb-4">
            <label htmlFor="fieldOptions" className="block text-sm font-medium text-gray-700 mb-1">
              Options
            </label>
            <div className="flex">
              <input
                type="text"
                id="fieldOptions"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Add an option"
              />
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {errors.options && <p className="mt-1 text-sm text-red-600">{errors.options}</p>}
            
            {newField.options && newField.options.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {newField.options.map((option, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                      <span className="text-sm text-gray-700">{option}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleAddField}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Field
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomFieldsEditor;