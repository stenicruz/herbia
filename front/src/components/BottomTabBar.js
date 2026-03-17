import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomTabBar = ({ state, navigation, tabs }) => {
  const insets = useSafeAreaInsets();
  const activeColor = '#47e426';
  const inactiveColor = '#999';

  return (
    <View style={[
      styles.tabBar, 
      { paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : insets.bottom + 15 }
    ]}>
      {tabs.map((tab, index) => {
        const isFocused = state === tab.name;
        const isCamera = tab.name === 'Camera';

        // 1. Caso Especial: Botão da Câmera (Sempre preenchido de branco no centro)
        if (isCamera) {
          return (
            <View key={index} style={styles.cameraTabWrapper}>
              <TouchableOpacity 
                style={styles.cameraTabBtn}
                onPress={() => navigation.navigate(tab.screen)}
                activeOpacity={0.8}
              >
                <tab.icon color="#47e426" size={47} fill="#fff" />
              </TouchableOpacity>
              <Text style={[
              styles.tabLabel, 
              { color: inactiveColor, fontWeight: '600' }
            ]}>Câmera</Text>
            </View>
          );
        }

        // 2. Botões Normais (Casa, Histórico, Perfil)
        return (
          <TouchableOpacity
            key={index}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.screen)}
            activeOpacity={0.7}
          >
            <tab.icon 
              color={isFocused ? activeColor : inactiveColor} 
              size={26} 
              // O SEGREDO ESTÁ AQUI: se estiver focado, preenche com a cor ativa
              fill={isFocused ? activeColor : 'none'} 
              strokeWidth={isFocused ? 2.5 : 2}
            />
            <Text style={[
              styles.tabLabel, 
              { color: isFocused ? activeColor : inactiveColor, fontWeight: isFocused ? '700' : '600' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 12,
  },
  
tabItem: { 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1 // Faz com que todos os itens ocupem o mesmo espaço horizontal
  },
  
  tabLabel: { 
    fontSize: 12,      // Tamanho igual para todos
    marginTop: 4,      // Distância igual do ícone/botão
    fontWeight: '600', // Peso igual para todos
    textAlign: 'center'
  },
  
  cameraTabWrapper: { 
    alignItems: 'center', 
    marginTop: -38,   // Ajuste fino para o botão flutuar
    flex: 1           // Garante que o texto da câmera alinhe horizontalmente com os outros
  },
  cameraTabBtn: {
    backgroundColor: '#47e426',
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#a5ef95',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 2, // Pequeno ajuste para o texto não colar no botão verde
  }
});