import React, { useState } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Plus } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, PrimaryButton } from '../components/central.js';
import api from '../services/api';

const imageFundo = require('../../assets/check.jpg');

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [dica, setDica] = useState(null);
  const [culturas, setCulturas] = useState([]);
  const [loadingDica, setLoadingDica] = useState(true);
  const [loadingCulturas, setLoadingCulturas] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadDica();
      loadCulturas();
    }, [])
  );

  const INTERVALO_HORAS = 0.11;

const loadDica = async () => {
  try {
    setLoadingDica(true);

    // Verifica se há uma dica guardada e quando foi buscada
    const dicaGuardada = await AsyncStorage.getItem('@Herbia:dica');
    const timestampGuardado = await AsyncStorage.getItem('@Herbia:dica_timestamp');

    const agora = new Date().getTime();
    const intervaloMs = INTERVALO_HORAS * 60 * 60 * 1000;

    // Se existe dica guardada e ainda não passou o intervalo → usa a guardada
    if (dicaGuardada && timestampGuardado) {
      const diferencaMs = agora - parseInt(timestampGuardado);
      if (diferencaMs < intervaloMs) {
        setDica(JSON.parse(dicaGuardada));
        setLoadingDica(false);
        return;
      }
    }

    // Se não existe ou já passou o intervalo → busca nova dica aleatória
    const response = await api.get('/dica-dinamica');
    const novaDica = response.data;

    // Guarda a nova dica e o timestamp actual
    await AsyncStorage.setItem('@Herbia:dica', JSON.stringify(novaDica));
    await AsyncStorage.setItem('@Herbia:dica_timestamp', agora.toString());

    setDica(novaDica);
  } catch (err) {
    console.warn("Erro ao carregar dica:", err);
  } finally {
    setLoadingDica(false);
  }
};

  const loadCulturas = async () => {
    try {
      setLoadingCulturas(true);
      const response = await api.get('/culturas');
      setCulturas(response.data);
    } catch (err) {
      console.warn("Erro ao carregar culturas:", err);
    } finally {
      setLoadingCulturas(false);
    }
  };

  // Mostra só as 3 primeiras culturas
  const culturasResumo = culturas.slice(0, 3);

  return (
    <View style={[styles.safeContainer, { backgroundColor: currentTheme.background, paddingTop: insets.top }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.background}
      />

      <AppHeader title="Herbia" showBack={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        overScrollMode="never"
      >
        {/* Card Verde - Dica Dinâmica */}
        <View style={[styles.cardVerde, { backgroundColor: isDarkMode ? '#35b51d' : '#47e426' }]}>
          <View style={styles.cardTextContent}>
            <Text style={styles.cardTitle}>
              {dica ? dica.titulo : 'Dica de Cultivo'}
            </Text>
            {loadingDica ? (
              <ActivityIndicator color="#FFF" size="small" style={{ marginTop: 6 }} />
            ) : (
              <Text style={styles.cardSubtitle} numberOfLines={3}>
                {dica ? dica.conteudo : 'Sem dicas disponíveis de momento.'}
              </Text>
            )}
          </View>
          <View style={styles.cardIconsContainer}>
            <Bell color="#FFF" size={65} opacity={0.3} style={styles.cardIconBell} />
          </View>
        </View>

        {/* Frame da Câmera */}
        <View style={[styles.cameraFrame, { backgroundColor: isDarkMode ? '#121411' : '#F5F5F5' }]}>
          <Image
            source={imageFundo}
            style={[styles.fotoPlanta, isDarkMode && { opacity: 0.7 }]}
          />
          <PrimaryButton
            title="Tirar Uma Foto"
            textStyle={{ fontSize: 17, color: isDarkMode ? '#121411' : '#FFF' }}
            style={{ width: '60%', height: 48, marginTop: 200 }}
            onPress={() => navigation.navigate('CameraScanner')}
          />
        </View>

        {/* Culturas Suportadas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>
            Culturas Suportadas
          </Text>

          <View style={styles.culturaRow}>
            {loadingCulturas ? (
              <ActivityIndicator color={THEME.primary} size="small" />
            ) : culturasResumo.length === 0 ? (
              <Text style={{ color: currentTheme.textSecondary, fontSize: 13 }}>
                Sem culturas disponíveis.
              </Text>
            ) : (
              culturasResumo.map((item) => (
                <View key={item.id} style={styles.culturaItem}>
                  <View style={[styles.circuloCultura, {
                    backgroundColor: isDarkMode ? '#121411' : '#FFF',
                    borderColor: isDarkMode ? '#333' : '#eee'
                  }]}>
                    {item.imagem_url ? (
                      <Image
                        source={{ uri: item.imagem_url }}
                        style={styles.culturaImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.culturaImage, {
                        backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9'
                      }]} />
                    )}
                  </View>
                  <Text style={[styles.culturaLabel, { color: currentTheme.textPrimary }]}>
                    {item.nome}
                  </Text>
                </View>
              ))
            )}

            <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ShowCulture')}>
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
    marginHorizontal: 20, borderRadius: 22, padding: 22, height: 115,
    flexDirection: 'row', overflow: 'hidden', position: 'relative', marginTop: 15,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  cardTextContent: { flex: 1, zIndex: 2, justifyContent: 'center' },
  cardTitle: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  cardSubtitle: { color: '#FFF', fontSize: 13, marginTop: 6, width: '85%', lineHeight: 18, fontWeight: '600' },
  cardIconsContainer: { position: 'absolute', right: -10, top: 10 },
  cardIconBell: { transform: [{ rotate: '15deg' }] },
  cameraFrame: {
    margin: 20, height: 300, borderRadius: 30, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center', elevation: 2,
  },
  fotoPlanta: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  section: { paddingHorizontal: 25, marginTop: 10 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 25 },
  culturaRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 35
  },
  culturaItem: { alignItems: 'center' },
  circuloCultura: {
    width: 72, height: 72, borderRadius: 36, overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center', borderWidth: 2,
  },
  culturaImage: { width: '100%', height: '100%' },
  culturaLabel: { fontSize: 13, marginTop: 10, fontWeight: '700' },
  addBtn: { width: 55, height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
});