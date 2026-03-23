import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, ActivityIndicator, StatusBar, Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Check } from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central';
import adminService from '../services/adminService';

const ACTIVE_GREEN = '#47e426';

export default function DiseaseManager({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [diseases, setDiseases] = useState([]);
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Filtro por cultura
  const [selectedCultura, setSelectedCultura] = useState(null);
  const [filtroModalVisible, setFiltroModalVisible] = useState(false);

  // Modal eliminar
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

useFocusEffect(
  React.useCallback(() => {
    loadData();
  }, [])
);

  const loadData = async () => {
    try {
      setLoading(true);
      const [doencas, culturas] = await Promise.all([
        adminService.listarDoencas(),
        adminService.listarCulturas(),
      ]);
      setDiseases(doencas);
      setCultures(culturas);
    } catch (err) {
      console.warn("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePress = (id) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteModalVisible(false);
      await adminService.eliminarDoenca(deleteId);
      await loadData();
    } catch (err) {
      console.warn("Erro ao eliminar:", err);
    }
  };

  // Filtragem
  const filtradas = diseases.filter(d => {
    const matchSearch =
      d.nome?.toLowerCase().includes(search.toLowerCase()) ||
      d.cultura_nome?.toLowerCase().includes(search.toLowerCase());
    const matchCultura = !selectedCultura || d.cultura_id === selectedCultura.id;
    return matchSearch && matchCultura;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.diseaseCard, {
        backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
        borderColor: isDarkMode ? '#2D322C' : '#F0F0F0'
      }]}
      onPress={() => navigation.navigate('EditDisease', { disease: item })}
    >
      <View style={styles.cardInfo}>
        <Text style={[styles.diseaseName, { color: currentTheme.textPrimary }]}>
          {item.nome}
        </Text>
        <View style={styles.badgeRow}>
          <View style={[styles.cultureBadge, { backgroundColor: isDarkMode ? '#1A2E1A' : '#E8F5E9' }]}>
            <Text style={[styles.cultureBadgeText, { color: ACTIVE_GREEN }]}>{item.cultura_nome}</Text>
          </View>
          <View style={[styles.estadoBadge, {
            backgroundColor: item.estado === 'Saudável'
              ? (isDarkMode ? '#1A2E1A' : '#E8F5E9')
              : (isDarkMode ? '#2D1414' : '#FFEBEE')
          }]}>
            <Text style={[styles.estadoText, {
              color: item.estado === 'Saudável' ? ACTIVE_GREEN : '#FF5252'
            }]}>
              {item.estado}
            </Text>
          </View>
        </View>
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
        {/* Barra de pesquisa */}
        <View style={[styles.searchContainer, {
          backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
          borderColor: isDarkMode ? '#333' : '#E0EEDF'
        }]}>
          <MaterialCommunityIcons name="magnify" size={24} color={isDarkMode ? '#AAA' : '#666'} />
          <TextInput
            style={[styles.searchInput, { color: currentTheme.textPrimary }]}
            placeholder="Pesquisar doença..."
            placeholderTextColor={isDarkMode ? '#555' : '#b1adad'}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filtro por cultura */}
        <TouchableOpacity
          style={[styles.filtroBtn, {
            backgroundColor: selectedCultura ? ACTIVE_GREEN : (isDarkMode ? '#1A1D19' : '#FFF'),
            borderColor: isDarkMode ? '#333' : '#E0EEDF'
          }]}
          onPress={() => setFiltroModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={18}
            color={selectedCultura ? '#FFF' : (isDarkMode ? '#AAA' : '#666')}
          />
          <Text style={[styles.filtroBtnText, {
            color: selectedCultura ? '#FFF' : (isDarkMode ? '#AAA' : '#666')
          }]}>
            {selectedCultura ? selectedCultura.nome : 'Filtrar por cultura'}
          </Text>
          {selectedCultura && (
            <TouchableOpacity onPress={() => setSelectedCultura(null)}>
              <MaterialCommunityIcons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Botão adicionar */}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: ACTIVE_GREEN }]}
          onPress={() => navigation.navigate('EditDisease', { disease: null })}
        >
          <Text style={styles.addButtonText}>Nova Doença</Text>
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={ACTIVE_GREEN} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={filtradas}
            keyExtractor={item => item.id.toString()}
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

      {/* Modal filtro por cultura */}
      <Modal visible={filtroModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setFiltroModalVisible(false)}>
          <View style={styles.filtroOverlay}>
            <View style={[styles.filtroContent, { backgroundColor: isDarkMode ? '#1A1D19' : '#FFF' }]}>
              <Text style={[styles.filtroTitle, { color: currentTheme.textPrimary }]}>
                Filtrar por Cultura
              </Text>

              <TouchableOpacity
                style={[styles.filtroOption, { borderBottomColor: isDarkMode ? '#222' : '#EEE' }]}
                onPress={() => { setSelectedCultura(null); setFiltroModalVisible(false); }}
              >
                {!selectedCultura && <Check color={ACTIVE_GREEN} size={16} style={{ marginRight: 8 }} />}
                <Text style={[styles.filtroOptionText, { color: !selectedCultura ? ACTIVE_GREEN : currentTheme.textPrimary }]}>
                  Todas
                </Text>
              </TouchableOpacity>

              {cultures.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.filtroOption, { borderBottomColor: isDarkMode ? '#222' : '#EEE' }]}
                  onPress={() => { setSelectedCultura(c); setFiltroModalVisible(false); }}
                >
                  {selectedCultura?.id === c.id && (
                    <Check color={ACTIVE_GREEN} size={16} style={{ marginRight: 8 }} />
                  )}
                  <Text style={[styles.filtroOptionText, {
                    color: selectedCultura?.id === c.id ? ACTIVE_GREEN : currentTheme.textPrimary,
                    fontWeight: selectedCultura?.id === c.id ? '800' : '500'
                  }]}>
                    {c.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Eliminar Doença?"
        description="Esta doença será removida permanentemente."
        confirmText="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    paddingHorizontal: 15, borderWidth: 1, height: 50, marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  filtroBtn: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    paddingHorizontal: 15, height: 45, borderWidth: 1, marginBottom: 12, gap: 8
  },
  filtroBtnText: { flex: 1, fontSize: 14, fontWeight: '600' },
  addButton: {
    flexDirection: 'row', borderRadius: 12, height: 55,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    elevation: 2, gap: 10
  },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  list: { paddingBottom: 100 },
  diseaseCard: {
    borderRadius: 15, padding: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 12, borderWidth: 1,
  },
  cardInfo: { flex: 1 },
  diseaseName: { fontSize: 17, fontWeight: 'bold', marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 8 },
  cultureBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 8, alignSelf: 'flex-start'
  },
  cultureBadgeText: { fontSize: 12, fontWeight: '700' },
  estadoBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 8, alignSelf: 'flex-start'
  },
  estadoText: { fontSize: 12, fontWeight: '700' },
  emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16 },
  filtroOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 30
  },
  filtroContent: {
    width: '100%', borderRadius: 20, padding: 20,
    elevation: 10, maxHeight: 400
  },
  filtroTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  filtroOption: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1
  },
  filtroOptionText: { fontSize: 16 },
});