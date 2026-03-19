import React from 'react';
import { 
  StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, StatusBar 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Plus } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton } from '../components/central.js';

const imageFundo = require('../../assets/check.jpg'); 

export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const culturas = [
    { id: 1, nome: 'Tomate', img: require('../../assets/tomate.jpeg') },
    { id: 2, nome: 'Batata', img: require('../../assets/batata.jpeg') },
    { id: 3, nome: 'Milho', img: require('../../assets/milho.jpeg') },
  ];

  return (
    <View style={[styles.safeContainer, { backgroundColor: currentTheme.background, paddingTop: insets.top }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={currentTheme.background} 
      />
      
      <AppHeader 
        title="Herbia" 
        showBack={false} 
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 130 }}
        overScrollMode="never"
      >

        {/* Card Verde - Dica de Cultivo */}
        <View style={[
          styles.cardVerde, 
          { backgroundColor: isDarkMode ? '#35b51d' : '#47e426' } // Verde levemente mais fechado no escuro
        ]}>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Dica de Cultivo</Text>
            <Text style={styles.cardSubtitle}>
              Evite molhar as folhas das plantas durante o sol forte para não queimá-las.
            </Text>
          </View>
          
          <View style={styles.cardIconsContainer}>
             <Bell color="#FFF" size={65} opacity={0.3} style={styles.cardIconBell} />
          </View>
        </View>

        {/* Frame da Câmera (Visor/Banner) */}
        <View style={[
          styles.cameraFrame, 
          { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5' }
        ]}>
          <Image 
            source={imageFundo} 
            style={[styles.fotoPlanta, isDarkMode && { opacity: 0.7 }]} 
          />
          
          <PrimaryButton
            title={'Tirar Uma Foto'}
            textStyle={{fontSize: 17, color: isDarkMode ? '#121411' : '#FFF'}}
            style={{width: '60%', height: 48, marginTop: 200}}
            onPress={() => navigation.navigate('CameraScanner')}
          />
        </View>

        {/* Culturas Suportadas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>
            Culturas Suportadas
          </Text>
          
          <View style={styles.culturaRow}>
            {culturas.map((item) => (
              <View key={item.id} style={styles.culturaItem}>
                <View style={[
                  styles.circuloCultura, 
                  { 
                    backgroundColor: isDarkMode ? '#121411' : '#FFF',
                    borderColor: isDarkMode ? '#333' : '#eee' 
                  }
                ]}>
                  <Image 
                    source={item.img} 
                    style={styles.culturaImage} 
                    resizeMode="cover" 
                  />
                </View>
                <Text style={[styles.culturaLabel, { color: currentTheme.textPrimary }]}>
                  {item.nome}
                </Text>
              </View>
            ))}

            <TouchableOpacity 
              style={
                styles.addBtn 
              } 
              onPress={() => navigation.navigate('ShowCulture')}
            >
              <Plus color={THEME.primary} size={32} strokeWidth={3} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  
  cardVerde: {
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 22,
    height: 115,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 15,
    // Sombra para o card
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTextContent: { flex: 1, zIndex: 2, justifyContent: 'center' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: '#FFF', fontSize: 13, marginTop: 6, width: '85%', lineHeight: 18, fontWeight: '600' },
  
  cardIconsContainer: { position: 'absolute', right: -10, top: 10 },
  cardIconBell: { transform: [{ rotate: '15deg' }] },

  cameraFrame: {
    margin: 20,
    height: 300,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  fotoPlanta: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },

  section: { paddingHorizontal: 25, marginTop: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 25 },
  
  culturaRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 35
  },
  culturaItem: { alignItems: 'center' },
  circuloCultura: { 
    width: 72, 
    height: 72, 
    borderRadius: 36, 
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  culturaImage: {
    width: '100%',
    height: '100%',
  },
  culturaLabel: { fontSize: 13, marginTop: 10, fontWeight: '700' },
  
  addBtn: { 
    width: 55, 
    height: 55, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
});