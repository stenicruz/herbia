import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, Image, StatusBar, ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/central.js';
import api from '../services/api';

export default function CulturesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [culturas, setCulturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCulturas();
  }, []);

  const loadCulturas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/culturas');
      setCulturas(response.data);
    } catch (err) {
      console.warn("Erro ao carregar culturas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.background}
      />

      <AppHeader title="Culturas Suportadas" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        bounces={false}
      >
        <View style={styles.textSection}>
          <Text style={[styles.descriptionText, { color: currentTheme.textSecondary }]}>
            Abaixo são apresentadas todas as culturas suportadas pelo sistema de diagnóstico Herbia.
          </Text>
        </View>

        <View style={[styles.gridWrapper, { backgroundColor: isDarkMode ? '#0c0e0b' : '#f7faf6' }]}>
          {loading ? (
            <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 40 }} />
          ) : culturas.length === 0 ? (
            <Text style={[styles.emptyText, { color: isDarkMode ? '#444' : '#999' }]}>
              Nenhuma cultura disponível de momento.
            </Text>
          ) : (
            <View style={styles.grid}>
              {culturas.map((item) => (
                <TouchableOpacity key={item.id} style={styles.cultureItem} activeOpacity={0.7}>
                  <View style={[styles.circle, {
                    backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
                    borderColor: isDarkMode ? '#333' : '#FFF',
                    elevation: isDarkMode ? 0 : 3
                  }]}>
                    {item.imagem_url ? (
                      <Image
                        source={{ uri: item.imagem_url }}
                        style={[styles.cultureImage, isDarkMode && { opacity: 0.85 }]}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.cultureImage, {
                        backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9'
                      }]} />
                    )}
                  </View>
                  <Text style={[styles.cultureName, { color: currentTheme.textPrimary }]}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  textSection: { paddingHorizontal: 20, marginTop: 15, marginBottom: 25 },
  descriptionText: { fontSize: 16, lineHeight: 24 },
  gridWrapper: {
    flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40,
    paddingTop: 40, paddingHorizontal: 15, minHeight: 600,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  cultureItem: { width: '33.3%', alignItems: 'center', marginBottom: 30 },
  circle: {
    width: 85, height: 85, borderRadius: 43, marginBottom: 12,
    borderWidth: 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 },
  },
  cultureImage: { width: '100%', height: '100%' },
  cultureName: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 15, fontWeight: '600' },
});