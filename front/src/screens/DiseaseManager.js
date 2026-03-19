import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader } from '../components/AppHeader';

const ACTIVE_GREEN = '#47e426';

export default function DiseaseManager({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;
  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock de dados - Em breve vindo do SQLite
  const mockDiseases = [
    { id: '1', nome: 'Míldio', cultura: 'Tomateiro', label: 'tomato_mildew' },
    { id: '2', nome: 'Ferrugem', cultura: 'Soja', label: 'soy_rust' },
    { id: '3', nome: 'Antracnose', cultura: 'Videira', label: 'grape_antrac' },
  ];

  const filteredDiseases = mockDiseases.filter(d => 
    d.nome.toLowerCase().includes(search.toLowerCase()) || 
    d.cultura.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.diseaseCard, 
        { 
          backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
          borderColor: isDarkMode ? '#2D322C' : '#F0F0F0' 
        }
      ]}
      onPress={() => navigation.navigate('EditDisease', { diseaseId: item.id })}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.diseaseName, { color: currentTheme.textPrimary }]}>
          {item.nome}
        </Text>
        <Text style={[
          styles.cultureBadge, 
          { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }
        ]}>
          {item.cultura}
        </Text>
      </View>
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={24} 
        color={isDarkMode ? '#444' : '#BDBDBD'} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Gerenciar Doenças" />

      <View style={styles.content}>
        {/* BARRA DE PESQUISA DARK MODE */}
        <View style={[
          styles.searchContainer, 
          { 
            backgroundColor: isDarkMode ? '#1A1D19' : '#FFF', 
            borderColor: isDarkMode ? '#333' : '#E0EEDF' 
          }
        ]}>
          <MaterialCommunityIcons 
            name="magnify" 
            size={24} 
            color={isDarkMode ? '#AAA' : '#666'} 
          />
          <TextInput
            style={[styles.searchInput, { color: currentTheme.textPrimary }]}
            placeholder="Pesquisar doença ou cultura..."
            placeholderTextColor={isDarkMode ? '#555' : '#b1adad'}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* BOTÃO ADICIONAR */}
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: ACTIVE_GREEN }]} 
          onPress={() => navigation.navigate('EditDisease')}
        >
          <Text style={styles.addButtonText}>Nova Doença</Text>
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filteredDiseases}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: isDarkMode ? '#555' : '#999' }]}>
                Nenhuma doença encontrada.
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    height: 50,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    borderRadius: 12,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 10
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: { paddingBottom: 20 },
  diseaseCard: {
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
  },
  cardInfo: { flex: 1 },
  diseaseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cultureBadge: {
    fontSize: 12,
    color: '#47e426', // Use o seu ACTIVE_GREEN aqui se preferir
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});