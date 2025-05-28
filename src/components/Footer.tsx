import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} InsectID - Entomological Identification System
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Powered by GBIF (Global Biodiversity Information Facility) API
            </p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://www.gbif.org/developer/summary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-green-700 transition-colors"
            >
              GBIF API
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-green-700 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-500 hover:text-green-700 transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;