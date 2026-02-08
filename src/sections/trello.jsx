import { useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import TrelloDashboard from "../components/trello/TrelloDashboard";
import ErrorBoundary from "../components/ErrorBoundary";

const Trello = () => {
  const header = "TRELLO";
  const [showBanner, setShowBanner] = useState(true);

  return (
    <ErrorBoundary>
      <div className="flex w-full min-h-screen bg-gray-100 dark:bg-brand-dark">
        {/* Dashboard lateral */}
        <Dashboard />
        
        {/* Contenido principal - SIN overflow aquí */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Navbar */}
          <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
            <div className="container">
              <Navbar header={header} />
            </div>
          </section>
          
          {/* Banner */}
          {showBanner && (
            <div className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 flex flex-col md:flex-row justify-between items-center shadow-md mx-8 mt-8 rounded-lg">
              <div className="flex items-center mb-2 md:mb-0">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold">Connect your Trello account to sync boards and manage tasks with students.</p>
              </div>
              <button 
                onClick={() => setShowBanner(false)} 
                className="text-xl font-bold hover:text-blue-900 dark:hover:text-blue-100"
              >
                &times;
              </button>
            </div>
          )}
          
          {/* Contenido Trello - CON overflow controlado */}
          <div className="flex-1 p-8">
            <TrelloDashboard />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Trello;