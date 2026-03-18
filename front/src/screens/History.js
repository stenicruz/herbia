import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronDown, Trash2, Home, History as HistoryIcon, Camera, User, Check 
} from 'lucide-react-native';

import { AppHeader, BottomTabBar, ConfirmationModal } from '../components/central.js';

const HISTORICO_DATA = [
  { id: '1', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '2', planta: 'Arroz', status: 'Oídio', data: '05/07/2025', corStatus: '#E74C3C' },
  { id: '3', planta: 'Mandioca', status: 'Doente', data: '06/07/2025', corStatus: '#E74C3C' },
  { id: '4', planta: 'Batata', status: 'Saudável', data: '07/07/2025', corStatus: '#47e426' },
];

export default function HistoryScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados dos Filtros
  const [filtroPlanta, setFiltroPlanta] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroData, setFiltroData] = useState(null);

  // Controle de visibilidade dos Dropdowns
  const [menuAberto, setMenuAberto] = useState(null); // 'planta', 'status', 'data' ou null

  const opcoesPlanta = ['Todas', 'Tomateiro', 'Arroz', 'Mandioca', 'Milho', 'Batata'];
  const opcoesStatus = ['Todos', 'Saudável', 'Doente', 'Desconhecido'];

  const dadosFiltrados = HISTORICO_DATA.filter(item => {
    const matchPlanta = filtroPlanta === 'Todas' || item.planta === filtroPlanta;
    const matchStatus = filtroStatus === 'Todos' || item.status === filtroStatus;
    const matchData = !filtroData || item.data === filtroData;
    return matchPlanta && matchStatus && matchData;
  });

  const handleDeletePress = (id) => {
    setSelectedItem(id);
    setModalVisible(true);
  };

  // Componente de Dropdown Flutuante
  const RenderDropdown = ({ visivel, opcoes, selecionado, aoSelecionar, posicaoEsquerda }) => (
    <Modal visible={visivel} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.dropdownContainer, { left: posicaoEsquerda }]}>
            {opcoes.map((opt) => (
              <TouchableOpacity 
                key={opt} 
                style={styles.dropdownOption} 
                onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}
              >
                {selecionado === opt && <Check color="#47e426" size={16} style={{marginRight: 8}} />}
                <Text style={[styles.dropdownText, selecionado === opt && {color: '#47e426', fontWeight: '700'}]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <AppHeader title="Histórico" showBack={false} style={{ justifyContent: 'center' }} />

      {/* Barra de Filtros */}
      <View style={styles.filterRow}>
        {/* DATA */}
        <TouchableOpacity 
          style={[styles.filterButton, filtroData && styles.filterButtonAtivo]} 
          onPress={() => setFiltroData(filtroData ? null : '05/07/2025')} // Simula toggle de data
        >
          <Text style={[styles.filterText, filtroData && styles.filterTextAtivo]}>
            {filtroData || "Data"}
          </Text>
          <ChevronDown color={filtroData ? "#FFF" : "#999"} size={18} />
        </TouchableOpacity>

        {/* PLANTA */}
        <TouchableOpacity 
          style={[styles.filterButton, filtroPlanta !== 'Todas' && styles.filterButtonAtivo]} 
          onPress={() => setMenuAberto('planta')}
        >
          <Text style={[styles.filterText, filtroPlanta !== 'Todas' && styles.filterTextAtivo]}>
            {filtroPlanta}
          </Text>
          <ChevronDown color={filtroPlanta !== 'Todas' ? "#FFF" : "#999"} size={18} />
        </TouchableOpacity>

        {/* STATUS */}
        <TouchableOpacity 
          style={[styles.filterButton, filtroStatus !== 'Todos' && styles.filterButtonAtivo]} 
          onPress={() => setMenuAberto('status')}
        >
          <Text style={[styles.filterText, filtroStatus !== 'Todos' && styles.filterTextAtivo]}>
            {filtroStatus}
          </Text>
          <ChevronDown color={filtroStatus !== 'Todos' ? "#FFF" : "#999"} size={18} />
        </TouchableOpacity>
      </View>

      {/* Menus Suspensos (Modais) */}
      <RenderDropdown 
        visivel={menuAberto === 'planta'}
        opcoes={opcoesPlanta}
        selecionado={filtroPlanta}
        aoSelecionar={setFiltroPlanta}
        posicaoEsquerda="30%"
      />

      <RenderDropdown 
        visivel={menuAberto === 'status'}
        opcoes={opcoesStatus}
        selecionado={filtroStatus}
        aoSelecionar={setFiltroStatus}
        posicaoEsquerda="55%"
      />

      {/* Lista de Cards */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 20 }}>
        {dadosFiltrados.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.historyCard}
            onPress={() => navigation.navigate('DiagnosticResult', { item })}
          >
            <View style={styles.cardInfo}>
              <View style={styles.imagePlaceholder} />
              <View style={styles.textGroup}>
                <Text style={styles.plantaNome}>{item.planta}</Text>
                <Text style={[styles.plantaStatus, { color: item.corStatus }]}>{item.status}</Text>
                <Text style={styles.plantaData}>{item.data}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <View style={styles.divider} />
              <TouchableOpacity onPress={() => handleDeletePress(item.id)} style={styles.deleteBtn}>
                <Trash2 color="#C0392B" size={24} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {dadosFiltrados.length === 0 && (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>Nenhum registro encontrado.</Text>
        )}
      </ScrollView>

      <ConfirmationModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => setModalVisible(false)}
        title="Deseja eliminar?"
        message="Esta ação não poderá ser desfeita."
      />

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF'},
  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 25, marginTop: 10, zIndex: 10 },
  filterButton: { 
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', 
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#FFF' 
  },
  filterButtonAtivo: { backgroundColor: '#47e426', borderColor: '#47e426' },
  filterText: { marginRight: 5, color: '#999', fontWeight: '600', fontSize: 13 },
  filterTextAtivo: { color: '#FFF' },

  // Estilos do Dropdown
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: {
    position: 'absolute', top: 140,width: 150, backgroundColor: '#FFF',
    borderRadius: 15, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1,
    shadowRadius: 10, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden'
  },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  dropdownText: { fontSize: 14, color: '#666' },

  // Cards
  historyCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 18, padding: 12, 
    marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 
  },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#EBF5FB' },
  textGroup: { marginLeft: 15 },
  plantaNome: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  plantaStatus: { fontSize: 14, fontWeight: '600', marginVertical: 2 },
  plantaData: { fontSize: 12, color: '#BBB' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: '70%', backgroundColor: '#EEE', marginHorizontal: 12 },
  deleteBtn: { padding: 5 }
});