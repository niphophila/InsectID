import React from 'react';
import { Bug } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bug className="h-8 w-8 text-amber-300" />
          <div>
            <h1 className="text-xl font-bold leading-tight">InsectID</h1>
            <p className="text-xs text-green-200">Entomological Identification System</p>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="https://www.gbif.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-green-100 hover:text-white transition-colors"
              >
                GBIF Data
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="text-sm text-green-100 hover:text-white transition-colors"
              >
                Documentation
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;