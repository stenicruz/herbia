import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, History, Camera, User, LayoutDashboard, Users, Leaf } from 'lucide-react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';

export const BottomTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const [isGuest, setIsGuest] = useState(true);

  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  const activeColor = THEME.primary;
  const inactiveColor = isDarkMode ? '#969494' : '#999';

// Verificar se é convidado sempre que o componente montar ou mudar de aba
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('@Herbia:token');
      setIsGuest(!token);
    };
    checkAuth();
  }, [state.index]); // Re-verifica quando muda de aba

  const screenConfigs = {
    Home: { label: 'Casa', icon: Home },
    History: { label: 'Histórico', icon: History },
    CameraScanner: { label: 'Câmera', icon: Camera },
    Profile: { label: 'Perfil', icon: User },
    AdminHome: { label: 'Painel', icon: LayoutDashboard },
    UserManagement: { label: 'Usuários', icon: Users },
    Plant: { label: 'Plantas', icon: Leaf },
  };

  const tabs = state.routes;
  const isAdminFlow = tabs[0]?.name === 'AdminHome';

  return (
    <View style={[
      styles.tabBar, 
      { 
        backgroundColor: currentTheme.background,
        borderTopColor: isDarkMode ? '#121411' : '#F2F2F2',
        paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 16 
      }
    ]}>
      
      {!isAdminFlow ? (
        /* --- LAYOUT USUÁRIO (Câmera flutuante no meio) --- */
        <>
          {/* --- ABAS ANTES DA CÂMERA --- */}
          {tabs.slice(0, 2).map((route, index) => {
            if (isGuest && route.name === 'History') return null;
            const isFocused = state.index === index;
            const config = screenConfigs[route.name] || { label: route.name, icon: Home };
            const Icon = config.icon;
            return (
              <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => navigation.navigate(route.name)}>
                <Icon 
                  color={isFocused ? activeColor : inactiveColor} 
                  size={26} 
                  fill={isFocused && route.name !== 'History' ? activeColor : 'none'} 
                />
                <Text style={[styles.tabLabel, { color: isFocused ? activeColor : inactiveColor }]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity 
              style={[
                styles.cameraTabBtn
              ]} 
              onPress={() => navigation.navigate('CameraScanner')} 
              activeOpacity={0.8}
            >
              <Camera style={[
                {marginBottom:2}
              ]} color={inactiveColor} size={32} fill={isDarkMode ? "#121411" : "#fff"}/>
              <Text style={[styles.tabLabel, {marginTop:1},{ color: inactiveColor }]}>Câmera</Text>
            </TouchableOpacity>
            
          {/* --- ABAS DEPOIS DA CÂMERA (Perfil) --- */}
          {tabs.slice(2).map((route, index) => {
            const isFocused = state.index === index + 2;
            const config = screenConfigs[route.name] || { label: route.name, icon: User };
            const Icon = config.icon;
            return (
              <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => navigation.navigate(route.name)}>
                <Icon 
                  color={isFocused ? activeColor : inactiveColor} 
                  size={26} 
                  fill={isFocused ? activeColor : 'none'} 
                />
                <Text style={[styles.tabLabel, { color: isFocused ? activeColor : inactiveColor }]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </>
      ) : (
        /* --- LAYOUT ADMIN (Abas Lineares) --- */
        tabs.map((route, index) => {
          const isFocused = state.index === index;
          const config = screenConfigs[route.name] || { label: route.name, icon: User };
          const Icon = config.icon;
          return (
            <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => navigation.navigate(route.name)}>
              <Icon 
                color={isFocused ? activeColor : inactiveColor} 
                size={24} 
                fill={isFocused ? activeColor : 'none'} 
              />
              <Text style={[styles.tabLabel, { color: isFocused ? activeColor : inactiveColor }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 12,
    // Sombra leve para o modo claro
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabItem: { 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1 
  },
  tabLabel: { 
    fontSize: 11,
    marginTop: 5,
    fontWeight: '700',
    textAlign: 'center'
  },
  cameraTabWrapper: { 
    alignItems: 'center',
    flex: 1,
    width: 66, 
  },
  cameraTabBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    marginHorizontal:26,
  }
});