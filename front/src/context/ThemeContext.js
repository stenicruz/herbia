import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme(); // Pega o tema do sistema (Android/iOS)
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  // Função para alternar o tema manualmente
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar o tema facilmente em qualquer tela
export const useTheme = () => useContext(ThemeContext);