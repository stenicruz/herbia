import React from 'react';
import { 
  StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Platform, StatusBar 
} from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  History, 
  Home, 
  User, 
  Plus, 
  Camera,
} from 'lucide-react-native';

import { AppHeader, BottomTabBar, PrimaryButton } from '../components/central.js';

const imageFundo = require('../../assets/check.jpg'); 

export default function HomeScreen({navigation}) {
  const insets = useSafeAreaInsets();
  const culturas = [
    { id: 1, nome: 'Tomate', img: require('../../assets/tomate.jpeg') },
    { id: 2, nome: 'Batata', img: require('../../assets/batata.jpeg') },
    { id: 3, nome: 'Milho', img: require('../../assets/milho.jpeg') },
  ];
  const abas = [
    { name: 'Home', label: 'Casa', icon: Home, screen: 'Home' },
    { name: 'History', label: 'Histórico', icon: History, screen: 'History' },
    { name: 'Camera', label: 'Câmera', icon: Camera, screen: 'CameraScanner' },
    { name: 'Profile', label: 'Perfil', icon: User, screen: 'Profile' },
  ];

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <AppHeader 
        title="Herbia" 
        showBack={false} 
      />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 130 }}
      >

        {/* Card Verde */}
        <View style={styles.cardVerde}>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>Dica de Cultivo</Text>
            <Text style={styles.cardSubtitle}>
              Evite molhar as folhas das plantas durante o sol forte para não queimá-las
            </Text>
          </View>
          
          {/* Ícones de Detalhe no Card */}
          <View style={styles.cardIconsContainer}>
             <Bell color="#FFF" size={65} opacity={0.5} style={styles.cardIconBell} />
          </View>
        </View>

        {/* Frame da Câmera (Visor) */}
        <View style={styles.cameraFrame}>
          <Image source={imageFundo} style={styles.fotoPlanta} />

        <PrimaryButton
        title={'Tirar Uma Foto'}
        textStyle={{fontSize: 17}}
        style={{width: '55%', height: 47, marginTop: 200}}
        onPress={() => navigation.navigate('CameraScanner')}
        />
        </View>

        {/* Culturas Suportadas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Culturas Suportadas</Text>
          <View style={styles.culturaRow}>
            {culturas.map((item) => (
              <View key={item.id} style={styles.culturaItem}>
                <View style={styles.circuloVerdeEscuro}>
                  {/* A imagem entra aqui preenchendo o círculo */}
                  <Image 
                    source={item.img} 
                    style={styles.culturaImage} 
                    resizeMode="cover" 
                  />
                </View>
                <Text style={styles.culturaLabel}>{item.nome}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ShowCulture')}>
              <Plus color="#47e426" size={35} strokeWidth={3} onC/>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      

    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingTop: 50, paddingBottom: 20, paddingLeft: 25 },
  headerText: { fontSize: 24, fontWeight: '700', color: '#1B1919' },

  // Estilos do Card Verde
  cardVerde: {
    backgroundColor: '#47e426',
    marginHorizontal: 20,
    borderRadius: 22,
    padding: 22,
    height: 110,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 15
  },
  cardTextContent: { flex: 1, zIndex: 2, justifyContent: 'center' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: '#FFF', fontSize: 14, marginTop: 6, width: '85%', lineHeight: 18, fontWeight: '500' },
  
  cardIconsContainer: { position: 'absolute', right: 0, top: 10, height: '100%'},
  cardIconBell: { transform: [{ rotate: '15deg' }] },

  // Frame da Câmera
  cameraFrame: {
    margin: 20,
    height: 290,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fotoPlanta: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },

  btnTirarFoto: {
    backgroundColor: '#47e426',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 18,
    position: 'absolute',
    bottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6
  },
  btnTirarFotoText: { color: '#FFF', fontWeight: 'bold', fontSize: 17 },

  // Culturas
  section: { paddingHorizontal: 25, marginTop: 10, marginBottom:25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1B1919', marginBottom: 15 },
  culturaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  culturaItem: { alignItems: 'center' },
  circuloVerdeEscuro: { width: 75, height: 75, borderRadius: 38, backgroundColor: '#233814',
    overflow: 'hidden', // ESSENCIAL: corta a imagem no formato do círculo
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee' },
  culturaLabel: { fontSize: 14, color: '#333', marginTop: 8, fontWeight: '500' },
  addBtn: { marginLeft: 5 },
  culturaImage: {
    borderRadius: 40,
    width: '98%',
    height: '98%',
  },

// ...

  // Tab Bar
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
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, marginTop: 4, fontWeight: '600', color: '#7c7a7a'},
  
  cameraTabWrapper: { alignItems: 'center', marginTop: -40 },
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
    shadowColor: '#000000c4',
    shadowOpacity: 0.15,
    shadowRadius: 8,
  }
});