import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme(); // Tema do Android/iOS
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  const [loading, setLoading] = useState(true); // Evita o "flash" branco ao abrir

  // 1. Carregar a preferência salva ao abrir o App
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@herbia_theme');
        
        if (savedTheme !== null) {
          // Se existir algo salvo ('dark' ou 'light'), ignora o sistema e usa o salvo
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // Se não houver nada salvo (primeira vez), segue o sistema
          setIsDarkMode(deviceTheme === 'dark');
        }
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedTheme();
  }, [deviceTheme]); // Monitora se o usuário mudar o tema do sistema nas configs do Android/iOS

  // 2. Função para alternar e SALVAR no disco
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      
      // Salva a string 'dark' ou 'light' no celular
      await AsyncStorage.setItem('@herbia_theme', newMode ? 'dark' : 'light');

      await NavigationBar.setBackgroundColorAsync(newMode ? '#010501' : '#ffffff');
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);