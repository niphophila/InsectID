import React, { useState } from 'react';
import { IdentificationProvider } from './context/IdentificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import IdentificationForm from './components/IdentificationForm';
import IdentificationHistory from './components/IdentificationHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/Tabs';
import { FileText, History } from 'lucide-react';

function App() {
  return (
    <IdentificationProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="new" className="mb-8">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="new" className="flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  New Identification
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center justify-center">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="new">
                <IdentificationForm />
              </TabsContent>
              
              <TabsContent value="history">
                <IdentificationHistory />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </IdentificationProvider>
  );
}

export default App;