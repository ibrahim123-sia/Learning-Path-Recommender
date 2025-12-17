import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  
  // Create axios instance
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || 'https://learning-path-recommender.vercel.app/',
    timeout: 30000,
  });

  return (
    <AppContext.Provider value={{
      loading,
      setLoading,
      axios: axiosInstance
    }}>
      {children}
    </AppContext.Provider>
  );
};