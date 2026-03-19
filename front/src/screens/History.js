import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, Platform, StatusBar
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronDown, Trash2, Check, Calendar as CalendarIcon, X
} from 'lucide-react-native';

import { THEME } from '../styles/Theme';
import { useTheme } from '../context/ThemeContext';
import { AppHeader, ConfirmationModal } from '../components/central.js';

const HISTORICO_DATA = [
  { id: '1', planta: 'Tomateiro', status: 'Saudável', data: '05/07/2025', corStatus: '#47e426' },
  { id: '2', planta: 'Arroz', status: 'Oídio', data: '05/07/2025', corStatus: '#E74C3C' },
  { id: '3', planta: 'Mandioca', status: 'Doente', data: '06/07/2025', corStatus: '#E74C3C' },
  { id: '4', planta: 'Batata', status: 'Saudável', data: '07/07/2025', corStatus: '#47e426' },
];

export default function HistoryScreen({ navigation }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? THEME.dark : THEME.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filtroPlanta, setFiltroPlanta] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataSelecionadaFormatada, setDataSelecionadaFormatada] = useState(null);
  const [menuAberto, setMenuAberto] = useState(null);

  const opcoesPlanta = ['Todas', 'Tomateiro', 'Arroz', 'Mandioca', 'Milho', 'Batata'];
  const opcoesStatus = ['Todos', 'Saudável', 'Doente', 'Desconhecido'];

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

  const dadosFiltrados = HISTORICO_DATA.filter(item => {
    const matchPlanta = filtroPlanta === 'Todas' || item.planta === filtroPlanta;
    const matchStatus = filtroStatus === 'Todos' || item.status === filtroStatus;
    const matchData = !dataSelecionadaFormatada || item.data === dataSelecionadaFormatada;
    return matchPlanta && matchStatus && matchData;
  });

  // Componente de Dropdown Flutuante Adaptado
  const RenderDropdown = ({ visivel, opcoes, selecionado, aoSelecionar, posicaoEsquerda }) => (
    <Modal visible={visivel} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={() => setMenuAberto(null)}>
        <View style={styles.modalOverlay}>
          <View style={[
            styles.dropdownContainer, 
            { 
              left: posicaoEsquerda, 
              backgroundColor: isDarkMode ? '#1A1D19' : '#FFF',
              borderColor: isDarkMode ? '#333' : '#F0F0F0'
            }
          ]}>
            {opcoes.map((opt) => (
              <TouchableOpacity 
                key={opt} 
                style={[styles.dropdownOption, { borderBottomColor: isDarkMode ? '#222' : '#F9F9F9' }]} 
                onPress={() => { aoSelecionar(opt); setMenuAberto(null); }}
              >
                {selecionado === opt && <Check color={THEME.primary} size={16} style={{marginRight: 8}} />}
                <Text style={[
                  styles.dropdownText, 
                  { color: isDarkMode ? '#CCC' : '#666' },
                  selecionado === opt && { color: THEME.primary, fontWeight: '700' }
                ]}>
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
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AppHeader title="Histórico" showBack={false} />

      {/* Barra de Filtros */}
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' },
            dataSelecionadaFormatada && styles.filterButtonAtivo
          ]} 
          onPress={() => setShowDatePicker(true)}
        >
          <CalendarIcon color={dataSelecionadaFormatada ? "#121411" : "#999"} size={16} style={{marginRight: 5}} />
          <Text style={[styles.filterText, dataSelecionadaFormatada && styles.filterTextAtivo]}>
            {dataSelecionadaFormatada || "Data"}
          </Text>
          {dataSelecionadaFormatada && (
            <TouchableOpacity onPress={() => setDataSelecionadaFormatada(null)} style={{marginLeft: 5}}>
               <X color="#121411" size={14} strokeWidth={3} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' },
            filtroPlanta !== 'Todas' && styles.filterButtonAtivo
          ]} 
          onPress={() => setMenuAberto('planta')}
        >
          <Text style={[styles.filterText, filtroPlanta !== 'Todas' && styles.filterTextAtivo]}>
            {filtroPlanta}
          </Text>
          <ChevronDown color={filtroPlanta !== 'Todas' ? "#121411" : "#999"} size={18} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' },
            filtroStatus !== 'Todos' && styles.filterButtonAtivo
          ]} 
          onPress={() => setMenuAberto('status')}
        >
          <Text style={[styles.filterText, filtroStatus !== 'Todos' && styles.filterTextAtivo]}>
            {filtroStatus}
          </Text>
          <ChevronDown color={filtroStatus !== 'Todos' ? "#121411" : "#999"} size={18} />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={onChangeDate}
          maximumDate={new Date()}
          themeVariant={isDarkMode ? 'dark' : 'light'}
        />
      )}

      <RenderDropdown visivel={menuAberto === 'planta'} opcoes={opcoesPlanta} selecionado={filtroPlanta} aoSelecionar={setFiltroPlanta} posicaoEsquerda="29%" />
      <RenderDropdown visivel={menuAberto === 'status'} opcoes={opcoesStatus} selecionado={filtroStatus} aoSelecionar={setFiltroStatus} posicaoEsquerda="51%" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 20 }}>
        {dadosFiltrados.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.historyCard, { backgroundColor: isDarkMode ? '#121411' : '#FFF', borderColor: isDarkMode ? '#222' : '#F0F0F0' }]}
            onPress={() => navigation.navigate('DiagnosticResult', { item })}
          >
            <View style={styles.cardInfo}>
              <View style={[styles.imagePlaceholder, { backgroundColor: isDarkMode ? '#1A1D19' : '#EBF5FB' }]} />
              <View style={styles.textGroup}>
                <Text style={[styles.plantaNome, { color: currentTheme.textPrimary }]}>{item.planta}</Text>
                <Text style={[styles.plantaStatus, { color: item.corStatus }]}>{item.status}</Text>
                <Text style={[styles.plantaData, { color: isDarkMode ? '#666' : '#BBB' }]}>{item.data}</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]} />
              <TouchableOpacity onPress={() => { setSelectedItem(item.id); setModalVisible(true); }} style={styles.deleteBtn}>
                <Trash2 color="#E74C3C" size={22} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {dadosFiltrados.length === 0 && (
          <Text style={{ textAlign: 'center', color: isDarkMode ? '#444' : '#999', marginTop: 40 }}>Nenhum registro encontrado.</Text>
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
  safeContainer: { flex: 1 },
  filterRow: { flexDirection: 'row', justifyContent: 'center', gap: 48, marginBottom: 25, marginTop: 10, zIndex: 10 },
  filterButton: { 
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, 
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12
  },
  filterButtonAtivo: { backgroundColor: '#47e426', borderColor: '#47e426' },
  filterText: { marginRight: 4, color: '#999', fontWeight: '700', fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
  dropdownContainer: {
    position: 'absolute', top: 141, width: 160,
    borderRadius: 18, elevation: 15, shadowColor: '#000', shadowOpacity: 0.2,
    shadowRadius: 15, borderWidth: 1, overflow: 'hidden'
  },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1 },
  dropdownText: { fontSize: 14 },

  historyCard: { 
    flexDirection: 'row', borderRadius: 20, padding: 14, 
    marginBottom: 15, borderWidth: 1, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  imagePlaceholder: { width: 65, height: 65, borderRadius: 14 },
  textGroup: { marginLeft: 15 },
  plantaNome: { fontSize: 17, fontWeight: '800' },
  plantaStatus: { fontSize: 14, fontWeight: '700', marginVertical: 3 },
  plantaData: { fontSize: 12 },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  divider: { width: 1, height: '60%', marginHorizontal: 12 },
  deleteBtn: { padding: 5 }
});