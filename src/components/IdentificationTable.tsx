import React from 'react';
import { useIdentification } from '../context/IdentificationContext';
import { format } from 'date-fns';
import { Download } from 'lucide-react';

const IdentificationTable: React.FC = () => {
  const { identifications, customFields } = useIdentification();

  const exportToCSV = () => {
    // Prepare headers
    const baseHeaders = ['Scientific Name', 'Identification Date', 'Observation Date', 'Location', 'Identifier', 'Method', 'Confidence', 'Notes'];
    const customFieldHeaders = customFields.map(field => field.label);
    const headers = [...baseHeaders, ...customFieldHeaders];

    // Prepare rows
    const rows = identifications.map(identification => {
      const baseData = [
        identification.taxon.scientificName,
        identification.identificationDate,
        identification.observationDate || '',
        identification.location || '',
        identification.identifier || '',
        identification.method || '',
        identification.confidence || '',
        identification.notes || ''
      ];

      const customFieldData = customFields.map(field => 
        identification.customFields[field.id] || ''
      );

      return [...baseData, ...customFieldData];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `insect-identifications-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (identifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No identifications recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Identification Records</h2>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scientific Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Identification Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Identifier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              {customFields.map(field => (
                <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {identifications.map((identification) => (
              <tr key={identification.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 italic">
                  {identification.taxon.scientificName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(identification.identificationDate), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {identification.location || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {identification.identifier || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {identification.method || '-'}
                </td>
                {customFields.map(field => (
                  <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {identification.customFields[field.id] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IdentificationTable;