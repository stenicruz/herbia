import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, StatusBar, Platform, Image, ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import adminService from '../services/adminService';

const ACTIVE_GREEN = '#47e426';

const StatCard = ({ count, label, type, onPress, isDarkMode, currentTheme }) => {
  const isCulture = type === 'culture';
  const accentColor = isCulture ? ACTIVE_GREEN : '#FF5252';

  return (
    <TouchableOpacity
      style={[styles.statCard, {
        borderColor: accentColor,
        backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
        shadowColor: isDarkMode ? '#000' : '#DDD'
      }]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, {
        backgroundColor: isDarkMode
          ? (isCulture ? '#132A13' : '#2D1414')
          : (isCulture ? '#E8F5E9' : '#FFEBEE')
      }]}>
        <MaterialCommunityIcons
          name={isCulture ? 'sprout' : 'virus'}
          size={20}
          color={accentColor}
        />
      </View>
      <Text style={[styles.statCount, { color: currentTheme.textPrimary }]}>{count}</Text>
      <Text style={[styles.statLabel, { color: accentColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default function AdminDashboard({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [cultures, setCultures] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [culturas, doencas] = await Promise.all([
        adminService.listarCulturas(),
        adminService.listarDoencas(),
      ]);
      setCultures(culturas);
      setDiseases(doencas);
    } catch (err) {
      console.warn("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderSupportedDisease = ({ item }) => (
    <TouchableOpacity
      style={[styles.diseaseItem, {
        backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
        borderColor: isDarkMode ? '#2A2E28' : '#F1F1F1'
      }]}
      onPress={() => navigation.navigate('EditDisease', { disease: item })}
    >
      <View style={styles.diseaseInfo}>
        <Text style={[styles.diseaseNameText, { color: currentTheme.textPrimary }]}>
          {item.nome}
        </Text>
        <View style={styles.cultureBadge}>
          <Text style={styles.cultureBadgeText}>{item.cultura_nome}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={26} color={isDarkMode ? '#555' : '#BDBDBD'} />
    </TouchableOpacity>
  );

  // Mostra só as 3 primeiras doenças na lista resumida
  const doencasResumo = diseases.slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Catálogo Agrícola" showBack={false} />

      {loading ? (
        <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Estatísticas */}
          <View style={styles.statsRow}>
            <StatCard
              count={cultures.length}
              label="Culturas"
              type="culture"
              isDarkMode={isDarkMode}
              currentTheme={currentTheme}
              onPress={() => navigation.navigate('CultureManager')}
            />
            <StatCard
              count={diseases.length}
              label="Doenças"
              type="disease"
              isDarkMode={isDarkMode}
              currentTheme={currentTheme}
              onPress={() => navigation.navigate('DiseaseManager')}
            />
          </View>

          {/* Culturas Suportadas */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>
              Culturas Suportadas
            </Text>
            <View style={styles.cultureGrid}>
              {cultures.slice(0, 3).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.cultureGridItem}
                  onPress={() => navigation.navigate('CultureManager')}
                >
                  {item.imagem_url ? (
                    <Image
                      source={{ uri: item.imagem_url }}
                      style={styles.cultureImage}
                    />
                  ) : (
                    <View style={[styles.cultureImagePlaceholder, {
                      backgroundColor: isDarkMode ? '#2A2E28' : '#E8F5E9'
                    }]} />
                  )}
                  <Text style={[styles.culturePlaceholderText, { color: currentTheme.textPrimary }]}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.addCultureBtn, { backgroundColor: isDarkMode ? '#1A1D19' : 'transparent' }]}
                onPress={() => navigation.navigate('CultureManager')}
              >
                <MaterialCommunityIcons name="plus" size={28} color={ACTIVE_GREEN} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Doenças Suportadas */}
          <View style={[styles.section, { marginBottom: 20 }]}>
            <Text style={[styles.sectionTitle, { color: currentTheme.textPrimary }]}>
              Doenças Suportadas
            </Text>

            {doencasResumo.length === 0 ? (
              <Text style={[styles.emptyText, { color: isDarkMode ? '#444' : '#999' }]}>
                Nenhuma doença cadastrada ainda.
              </Text>
            ) : (
              <FlatList
                data={doencasResumo}
                renderItem={renderSupportedDisease}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            )}
          </View>

          {diseases.length > 3 && (
            <TouchableOpacity
              style={styles.verTudoBtn}
              onPress={() => navigation.navigate('DiseaseManager')}
            >
              <Text style={styles.verTudoBtnText}>Ver Tudo</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 90 },
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 40 },
  statCard: {
    width: '44%', borderRadius: 20, borderWidth: 1.5,
    padding: 15, alignItems: 'center', justifyContent: 'center',
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 }
    })
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statCount: { fontSize: 26, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 13, fontWeight: 'bold' },
  section: { marginBottom: 35 },
  sectionTitle: { fontSize: 19, fontWeight: '800', marginBottom: 25 },
  cultureGrid: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  cultureGridItem: { alignItems: 'center', width: '22%' },
  cultureImage: { width: 75, height: 75, borderRadius: 40 },
  cultureImagePlaceholder: { width: 75, height: 75, borderRadius: 40 },
  culturePlaceholderText: { fontSize: 13, marginTop: 8, fontWeight: '600', textAlign: 'center' },
  addCultureBtn: { width: 45, height: 45, borderRadius: 22.5, alignItems: 'center', justifyContent: 'center' },
  emptyText: { textAlign: 'center', fontSize: 14, fontWeight: '500', marginTop: 10 },
  diseaseItem: {
    borderRadius: 15, borderWidth: 1.5, flexDirection: 'row',
    alignItems: 'center', padding: 18, marginBottom: 12,
  },
  diseaseInfo: { flex: 1 },
  diseaseNameText: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  cultureBadge: {
    borderWidth: 1.5, borderColor: ACTIVE_GREEN, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 2, alignSelf: 'flex-start'
  },
  cultureBadgeText: { fontSize: 11, fontWeight: 'bold', color: ACTIVE_GREEN },
  verTudoBtn: {
    alignSelf: 'center', width: '80%', backgroundColor: ACTIVE_GREEN,
    borderRadius: 15, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: -12,
  },
  verTudoBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
});