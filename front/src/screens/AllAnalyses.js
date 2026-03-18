import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Image, Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronDown, Trash2, Check, Calendar as CalendarIcon, Share2
} from 'lucide-react-native';

import { AppHeader, ConfirmationModal } from '../components/central.js';

const ANALYSES_DATA = [
  { id: '1', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '2', planta: 'Milho', status: 'Doente', data: '05/07/2025', corStatus: '#E74C3C' },
  { id: '3', planta: 'Mandioca', status: 'Saudável', data: '06/07/2025', corStatus: '#47e426' },
  { id: '4', planta: 'Tomateiro', status: 'Doente', data: '07/07/2025', corStatus: '#E74C3C' },
  { id: '5', planta: 'Batata', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
];

export default function AnalysesListScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- ESTADOS DOS FILTROS ---
  const [filtroPlanta, setFiltroPlanta] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [menuAberto, setMenuAberto] = useState(null); // 'planta', 'status' ou null

  // --- LÓGICA DE DATA ---
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataSelecionadaFormatada, setDataSelecionadaFormatada] = useState(null);

  const opcoesPlanta = ['Todas', 'Tomateiro', 'Milho', 'Mandioca', 'Batata'];
  const opcoesStatus = ['Todos', 'Saudável', 'Doente'];

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setDataSelecionadaFormatada(formatDate(currentDate));
    } else {
      setShowDatePicker(false);
    }
  };

  // --- LÓGICA DE FILTRAGEM ---
  const dadosFiltrados = ANALYSES_DATA.filter(item => {
    const matchPlanta = filtroPlanta === 'Todas' || item.planta === filtroPlanta;
    const matchStatus = filtroStatus === 'Todos' || item.status === filtroStatus;
    const matchData = !dataSelecionadaFormatada || item.data === dataSelecionadaFormatada;
    return matchPlanta && matchStatus && matchData;
  });

  const handleDeletePress = (id) => {
    setSelectedItem(id);
    setModalVisible(true);
  };

  // Componente Dropdown Reutilizável
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
      <AppHeader title="Análises"/>

      <View style={styles.headerPadding}>
        {/* Card de Total */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>Total de Análises</Text>
            <Text style={styles.totalNumber}>{dadosFiltrados.length}</Text>
          </View>
          <TouchableOpacity style={styles.shareBtn}>
            <Share2 color="#47e426" size={22} />
          </TouchableOpacity>
        </View>

        {/* Barra de Filtros */}
        <View style={styles.filterRow}>
          {/* DATA */}
          <TouchableOpacity 
            style={[styles.filterButton, dataSelecionadaFormatada && styles.filterButtonAtivo]} 
            onPress={() => setShowDatePicker(true)}
          >
            <CalendarIcon color={dataSelecionadaFormatada ? "#FFF" : "#999"} size={16} />
            <Text style={[styles.filterText, dataSelecionadaFormatada && styles.filterTextAtivo]}>
              {dataSelecionadaFormatada || "Data"}
            </Text>
            {dataSelecionadaFormatada && (
              <TouchableOpacity onPress={() => setDataSelecionadaFormatada(null)}>
                <Text style={{color: '#FFF', fontWeight: 'bold', marginLeft: 5}}>✕</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* PLANTA */}
          <TouchableOpacity 
            style={[styles.filterButton, filtroPlanta !== 'Todas' && styles.filterButtonAtivo]} 
            onPress={() => setMenuAberto('planta')}
          >
            <Text style={[styles.filterText, filtroPlanta !== 'Todas' && styles.filterTextAtivo]}>{filtroPlanta}</Text>
            <ChevronDown color={filtroPlanta !== 'Todas' ? "#FFF" : "#999"} size={18} />
          </TouchableOpacity>

          {/* STATUS */}
          <TouchableOpacity 
            style={[styles.filterButton, filtroStatus !== 'Todos' && styles.filterButtonAtivo]} 
            onPress={() => setMenuAberto('status')}
          >
            <Text style={[styles.filterText, filtroStatus !== 'Todos' && styles.filterTextAtivo]}>{filtroStatus}</Text>
            <ChevronDown color={filtroStatus !== 'Todos' ? "#FFF" : "#999"} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      {/* DateTimePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {/* Modais de Dropdown */}
      <RenderDropdown 
        visivel={menuAberto === 'planta'}
        opcoes={opcoesPlanta}
        selecionado={filtroPlanta}
        aoSelecionar={setFiltroPlanta}
        posicaoEsquerda="31%"
      />

      <RenderDropdown 
        visivel={menuAberto === 'status'}
        opcoes={opcoesStatus}
        selecionado={filtroStatus}
        aoSelecionar={setFiltroStatus}
        posicaoEsquerda="60%"
      />

      {/* Lista de Cards */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}>
        {dadosFiltrados.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.analysisCard}
            onPress={() => navigation.navigate('DiagnosticResult', { item, isAdminView: true })}
          >
            <View style={styles.cardInfo}>
              <View style={styles.imagePlaceholder}>
                 <Image source={{uri: 'https://via.placeholder.com/60'}} style={styles.thumbImage} />
              </View>
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
          <Text style={styles.emptyText}>Nenhuma análise encontrada.</Text>
        )}
      </ScrollView>

      <ConfirmationModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => setModalVisible(false)}
        title="Eliminar Registro?"
        message="Esta análise será removida permanentemente do sistema."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  headerPadding: { paddingHorizontal: 20 },
  
  // Card Total
  totalCard: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 20,
    alignItems: 'center', justifyContent: 'space-between', marginTop: 15, marginBottom: 20,
    borderWidth: 1, borderColor: '#F0F0F0', elevation: 3, shadowColor: '#000', shadowOpacity: 0.05
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  totalNumber: { fontSize: 22, fontWeight: '800', color: '#47e426', marginTop: 2 },
  shareBtn: { width: 45, height: 45, backgroundColor: '#e6f8e3', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

  // Barra de Filtros
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, zIndex: 10 },
  filterButton: { 
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', 
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: '#FFF', gap: 5
  },
  filterButtonAtivo: { backgroundColor: '#47e426', borderColor: '#47e426' },
  filterText: { color: '#999', fontWeight: '600', fontSize: 13 },
  filterTextAtivo: { color: '#FFF' },

  // Dropdown
  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  dropdownContainer: {
    position: 'absolute', top: 265, width: 140, backgroundColor: '#FFF',
    borderRadius: 15, elevation: 10, shadowOpacity: 0.1, borderWidth: 1, borderColor: '#F0F0F0'
  },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  dropdownText: { fontSize: 13, color: '#666' },

  // Cards da Lista
  analysisCard: { 
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 18, padding: 12, 
    marginBottom: 15, borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 
  },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#EBF5FB', overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  textGroup: { marginLeft: 12 },
  plantaNome: { fontSize: 16, fontWeight: '700', color: '#1B1919' },
  plantaStatus: { fontSize: 14, fontWeight: '700', marginVertical: 2 },
  plantaData: { fontSize: 11, color: '#BBB' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: '70%', backgroundColor: '#EEE', marginHorizontal: 12 },
  deleteBtn: { padding: 5 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 }
});